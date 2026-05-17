import {Router} from "express";

import views from "../02_controllers/views.js";
import authRoutes from "./authRoutes.js";

const SelectorRouter = new Router();

SelectorRouter.get('/',views.viewRender('index'));
SelectorRouter.use('/auth',authRoutes)

export default SelectorRouter;