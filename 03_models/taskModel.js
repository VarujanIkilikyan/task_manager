import _ from 'lodash';


import DbMysql from "../05_clients/db.mysql.js";

export default {
    async createTask(userId, title, description,taskDate) {
        try {
            const result = await DbMysql.query(
                `insert into tasks (userId, title, description,taskDate)
                 values (?, ?, ?,?);`,
                [userId, title, description,taskDate],
            );
            const id = _.get(result, '0.insertId', null);


            return await this.findUserByEmail(email);
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    async getAllTasksByUser(userId, limit, offset){

    },
    async getTotalTasksCountByUser(userId){

    },
    async getTaskById(id, userId){

    },
    async getTaskCountByDateAndUser(taskDate, userId){

    },
    async updateTask(id, userId, taskData){

    },
    async deleteTask(id, userId){

    }


}

