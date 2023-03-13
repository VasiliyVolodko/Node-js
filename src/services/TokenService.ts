import jwt from 'jsonwebtoken'
import type { TPayload } from '../routers/login'

const JWT_SECRET_ACCESS = 'jwt-secret-access'

export class TokenService {
    static generateTokens(payload: TPayload) {
        const accessToken = jwt.sign(payload, JWT_SECRET_ACCESS, { expiresIn: '1m' })
        return {
            accessToken
        }
    }

    static validateAccessToken(token: string) {
        try {
            const userData = jwt.verify(token, JWT_SECRET_ACCESS)
            return userData
        } catch (e) {
            return null
        }
    }
}
