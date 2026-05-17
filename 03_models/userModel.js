import _ from 'lodash';
import bcrypt from 'bcrypt';
import CryptoJS from 'crypto-js';

import DbMysql from "../05_clients/db.mysql.js";

export default {
    async create({name, email, password}) {
        try {
            const result = await DbMysql.query(
                `insert into users (username, email, password)
                 values (?, ?, ?);`,
                [name, email, password]
            );

            const id = _.get(result, '0.insertId', null);

            return await this.findUserById(id);
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
    }
}

