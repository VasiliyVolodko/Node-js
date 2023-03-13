import Joi from 'joi'
import {
    ContainerTypes,
    ValidatedRequestSchema
} from 'express-joi-validation'

export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES'

export const groupBodySchema = Joi.object({
    name: Joi.string().required(),
    permissions: Joi.array().items(Joi.string().valid('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES')).required()
})

export interface GroupRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        name: string,
        permissions: Array<Permission>
    }
}

export const addUserToGroupBodySchema = Joi.object({
    userIds: Joi.array().items(Joi.number()).required()
})
