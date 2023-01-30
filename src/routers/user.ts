import express, { Request, Response } from 'express'
import {
    ValidatedRequest,
    createValidator
} from 'express-joi-validation'
import { UserAttributes } from '../models/User'
import { UserService } from '../services/UserServies'
import { bodySchema, UserRequestSchema } from '../validation/userShema'

const router = express.Router()

const validator = createValidator()

router.post('/', validator.body(bodySchema), async (req: ValidatedRequest<UserRequestSchema>, res: Response) => {
    const newUser: UserAttributes = req.body
    const user = await UserService.createUser(newUser)
    res.status(200).json(user)
})

router.patch('/:id', validator.body(bodySchema), async (req: ValidatedRequest<UserRequestSchema>, res: Response) => {
    const { id } = req.params
    const user = await UserService.updateUser(Number(id), req.body)
    res.status(200).json(user)
})

router.get('/', async (req, res: Response) => {
    const allUsers = await UserService.getUsers()
    res.status(200).json(allUsers)
})

router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const user: UserAttributes = await UserService.getUser(Number(id))
    if (user.isDeleted) {
        res.status(404).send('User not found')
    }
    res.status(200).json(user)
})

router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    await UserService.deleteUser(Number(id))
    res.status(200).send('User deleted successfully')
})

router.get('/auto-suggest-users', async (req: Request, res: Response) => {
    const { limit, loginSubstring } = req.query
    const allUsers = await UserService.getUsers()
    const filteredUsers = allUsers
        .sort((a, b) => a.login.localeCompare(b.login))
        .filter((user) => user.login.includes(loginSubstring as string))
        .slice(0, Number(limit))
    if (!filteredUsers.length) {
        res.status(404).send('Users not found')
    }
    res.status(200).json(filteredUsers)
})

export default router
