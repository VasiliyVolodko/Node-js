import { DataTypes, Model, Optional } from 'sequelize'
import { Permission } from '../validation/groupShema'
import { db } from '../data/config'

export type GroupAttributes = {
    id?: number;
    name: string;
    permissions: Array<Permission>;
};

type GroupCreationAttributes = Optional<GroupAttributes, 'id'>;

class Group extends Model<GroupAttributes, GroupCreationAttributes> {
    declare id?: number
    declare name: string
    declare permissions: Array<Permission>
}

Group.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    permissions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'Group',
    tableName: 'groups',
    timestamps: false
})

export { Group }
