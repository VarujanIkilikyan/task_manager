import HttpErrors from 'http-errors';

import taskModel from '../03_models/taskModel.js';

export default {


    async createNewTask (req, res, next) {
        try {

            const {title,description,taskDate} = req.body;

            const task = await taskModel.createTask(req.userId, title, description, taskDate)

            res.json({
                message: 'task created successfully',
                task
            })
        } catch (e) {
            next(e);
        }
    },
    async getAllTasks (req, res, next) {
        try {
            const {page,limit} = req.query;

            const pageNum = Math.max(1, parseInt(page) || 1);
            const limitNum = Math.max(1, parseInt(limit) || 5);

            const task = await taskModel.getAllTasksByUser(req.userId,pageNum,limitNum);
            res.json({
                message: 'get all tasks',
                task
            })
        }catch (e){
            next(e);
        }
    }
}