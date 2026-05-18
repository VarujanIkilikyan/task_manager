import {Router} from "express";
import views from "../02_controllers/views.js";
import validate from "../04_utils/validate.js";
import schemas from "../04_utils/schemas/tasks.schema.js";
import authorization from "../01_middlewares/authMiddleware.js";

import controller from "../02_controllers/taskController.js";

const tasksRoutes = Router();

tasksRoutes.post('/',authorization,validate(schemas.create,'body'),controller.createNewTask);
tasksRoutes.get('/',authorization,controller.getAllTasks)
export default tasksRoutes;