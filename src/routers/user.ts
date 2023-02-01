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
    const user = await UserService.updateUser(Number(id), req.body)
    if(!user) {
        res.status(404).send(`User ${id} not found`)
        return
    }
    res.status(200).json(user)
})

user.get('/', async (req, res: Response) => {
user.get('/', async (req, res: Response) => {
    const allUsers = await UserService.getUsers()
    res.status(200).json(allUsers)
})

user.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const user: UserAttributes = await UserService.getUser(Number(id))
    if (!user || user.isDeleted) {
        res.status(404).send(`User ${id} not found`)
        return
    } else {
        res.status(200).json(user)
    }
})

user.delete('/:id', async (req: Request, res: Response) => {
user.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params

    const user: UserAttributes = await UserService.getUser(Number(id))
    if (user.isDeleted) {
        res.status(404).send(`User ${id} not found`)
        return
    }

    await UserService.deleteUser(Number(id))
    res.status(200).send('User deleted successfully')
})

autoSuggestedUsers.get('/', async (req: Request, res: Response) => {
    const { limit, loginSubstring } = req.query
    const users = await UserService.getAutoSuggestedUsers(loginSubstring as string, Number(limit))
    if (!users.length) {
        res.status(404).send('Users not found')
    } else {
        res.status(200).json(users)
    }
})

export {
    user,
    autoSuggestedUsers
}
