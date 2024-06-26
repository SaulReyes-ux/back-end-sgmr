import { Request, Response } from "express";
import validator from "validator";
import model from '../models/authModelo';
import jwt from 'jsonwebtoken';
import db from '../utils/connection';
import {utils} from '../utils/utils';


// Declaración de la clase AuthController
class AuthController {
    public async iniciarSesion(req: Request, res: Response) {
       
        try {
            const {email, password }= req.body;
            const lstUsers = await model.getuserByEmail(email);
            if (lstUsers.length <= 0) {
              return res.status(404).json({ message: "El usuario y/o contraseña es incorrecto", code: 1 });
            }

            console.log(lstUsers[0].username, lstUsers[0].password);
           
           
            let result= utils.checkPassword(password,lstUsers[0].password);
            result.then((value)=>{
                if(value){
                const newUser={
                    email: lstUsers[0].email,
                    password: lstUsers[0].password,
                    role: lstUsers[0].role
                }
                    console.log(process.env.SECRET)
                    const env= require('dotenv').config();
                    let token= jwt.sign(newUser, process.env.SECRET,{expiresIn:'1h'})
                    return res.json({ message: "Autenticación correcta", token, code: 0 });
            }
        })
        
           
           
           
            
           
        } catch (error: any) {
            return res.status(500).json({ message : `${error.message}` });
        }

    }

}

// Instancia de AuthController
export const authController = new AuthController();
