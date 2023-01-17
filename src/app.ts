import express from 'express'
import router from './routers/user'
import { db } from './data/config'
import { User } from './models/User'

const app = express()
const port = 3000

app.use(express.json())

app.use('/users', router)

const initApp = async () => {
    try {
        await db.authenticate();
        console.log("Connection has been established successfully.")
        User.sync()

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    } catch (error) {
        console.error("Unable to connect to the database:", error.original);
    }
}

initApp()
