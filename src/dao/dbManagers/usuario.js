import userModel from "../models/users.js";


export default class UsuarioManagerM {
    async getByYd(id) {
        try {
            const usuario = await userModel.findOne({ _id: id });
            return usuario;
        } catch (error) {
            console.error("Error al consultar el usuario especifico:", error);
            return null;
        }
    }

    async update(id, userUpdate) {
        try {
            const result = await userModel.updateOne({ _id: id }, userUpdate);
            return result;
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            return null;
        }
    }
}




