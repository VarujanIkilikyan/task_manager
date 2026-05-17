import {Router} from "express";
import views from "../02_controllers/views.js";
import validate from "../04_utils/validate.js";
import schemas from "../04_utils/schemas/auth.schema.js";

import controller from "../02_controllers/authController.js";

const authRoutes = Router();

authRoutes.get('/register',views.viewRender('register'));
authRoutes.post('/register',validate(schemas.register,'body'),controller.registration);

export default authRoutes;