import { User, UserAttributes } from '../models/User'
import { Op } from 'sequelize'

export class UserService {
    static async getUsers(): Promise<UserAttributes[]> {
        const allUsers = await User.findAll({
            where: {
                isDeleted: false
            }
        })
        return allUsers
    }

    static async getAutoSuggestedUsers(substr?: string, limit?: number): Promise<UserAttributes[]> {
        let users: UserAttributes[]
        if (!substr) {
            users = await UserService.getUsers()
        } else {
            users = await User.findAll({
                where: {
                    login: {
                        [Op.substring]: substr
                    }
                }
            })
        }
        if (!limit) {
            return users
        } else {
            return users.slice(0, limit)
        }
    }

    static async createUser(newUser: UserAttributes): Promise<UserAttributes> {
        const user = await User.create(newUser)
        return user
    }

    static async getUser(id: number): Promise<UserAttributes> {
        const user = await User.findByPk(id)
        return user
    }

    static async deleteUser(id: number) {
        const user = await User.update({isDeleted: true}, {
            where: {
                id
            }
        })
        return user
    }

    static async updateUser(id: number, updateUser: Partial<UserAttributes>) {
        const user = await User.update(updateUser, {
            where: {
                id
            }
        })
        return user
    }
}
