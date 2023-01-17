import { Sequelize } from "sequelize";

export const db = new Sequelize('atycubwu', 'atycubwu', '8hL_MMVJHtCNEGt8ebU4ClISr4XOYDqA', {
    host: 'mel.db.elephantsql.com',
    dialect: 'postgres'
});