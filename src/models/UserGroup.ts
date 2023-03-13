import { DataTypes, Model } from 'sequelize'
import { db } from '../data/config'
import { Group } from './Group'
import { User } from './User'

class UserGroup extends Model {
    declare user_id: number
    declare group_id: number
}

UserGroup.init({
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        },
        unique: false
    },
    group_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Group,
            key: 'id'
        },
        unique: false
    }
}, {
    sequelize: db,
    modelName: 'UserGroup',
    tableName: 'user_group',
    timestamps: false
})

User.belongsToMany(Group, {
    through: UserGroup,
    foreignKey: 'user_id',
    otherKey: 'group_id'
})
Group.belongsToMany(User, {
    through: UserGroup,
    foreignKey: 'group_id',
    otherKey: 'user_id'
})

export { UserGroup }
