import express, { Request, Response } from 'express'
import {
    ValidatedRequest,
    createValidator
} from 'express-joi-validation'
import { UserService } from '../services/UserServies'
import { GroupAttributes } from '../models/Group'
import { GroupService } from '../services/GroupServies'
import { GroupRequestSchema, groupBodySchema, addUserToGroupBodySchema } from '../validation/groupShema'
import { UserAttributes } from '../models/User'

const group = express.Router()

const validator = createValidator()

group.post('/', validator.body(groupBodySchema), async (req: ValidatedRequest<GroupRequestSchema>, res: Response) => {
    const newGroup: GroupAttributes = req.body
    const group = await GroupService.createGroup(newGroup)
    res.status(200).json(group)
})

group.patch('/:id', validator.body(groupBodySchema), async (req: ValidatedRequest<GroupRequestSchema>, res: Response) => {
    const { id } = req.params
    const group = await GroupService.updateGroup(Number(id), req.body)
    if(!group) {
        res.status(404).send(`Group ${id} not found`)
        return
    }
    res.status(200).json(group)
})

group.get('/', async (req, res: Response) => {
    const allGroups = await GroupService.getGroups()
    res.status(200).json(allGroups)
})

group.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const group: GroupAttributes = await GroupService.getGroup(Number(id))
    if (!group) {
        res.status(404).send(`Group ${id} not found`)
        return
    }
    res.status(200).json(group)
})

group.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const group: GroupAttributes = await GroupService.getGroup(Number(id))
    if (!group) {
        res.status(404).send(`Group ${id} not found`)
        return
    }
    await GroupService.deleteGroup(Number(id))
    res.status(200).send('Group deleted successfully')
})

group.post('/:id/addUsers', validator.body(addUserToGroupBodySchema), async (req: Request, res: Response) => {
    const { id } = req.params
    const { userIds }: {userIds: number[]} = req.body
    const group: GroupAttributes = await GroupService.getGroup(Number(id))
    if (!group) {
        res.status(404).send(`Group ${id} not found`)
        return
    }

    const users: {userId: number, user: UserAttributes}[] = await Promise.all(userIds.map(async (userId) => {
        const user = await UserService.getUser(userId)
        return Promise.resolve({userId, user})
    }))

    const usersNotExists = users.filter((user) => !user.user)

    if(!usersNotExists) {
        await GroupService.addUsersToGroup(Number(id), userIds)
        res.status(200).send('Users added to group successfully')
    } else {
        const users = usersNotExists.map((user) => user.userId)
        res.status(404).send(`Group${users.length === 1 ? '' : 's'} ${users} not found`)  
    }
})

export default group
