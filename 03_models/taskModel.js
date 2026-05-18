import _ from 'lodash';


import DbMysql from "../05_clients/db.mysql.js";

export default {
    async createTask(userId, title, description, taskDate) {
        try {
            const result = await DbMysql.query(
                `insert into tasks (userId, title, description, taskDate)
                 values (?, ?, ?, ?);`,
                [userId, title, description, taskDate],
            );
            const taskId = _.get(result, '0.insertId', null);


            return await this.getTaskById(taskId, userId);
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    async getAllTasksByUser(userId, limit, offset) {

    },
    async getTotalTasksCountByUser(userId) {
        try {
            const [[{ count }]] = await DbMysql.query(
                `SELECT COUNT(*) AS count
                 FROM tasks
                 WHERE userId = ?`,
                [userId]
            );
            return count || 0;
        }catch (error) {
            console.error(error);
            return null;
        }

    },
    async getTaskById(taskId, userId) {
        try {
            const [result = null] = (await DbMysql.query(
                `SELECT *
                 FROM tasks
                 WHERE userId = ?
                   AND taskId = ? LIMIT 1;`,
                [userId, taskId]
            )) || [];

            return _.head(result) || null;
        } catch (error) {
            console.error(error);
            return null;
        }

    },
    async getTaskCountByDateAndUser(taskDate, userId) {

    },
    async updateTask(id, userId, taskData) {

    },
    async deleteTask(id, userId) {

    }


}

export async function getUsersList(page = 1, limit = 20) {
    try {
        const [[{ count }]] = await DbMysql.query(
            `SELECT count(*) as count
       FROM users;`,
        );

        const offset = Math.ceil((page - 1) * limit);

        const [result] = await DbMysql.query(
            `SELECT id, name, age, email
       FROM users
       limit ? offset ?`,
            [limit, offset]
        );

        return { result, count, page, offset };
    } catch (error) {
        console.error(error);
        return []
    }
}