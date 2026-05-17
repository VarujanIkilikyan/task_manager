import _ from 'lodash';


import DbMysql from "../05_clients/db.mysql.js";

export default {
    async create(username, email, password) {
        try {
            const result = await DbMysql.query(
                `insert into users (username, email, password)
                 values (?, ?, ?);`,
                [username, email, password]
            );


            return await this.findUserByEmail(email);
        } catch (error) {
            console.error(error);
            return null;
        }
    },  async findUserByEmail(email) {
        try {
            const [result = null] = (await DbMysql.query(
                `SELECT *
                 FROM users
                 WHERE email = ? limit 1;`,
                [email]
            )) || [];

            return _.head(result) || null;
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    async findUserById(id) {
        try {
            const [result = null] = (await DbMysql.query(
                `SELECT *
                 FROM users
                 WHERE id = ? limit 1;`,
                [id]
            )) || [];

            return _.head(result) || null;
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    async checkUsernameExists(username) {
        try {
            const [result = null] = (await DbMysql.query(
                `SELECT *
       FROM users
       WHERE username = ?
       limit 1;`,
                [username]
            )) || [];

            return !_.isEmpty(result);
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    async checkEmailExists(email) {
        try {
            const [result = null] = (await DbMysql.query(
                `SELECT *
       FROM users
       WHERE email = ?
       limit 1;`,
                [email]
            )) || [];

            return !_.isEmpty(result);
        } catch (error) {
            console.error(error);
            return null;
        }
    },
}

