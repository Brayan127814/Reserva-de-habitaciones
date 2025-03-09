import conectDB from "../config/db.mjs";
import {
    DataTypes
} from "sequelize";


//Modelo para las reservas
export const reservas = conectDB.define("reservas", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fechaEntrada: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fechaSalida: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    cantidadPersonas: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userID: {
        type: DataTypes.INTEGER,
        // references: {
        //     model: 'users',
        //     key: 'id'
        // }
    }

})