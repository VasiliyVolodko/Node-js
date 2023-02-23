/* eslint-disable max-len */

import express, { Request, Response } from 'express'
import {
    ValidatedRequest,
    createValidator
} from 'express-joi-validation'
import { UserAttributes } from '../models/User'
import { UserService } from '../services/UserServies'
import { userBodySchema, UserRequestSchema } from '../validation/userShema'

const user = express.Router()
const autoSuggestedUsers = express.Router()

const validator = createValidator()

user.post('/', validator.body(userBodySchema), async (req: ValidatedRequest<UserRequestSchema>, res: Response) => {
    const newUser: UserAttributes = req.body
    const user = await UserService.createUser(newUser)
    res.status(200).json(user)
})

user.patch('/:id', validator.body(userBodySchema), async (req: ValidatedRequest<UserRequestSchema>, res: Response) => {
    const { id } = req.params
    if (!id) {
        res.status(404).send(`User ${id} not found`)
        return
    }
    try {
        const user = await UserService.updateUser(Number(id), req.body)
        if (!user) {
            res.status(404).send(`User ${id} not found`)
            return
        }
        res.status(200).json(user)
    } catch (e) {
        console.log(`There is an ${e} in ${req.method} method called with ${Object.keys(req.params).length ? `, params: ${JSON.stringify(req.params)}` : ''}${Object.keys(req.query).length ? `, query: ${JSON.stringify(req.query)}` : ''}`)
        res.status(404).end()
    }

})

user.get('/', async (req, res: Response) => {
    try {
        const allUsers = await UserService.getUsers()
        res.status(200).json(allUsers)
    } catch (e) {
        console.log(`There is an ${e} in ${req.method} method called with ${Object.keys(req.params).length ? `, params: ${JSON.stringify(req.params)}` : ''}${Object.keys(req.query).length ? `, query: ${JSON.stringify(req.query)}` : ''}`)
        res.status(404).end()
    }
})

user.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id) {
        res.status(404).send(`User ${id} not found`)
        return
    }
    try {
        const user: UserAttributes = await UserService.getUser(Number(id))
        if (!user || user.isDeleted) {
            res.status(404).send(`User ${id} not found`)
            return
        } else {
            res.status(200).json(user)
        }
    } catch (e) {
        console.log(`There is an ${e} in ${req.method} method called with ${Object.keys(req.params).length ? `, params: ${JSON.stringify(req.params)}` : ''}${Object.keys(req.query).length ? `, query: ${JSON.stringify(req.query)}` : ''}`)
        res.status(404).end()
    }
})

user.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id) {
        res.status(404).send(`User ${id} not found`)
        return
    }
    try {
        const user: UserAttributes = await UserService.getUser(Number(id))
        if (user.isDeleted) {
            res.status(404).send(`User ${id} not found`)
            return
        }

        await UserService.deleteUser(Number(id))
        res.status(200).send('User deleted successfully')
    } catch (e) {
        console.log(`There is an ${e} in ${req.method} method called with ${Object.keys(req.params).length ? `, params: ${JSON.stringify(req.params)}` : ''}${Object.keys(req.query).length ? `, query: ${JSON.stringify(req.query)}` : ''}`)
        res.status(404).end()
    }
})

autoSuggestedUsers.get('/', async (req: Request, res: Response) => {
    const { limit, loginSubstring } = req.query
    try {
        const users = await UserService.getAutoSuggestedUsers(loginSubstring as string, Number(limit))
        if (!users.length) {
            res.status(404).send('Users not found')
        } else {
            res.status(200).json(users)
        }
    } catch (e) {
        console.log(`There is an ${e} in ${req.method} method called with ${Object.keys(req.params).length ? `, params: ${JSON.stringify(req.params)}` : ''}${Object.keys(req.query).length ? `, query: ${JSON.stringify(req.query)}` : ''}`)
        res.status(404).end()
    }
})

export {
    user,
    autoSuggestedUsers
}
