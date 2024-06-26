import { Request, Response } from "express";
import validator from "validator";
import model from "../models/usuarioModelo";
import { utils } from "../utils/utils";

class UsuarioController {

  public async list(req: Request, res: Response) {
    try {
      const usuarios = await model.list();
      return res.json(usuarios);
    } catch (error: any) {
      console.error("Error en list:", error);
      return res.status(500).json({ message: `${error.message}` });
    }
  }

  public async add(req: Request, res: Response) {
    try {
      const { email, password, role } = req.body;

      // Validación de email
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Email no válido" });
      }

     

      const encryptedPassword = await utils.hashPassword(password);
      const usuario = { email, password: encryptedPassword, role };
      await model.add(usuario);
      return res.json({ message: "Usuario agregado exitosamente", code: 0 });
    } catch (error: any) {
      console.error("Error en add:", error);
      return res.status(500).json({ message: `${error.message}` });
    }
  }

  public async update(req: Request, res: Response) {
    
    try {
        const { email, password, role } = req.body;

        console.log("Datos recibidos para actualización:", { email, password, role });

        // Verificar si el usuario existe
        const userExists = await model.exists(email);
        console.log("¿Usuario existe?", userExists);
        
        if (!userExists) {
          let updatedPassword = password;
          if (password) {
              updatedPassword = await utils.hashPassword(password);
          }
  
          const usuario = { email, password: updatedPassword, role };
          await model.update(usuario);
        }

        // Encriptar la nueva contraseña si está presente
      
        
        return res.json({ message: "Usuario actualizado exitosamente", code: 0 });
    } catch (error: any) {
        console.error("Error en update:", error);
        return res.status(500).json({ message: `${error.message}` });
    }
}


  public async delete(req: Request, res: Response) {
    try {
      const { email } = req.params; // Asegúrate de que el email se obtenga de los parámetros

      // Verificar si el usuario existe
      const userExists = await model.exists(email);
      if (!userExists) {
        await model.delete(email);
        return res.json({ message: "Usuario eliminado exitosamente", code: 0 });
      }else{
        return res.status(404).json({ message: "El usuario no existe" });
      }


    } catch (error: any) {
      console.error("Error en delete:", error);
      return res.status(500).json({ message: `${error.message}` });
    }
  }


  public async iniciarSesion(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validación de email
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Email no válido" });
      }

      // Validación de password (usando validator)
      if (!password || typeof password !== "string" || password.length === 0) {
        return res.status(400).json({ message: "Password no válido" });
      }

      // Verificar si el usuario existe con el email y la contraseña proporcionados
      const usuario = await model.findByEmailAndPassword(email, password);
      if (!usuario) {
        return res.status(400).json({ message: "Credenciales incorrectas" });
      }

      return res.json({ message: "Autenticación correcta", email, role: usuario.role });
    } catch (error: any) {
      console.error("Error en iniciarSesion:", error);
      return res.status(500).json({ message: `${error.message}` });
    }
  }
}

export const usuarioController = new UsuarioController();
