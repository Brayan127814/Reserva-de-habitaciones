import {
    Op
} from "sequelize";
import {
    reservas
} from "../models/reservas.mjs";
export const verificarDisponibilidad = async (habitacionesIDs, fechaEntrada, fechaSalida) => {
    const reservasEnConflicto = await reservas.findAll({
        where: {
            fechaEntrada: { [Op.lte]: fechaSalida },
            fechaSalida: { [Op.gte]: fechaEntrada },
            habitacionID: { [Op.in]: habitacionesIDs } // Aquí es donde fallaba
        }
    });

    return reservasEnConflicto.map(reserva => reserva.habitacionID);
};
