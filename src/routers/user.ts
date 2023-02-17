import express, { Request, Response } from 'express'
import {
    ValidatedRequest,
    createValidator
} from 'express-joi-validation'
import { UserAttributes } from '../models/User'
import { UserService } from '../services/UserServies'
import { bodySchema, UserRequestSchema } from '../validation/userShema'

const user = express.Router()
const autoSuggestedUsers = express.Router()

const validator = createValidator()

user.post('/', validator.body(bodySchema), async (req: ValidatedRequest<UserRequestSchema>, res: Response) => {
    const newUser: UserAttributes = req.body
    const user = await UserService.createUser(newUser)
    res.status(200).json(user)
})

user.patch('/:id', validator.body(bodySchema), async (req: ValidatedRequest<UserRequestSchema>, res: Response) => {
    const { id } = req.params
    const user = await UserService.updateUser(Number(id), req.body)
    res.status(200).json(user)
})

user.get('/', async (req, res: Response) => {
    const allUsers = await UserService.getUsers()
    res.status(200).json(allUsers)
})

user.get('/:id', async (req: Request, res: Response) => {
    console.log('there')
    const { id } = req.params
    const user: UserAttributes = await UserService.getUser(Number(id))
    if (!user || user.isDeleted) {
        res.status(404).send('User not found')
    } else {
        res.status(200).json(user)
    }
})

user.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
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
