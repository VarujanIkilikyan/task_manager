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

