import express, { NextFunction, Request, Response } from 'express'
import { user, autoSuggestedUsers } from './routers/user'
import group from './routers/group'
import { db } from './data/config'
import { User } from './models/User'
import { Group } from './models/Group'
import { UserGroup } from './models/UserGroup'
import * as expressWinston from 'express-winston'
import cors, { CorsOptions } from 'cors'
import login from './routers/login'
import { logger } from './logger/logger'

const app = express()
const port = 3000

app.use(express.json())

const getMessage = (req: Request): string =>
    `method:
    {{req.method}}
    ${Object.keys(req.params).length ? `, params: ${JSON.stringify(req.params)}` : ''}
    ${Object.keys(req.query).length ? `, query: ${JSON.stringify(req.query)}` : ''}`

app.use(expressWinston.logger({
    winstonInstance: logger,
    meta: false,
    msg: getMessage
}))

const options: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  credentials: true,
  methods: 'GET,PATCH,POST,DELETE,OPTIONS',
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}

app.use(cors(options))

app.use('/users', user)
app.use('/auto-suggested-users', autoSuggestedUsers)
app.use('/groups', group)
app.use('/login', login)

app.use(clientErrorHandler)

process
    .on('uncaughtException', (err) => {
        logger.error('Uncaught Exception thrown' + err.message)
        process.exit(1)
    })

const initApp = async () => {
    try {
        await db.authenticate()
        logger.info('Connection has been established successfully.')
        User.sync()
        Group.sync()
        UserGroup.sync()

        app.listen(port, () => {
            logger.info(`Example app listening on port ${port}`)
        })
    } catch (error) {
        logger.error('Unable to connect to the database:', error.original)
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
