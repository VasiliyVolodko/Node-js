import express, { Request, Response } from 'express'
import {
    ValidatedRequest,
    createValidator
} from 'express-joi-validation'
import { User } from './models/User'
import { bodySchema, UserRequestSchema } from './validation/userShema'


const app = express()
const port = 3000

const validator = createValidator()

app.use(express.json())

const UserList: User[] = []

app.post('/users', validator.body(bodySchema), (req: ValidatedRequest<UserRequestSchema>, res: Response) => {
    const { login, password, age } = req.body
    const newUser = new User(login, password, age)
    UserList.push(newUser)
    res.status(200).json(newUser)
})

app.patch('/users/:id', validator.body(bodySchema), (req: ValidatedRequest<UserRequestSchema>, res: Response) => {
    const { id } = req.params
    const userIndex = UserList.findIndex((user) => user.id === id)
    if (userIndex !== -1) {
        UserList[userIndex] = {
            ...UserList[userIndex],
            ...req.body
        }
        res.status(200).end()
    } else {
        res.status(404).send('User not found')
    }
})

app.get('/users', (req, res:Response) => {
    res.status(200).json(UserList.filter((user) => !user.isDeleted))
})

app.get('/users/:id', (req: Request, res: Response) => {
    const { id } = req.params
    const user = UserList.find((user) => user.id === id)
    if (!user) {
        res.status(404).send('User not found')
        return
    }
    if (user.isDeleted) {
        res.status(404).send('User not found')
    } else {
        res.status(200).json(user)
    }
})

app.delete('/users/:id', (req: Request, res: Response) => {
    const { id } = req.params
    const userIndex = UserList.findIndex((user) => user.id === id)
    if (userIndex !== -1) {
        UserList[userIndex].isDeleted = true
        res.status(200).end()
    } else {
        res.status(404).end()
    }
})

app.get('/auto-suggest-users', (req: Request, res: Response) => {
    const { limit, loginSubstring } = req.query
    const filteredUsers = UserList
        .sort((a, b) => a.login.localeCompare(b.login))
        .filter((user) => user.login.includes(loginSubstring as string))
        .slice(0, Number(limit))
    if (!filteredUsers.length) {
        res.status(200).send([])
    } else {
        res.status(200).json(filteredUsers)
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
