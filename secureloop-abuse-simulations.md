
# SecureLoop: Advanced Application Security Simulation on OWASP Juice Shop

This document captures a realistic application security assessment of OWASP Juice Shop, simulating four high-impact attack scenarios commonly observed in production environments. Each simulation is designed to represent real-world AppSec threats, with structured descriptions and potential mitigation recommendations.

---

## 1. Insecure Direct Object Reference (IDOR)

**Overview:**  
OWASP Juice Shop allows users to retrieve order history by accessing `/rest/user/orders`. A user should only access their own orders, but object identifiers are not securely enforced.

**Steps to Reproduce:**
1. Log in as a regular user and place an order.
2. Capture the request to `/rest/user/orders`.
3. Change the `Authorization` header to another valid JWT (e.g., another test user).
4. Replay the request — other users’ order details are returned.

**Impact:**  
Violation of access control, unauthorized disclosure of PII.

**Mitigation:**  
Enforce object-level access control and verify ownership of resources server-side.

---

## 2. JWT None Algorithm Attack

**Overview:**  
If JWT validation is misconfigured, it's possible to modify the JWT `alg` field to `"none"` and remove the signature, tricking the application into accepting a forged token.

**Steps to Reproduce:**
1. Decode a valid JWT using `jwt.io`.
2. Set the `alg` to `none` and remove the signature.
3. Modify the payload to impersonate an admin user (`"role": "admin"`).
4. Use the modified JWT in the `Authorization` header.

**Impact:**  
Privilege escalation to administrator.

**Mitigation:**  
Never allow insecure algorithms (`none`, `HS256` without proper keys). Enforce strict JWT validation using libraries that disallow `none`.

---

## 3. Client-Side Validation Bypass – Negative Quantity Purchase

**Overview:**  
The frontend enforces quantity restrictions during purchase, but the backend does not. An attacker can send a direct request with a negative quantity, leading to unintended account credit.

**Steps to Reproduce:**
1. Add an item to the basket.
2. Intercept the `POST /api/BasketItems` request.
3. Modify the JSON payload: `"quantity": -100`.
4. Send the request and observe the account balance increase.

**Impact:**  
Business logic bypass, potential financial fraud.

**Mitigation:**  
Always validate user input on the server-side, not just the client-side.

---

## 4. DOM-based XSS via Search Field

**Overview:**  
The search feature is vulnerable to DOM-based XSS, which executes in the browser when a malicious string is entered in the URL query string.

**Steps to Reproduce:**
1. Navigate to:  
   `http://localhost:3000/#/search?q=<img src=x onerror=alert(1)>`
2. Observe the JavaScript alert triggered by XSS.

**Impact:**  
Client-side code execution, possible session hijacking or phishing.

**Mitigation:**  
Escape all user input used in the DOM. Use frameworks with built-in XSS protection and implement a CSP (Content Security Policy).

---

## Summary

This simulation project emulates high-risk vulnerabilities aligned with OWASP Top 10 and real-world threat scenarios. These findings demonstrate the importance of layered defense mechanisms across both frontend and backend systems.

