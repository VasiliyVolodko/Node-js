/* eslint-disable max-len */

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
import { logger } from '../logger/logger'

const group = express.Router()

const validator = createValidator()

group.post('/', validator.body(groupBodySchema), async (req: ValidatedRequest<GroupRequestSchema>, res: Response) => {
    const newGroup: GroupAttributes = req.body
    try {
        const group = await GroupService.createGroup(newGroup)
        res.status(200).json(group)
    } catch (e) {
        logger.error(`There is an ${e} in ${req.method} method called with
         ${Object.keys(req.params).length ? `, params: ${JSON.stringify(req.params)}` : ''}${Object.keys(req.query).length ? `, query: ${JSON.stringify(req.query)}` : ''}`)
        res.status(404).end()
    }
})

group.patch('/:id', validator.body(groupBodySchema), async (req: ValidatedRequest<GroupRequestSchema>, res: Response) => {
    const { id } = req.params
    try {
        const group = await GroupService.updateGroup(Number(id), req.body)
        if (!group) {
            res.status(404).send(`Group ${id} not found`)
            return
        }
        res.status(200).json(group)
    } catch (e) {
        logger.error(`There is an ${e} in ${req.method} method called with ${Object.keys(req.params).length ? `, params: ${JSON.stringify(req.params)}` : ''}${Object.keys(req.query).length ? `, query: ${JSON.stringify(req.query)}` : ''}`)
        res.status(404).end()
    }
})

group.get('/', async (req, res: Response) => {
    try {
        const allGroups = await GroupService.getGroups()
        res.status(200).json(allGroups)
    } catch (e) {
        logger.error(`There is an ${e} in ${req.method} method called with ${Object.keys(req.params).length ? `, params: ${JSON.stringify(req.params)}` : ''}${Object.keys(req.query).length ? `, query: ${JSON.stringify(req.query)}` : ''}`)
        res.status(404).end()
    }
})

group.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const group: GroupAttributes = await GroupService.getGroup(Number(id))
        if (!group) {
            res.status(404).send(`Group ${id} not found`)
            return
        }
        res.status(200).json(group)
    } catch (e) {
        logger.error(`There is an ${e} in ${req.method} method called with ${Object.keys(req.params).length ? `, params: ${JSON.stringify(req.params)}` : ''}${Object.keys(req.query).length ? `, query: ${JSON.stringify(req.query)}` : ''}`)
        res.status(404).end()
    }
})

group.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const group: GroupAttributes = await GroupService.getGroup(Number(id))
        if (!group) {
            res.status(404).send(`Group ${id} not found`)
            return
        }
        await GroupService.deleteGroup(Number(id))
        res.status(200).send('Group deleted successfully')
    } catch (e) {
        logger.error(`There is an ${e} in ${req.method} method called with ${Object.keys(req.params).length ? `, params: ${JSON.stringify(req.params)}` : ''}${Object.keys(req.query).length ? `, query: ${JSON.stringify(req.query)}` : ''}`)
        res.status(404).end()
    }
})

group.post('/:id/addUsers', validator.body(addUserToGroupBodySchema), async (req: Request, res: Response) => {
    const { id } = req.params
    const { userIds }: {userIds: number[]} = req.body
    try {
        const group: GroupAttributes = await GroupService.getGroup(Number(id))
        if (!group) {
            res.status(404).send(`Group ${id} not found`)
            return
        }

        const users: { userId: number, user: UserAttributes }[] = await Promise.all(userIds.map(async (userId) => {
            const user = await UserService.getUser(userId)
            return Promise.resolve({ userId, user })
        }))

        const usersNotExists = users.filter((user) => !user.user)

        if (!usersNotExists) {
            await GroupService.addUsersToGroup(Number(id), userIds)
            res.status(200).send('Users added to group successfully')
        } else {
            const users = usersNotExists.map((user) => user.userId)
            res.status(404).send(`Group${users.length === 1 ? '' : 's'} ${users} not found`)
        }
    } catch (e) {
        logger.error(`There is an ${e} in ${req.method} method called with ${Object.keys(req.params).length ? `, params: ${JSON.stringify(req.params)}` : ''}${Object.keys(req.query).length ? `, query: ${JSON.stringify(req.query)}` : ''}`)
        res.status(404).end()
    }
})

export default group
