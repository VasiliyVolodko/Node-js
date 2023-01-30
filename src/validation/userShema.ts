import Joi from 'joi'
import {
    ContainerTypes,
    ValidatedRequestSchema
} from 'express-joi-validation'

export const bodySchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^(?=.*?[A-Za-z])(?=.*?[0-9])')).required(),
    age: Joi.number().min(4).max(130).required()
})

export interface UserRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        login: string,
        password: string,
        age: number
    }
}
