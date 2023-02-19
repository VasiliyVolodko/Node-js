import { DataTypes, Model, Optional } from 'sequelize'
import { db } from '../data/config'

export type UserAttributes = {
    id?: number;
    login: string;
    password: string;
    age: number;
    isDeleted?: boolean;
};

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'isDeleted'>;

class User extends Model<UserAttributes, UserCreationAttributes> {
    declare id?: number
    declare login: string
    declare password: string
    declare age: number
    declare isDeleted?: boolean
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isDeleted: {
        type: DataTypes.BOOLEAN
    }
}, {
    sequelize: db,
    modelName: 'User',
    tableName: 'users',
    timestamps: false
})

export { User }
