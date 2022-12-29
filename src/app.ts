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

app.post('/user', validator.body(bodySchema), (req: ValidatedRequest<UserRequestSchema>, res: Response) => {
  const { login, password, age } = req.body
  const newUser = new User(login, password, age)
  UserList.push(newUser)
  res.status(200).end()
})

app.patch('/user', (req: ValidatedRequest<UserRequestSchema>, res: Response) => {
    const { id } = req.query
    const userIndex = UserList.findIndex(user => user.id === id)
    UserList[userIndex] = {
        ...UserList[userIndex],
        ...req.body
    }
    res.status(200).end()
})

app.get('/users', (req, res:Response) => {
    res.status(200).json(JSON.stringify(UserList.filter(user => !user.isDeleted)))
})

app.get('/user', (req: Request, res: Response) => {
    const { id } = req.query
    const user = UserList.find(user => user.id === id)
    if (user.isDeleted) {
        res.status(404).send('User not found')
    }
    res.status(200).json(JSON.stringify(user))
})

app.delete('/user', (req: Request, res: Response) => {
    const { id } = req.query
    UserList.find(user => user.id === id).isDeleted = true
    res.status(200).end()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})