import HttpErrors from 'http-errors';
import usersModel from '../03_models/userModel.js';
import bcrypt from "bcrypt";
import moment from 'moment';


export default {


    async registration (req, res, next) {
        try {

            const {username,email,password} = req.body;
            if(await usersModel.checkUsernameExists(username)) {

                throw  new HttpErrors(422,{
                    message: 'Validation error',
                    errors:{
                        email: 'имя уже сушествует',
                    }
                })
            }
            if(await usersModel.checkEmailExists(email)) {

                throw  new HttpErrors(422,{
                    message: 'Validation error',
                    errors:{
                        email: 'почта уже сушествует',
                    }
                })
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await usersModel.create(username,email,hashedPassword)

            delete user.password;



            res.json({
                message: 'User created successfully',
                user
            })
        } catch (e) {
            next(e);
        }
    },
}

