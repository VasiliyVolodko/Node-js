import { NextFunction, Request, Response } from 'express'
import { TokenService } from '../services/TokenService'

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['access-token']
        if (!token) {
            res.status(401).send('Unauthorized Error').end()
            return
        }

        const userData = TokenService.validateAccessToken(token as string)
        if (!userData) {
            res.status(403).send('Forbidden Error').end()
            return
        }
        next()
    } catch (e) {
        return next(new Error('smth went wrong'))
    }
}
