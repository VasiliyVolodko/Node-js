import express, { NextFunction, Request, Response } from 'express'
import { user, autoSuggestedUsers } from './routers/user'
import group from './routers/group'
import { db } from './data/config'
import { User } from './models/User'
import { Group } from './models/Group'
import { UserGroup } from './models/UserGroup'
import * as winston from 'winston'
import * as expressWinston from 'express-winston'

const app = express()
const port = 3000

app.use(express.json())

const getMessage = (req: Request): string =>
    `method:
    {{req.method}}
    ${Object.keys(req.params).length ? `, params: ${JSON.stringify(req.params)}` : ''}
    ${Object.keys(req.query).length ? `, query: ${JSON.stringify(req.query)}` : ''}`

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console({

        })
    ],
    meta: false,
    msg: getMessage
}))

app.use('/users', user)
app.use('/auto-suggested-users', autoSuggestedUsers)
app.use('/groups', group)

app.use(clientErrorHandler)

process
    .on('uncaughtException', (err) => {
        console.error(err, 'Uncaught Exception thrown')
        process.exit(1)
    })

const initApp = async () => {
    try {
        await db.authenticate()
        console.log('Connection has been established successfully.')
        User.sync()
        Group.sync()
        UserGroup.sync()

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    } catch (error) {
        console.error('Unable to connect to the database:', error.original)
    }
}

function clientErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (req.xhr) {
        res.status(500).send({ error: 'Internal Server Error' })
    } else {
        next(err)
    }
}

initApp()
