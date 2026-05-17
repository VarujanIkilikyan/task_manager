import _ from 'lodash';
import bcrypt from 'bcrypt';
import CryptoJS from 'crypto-js';

import DbMysql from "../05_clients/db.mysql.js";

export async function create({ name, age, email, password }) {
    try {
        const result = await DbMysql.query(
            `insert into users (name, age, email, password)
       values (?, ?, ?, ?);`,
            [name, age, email, password]
        );

        const id = _.get(result, '0.insertId', null);

        return await findById(id);
    } catch (error) {
        console.error(error);
        return null;
    }
}
