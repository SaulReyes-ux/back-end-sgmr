import pool from '../utils/connection';

class UsuarioModelo {

    public async list() {
        const result = await pool.then(async (connection) => {
            return await connection.query(
                "SELECT u.email, u.password, u.role FROM tbl_usuario u"
            );
        });
        return result;
    }

    public async add(usuario: any) {
        try {
            const result = await pool.then(async (connection) => {
                return await connection.query(
                    "INSERT INTO tbl_usuario SET ?", [usuario]
                );
            });
            return result;
        } catch (error) {
            console.error("Error en add:", error);
            throw new Error("Error al agregar usuario, usuario existente");
        }
    }

    public async update(usuario: any) {
        try {
            const update = "UPDATE tbl_usuario SET password = ?, role = ? WHERE email = ?";
            const result = await pool.then(async (connection) => {
                return await connection.query(update, [usuario.password, usuario.role, usuario.email]);
            });
            return result;
        } catch (error) {
            console.error("Error en update:", error);
            throw new Error("Error al actualizar usuario");
        }
    }
    

    public async delete(email: string) {
        try {
            const result = await pool.then(async (connection) => {
                return await connection.query(
                    "DELETE FROM tbl_usuario WHERE email = ?", [email]
                );
            });
            return result;
        } catch (error) {
            console.error("Error en delete:", error);
            throw new Error("Error al eliminar usuario");
        }
    }

    public async exists(email: string) {
        try {
            const result = await pool.then(async (connection) => {
                const [rows] = await connection.query(
                    "SELECT 1 FROM tbl_usuario WHERE email = ?", [email]
                );
                console.log("Resultado de exists:", rows);
                return rows.length > 0;
            });
            return result;
        } catch (error) {
            console.error("Error en exists:", error);
            throw new Error("Usuario no existe");
        }
    }
    

    public async findByEmailAndPassword(email: string, password: string) {
        try {
            const result = await pool.then(async (connection) => {
                const [rows] = await connection.query(
                    "SELECT * FROM tbl_usuario WHERE email = ? AND password = ?", [email, password]
                );
                return rows && rows.length > 0 ? rows[0] : null;
            });
            return result;
        } catch (error) {
            console.error("Error en findByEmailAndPassword:", error);
            throw new Error("Error al buscar usuario por email y contraseña");
        }
    }
}

const model = new UsuarioModelo();
export default model;
