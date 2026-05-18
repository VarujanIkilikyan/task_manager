import {Router} from "express";
import views from "../02_controllers/views.js";
import validate from "../04_utils/validate.js";
import schemas from "../04_utils/schemas/auth.schema.js";
import authorization from "../01_middlewares/authMiddleware.js";

import controller from "../02_controllers/taskController.js";

const tasksRoutes = Router();

tasksRoutes.post('/tasks',authorization,validate(schemas.register,'body'),controller.);
export default tasksRoutes;