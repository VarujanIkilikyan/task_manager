import express from 'express';
import {createServer} from 'http';
import 'dotenv/config'
import logger from 'morgan';

import SelectorRouter from './00_routers/index.js';
import errorHandler from "./02_middleware/errorHandler.js";


const app = express();
const server = createServer(app);
//logger
app.use(logger('dev'))
//view engin setup
app.set('view engine', 'ejs');
app.set('views','/views');
app.use(express.static('/public'));

//transform post body req.body
app.use(express.json());

//request handler
app.use(SelectorRouter);

//error handler
app.use(errorHandler.notFound);
app.use(errorHandler.errors);



const { PORT = 3000, HOST = 'localhost' } = process.env;
server.listen(+PORT, HOST,()=>{
    console.log(`Server run on ${HOST}:${PORT}`);
});

