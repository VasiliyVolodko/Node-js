import { UserGroup } from '../models/UserGroup'
import { db } from '../data/config'
import { Group, GroupAttributes } from '../models/Group'

export class GroupService {
    static async getGroups(): Promise<GroupAttributes[]> {
        const allGroups = await Group.findAll()
        return allGroups
    }

    static async createGroup(newGroup: GroupAttributes): Promise<GroupAttributes> {
        const group = await Group.create(newGroup)
        return group
    }

    static async getGroup(id: number): Promise<GroupAttributes> {
        const user = await Group.findByPk(id)
        return user
    }

    static async deleteGroup(id: number) {
        const user = await Group.destroy({
            where: {
                id
            }
        })
        return user
    }

    static async updateGroup(id: number, updateGroup: Partial<GroupAttributes>) {
      const group = await Group.update(updateGroup, {
            where: {
                id
            }
        })
      return group
    }

    static async addUsersToGroup(id: number, userIds: number[]) {
        try {
            const result = await Promise.all(userIds.map(async (userId) => {
                const res = await db.transaction(async () => {
                    return await UserGroup.create({
                        group_id: id,
                        user_id: userId
                    })
                })

                return Promise.resolve(res)
            }))
            return result
        } catch (e) {
            console.log(e)
        }
    }
}
