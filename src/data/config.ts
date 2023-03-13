import { Sequelize } from 'sequelize' 
import dotenv from 'dotenv'

dotenv.config({ debug: true })

export const db = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_URL,
  dialect: 'postgres'
})
