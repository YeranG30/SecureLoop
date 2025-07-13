/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response, type NextFunction } from 'express'
import { ProductModel } from '../models/product'
import { BasketModel } from '../models/basket'
import * as challengeUtils from '../lib/challengeUtils'

import * as utils from '../lib/utils'
import * as security from '../lib/insecurity'
import { challenges } from '../data/datacache'

export function retrieveBasket () {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id, 10)
    const user = security.authenticatedUsers.from(req)

    // 🛡️ Secure: Only allow access to own basket
    if (!user || user.bid !== id) {
      return res.status(403).json({ error: 'Access to this basket is forbidden.' })
    }

    BasketModel.findOne({
      where: {
        id,
        UserId: user.data.id
      },
      include: [
        {
          model: ProductModel,
          paranoid: false,
          as: 'Products'
        }
      ]
    })
      .then((basket: BasketModel | null) => {
        challengeUtils.solveIf(challenges.basketAccessChallenge, () => {
          return true // Challenge gets solved if the previous insecure access was possible
        })

        if (basket?.Products?.length) {
          for (let i = 0; i < basket.Products.length; i++) {
            basket.Products[i].name = req.__(basket.Products[i].name)
          }
        }

        res.json(utils.queryResultToJson(basket))
      })
      .catch((error: Error) => {
        next(error)
      })
  }
}
