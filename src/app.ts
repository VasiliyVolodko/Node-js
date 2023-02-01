import express from 'express'
import { user, autoSuggestedUsers } from './routers/user'
import group from './routers/group'
import { db } from './data/config'
import { User } from './models/User'
import { Group } from './models/Group'
import { UserGroup } from './models/UserGroup'

const app = express()
const port = 3000

app.use(express.json())

app.use('/users', user)
app.use('/auto-suggested-users', autoSuggestedUsers)
app.use('/groups', group)


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

initApp()
