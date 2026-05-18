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
}