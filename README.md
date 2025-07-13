# SecureLoop

SecureLoop is a hardened fork of OWASP Juice Shop, applying secure-by-design principles to modern Node.js applications. It demonstrates a full-cycle approach to web application security—identifying, fixing, and preventing critical vulnerabilities—while integrating static and dynamic analysis tooling as part of a secure development workflow.

## Overview

Built from the intentionally vulnerable OWASP Juice Shop, SecureLoop transforms it into a secure-by-default application. This project highlights core areas of product security, including secure coding, automated vulnerability scanning, route-level hardening, and CI-integrated static analysis.

## Security Enhancements

SecureLoop systematically remediates common web vulnerabilities and enforces secure defaults across the application.

| Vulnerability Type              | Status   | Location / Route                 | Summary                                                                 |
|--------------------------------|----------|----------------------------------|-------------------------------------------------------------------------|
| SQL Injection                  | Fixed    | `routes/login.ts`                | Switched to parameterized queries, preventing raw SQL execution.       |
| Broken Access Control          | Fixed    | `routes/basket.ts`, `updateBasket.ts` | Enforced checks to restrict access to authenticated users only. |
| Race Condition (Concurrency)   | Fixed    | `routes/order.ts`                | Ensured atomicity in order placement and state updates.                |
| Insecure Direct Object Reference (IDOR) | Fixed    | `routes/basket.ts`                | Validated resource ownership before access.                            |
| Unvalidated Redirects          | Fixed    | `routes/redirect.ts`             | Enforced strict URL whitelisting.                                      |
| Security Misconfiguration      | Fixed    | Global headers / CSP             | Applied hardened HTTP headers and CSP rules.                           |
| Improper Error Handling        | Partial  | Global error handler stubbed     | Generic error responses implemented to avoid leakage.                  |

## Secure Development & Automation

SecureLoop emphasizes modern DevSecOps through security automation, test coverage, and continuous analysis.

### Integrated Tools

- **Trivy**
  - Scans the Dockerfile and file system for misconfigurations and vulnerable dependencies.
- **Semgrep**
  - Detects insecure coding patterns using custom and community rules.
  - Integrated with GitHub Actions for CI-based enforcement.
- **Jest**
  - Unit test coverage for all modified and secured routes.

## Project Layout

```
SecureLoop/
├── routes/              # Secured API route logic
├── models/              # Sequelize models
├── lib/                 # Utilities and helper modules
├── data/                # Seed data
├── tests/               # Unit and static/dynamic security tests
├── .github/workflows/   # CI pipelines with Semgrep & Trivy
├── Dockerfile           # Hardened container setup
└── README.md            # Project documentation
```

## Getting Started

To set up the project locally:

```bash
git clone https://github.com/YeranG30/SecureLoop.git
cd SecureLoop
npm install
npm run start
```

To run tests and scans:

```bash
# Jest unit tests
npm run test

# Semgrep static analysis
semgrep --config=auto

# Trivy full filesystem scan
trivy fs .
```

## Summary

SecureLoop demonstrates a grounded and practical implementation of secure coding and automated security testing. The project reflects strong application security awareness with targeted remediations and DevSecOps integration.
