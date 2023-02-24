/* eslint-disable max-len */

import express, { Request, Response } from 'express'
import { UserService } from '../services/UserServies'
import { TokenService } from '../services/TokenService'

export type TPayload = {
    sub: number;
    title: string;
}

const login = express.Router()

login.post('/', async (req: Request, res: Response) => {
    const { login, password } = req.body

    try {
        const user = await UserService.getUserByLogin(login)
        if (!user || user.password !== password) {
            res.status(401).send('Bad login/password combination')
            return
        }

        const payload: TPayload = {
            sub: user.id,
            title: user.login
        }

        const tokenData = TokenService.generateTokens(payload)

        res.status(200).json(tokenData)
    } catch (e) {
        console.log(`There is an ${e} in ${req.method} method called with
         ${Object.keys(req.params).length ? `, params: ${JSON.stringify(req.params)}` : ''}${Object.keys(req.query).length ? `, query: ${JSON.stringify(req.query)}` : ''}`)
        res.status(404).end()
    }
})

export default login
