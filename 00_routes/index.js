import {Router} from "express";

import views from "../02_controllers/views.js";

const selectorRouter = new Router();

selectorRouter.get('/',views.viewRender('index'));