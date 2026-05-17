import HttpErrors from 'http-errors';
import usersModel from '../models/usersModel.js';
import moment from 'moment';


export default {


    async registration (req, res, next) {
        try {

            const {name,email,password,age} = req.body;
            if(await usersModel.checkMemberByEmail(email)) {

                throw  new HttpErrors(422,{
                    message: 'Validation error',
                    errors:{
                        email: 'почта уже сушествует',
                    }
                })
            }
            const user = await usersModel.createUser({
                name,
                email,
                password: usersModel.hashPassword(password),
                age
            })

            delete user.password;



            res.json({
                message: 'User created successfully',
                user
            })
        } catch (e) {
            next(e);
        }
    },

