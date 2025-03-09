import conectDB from "../config/db.mjs";
import {
    DataTypes,
    FLOAT
} from "sequelize";


//Modelo  intermedio de reservas

export const detalleReservas = conectDB.define("detalleReservas", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    roomsID: {
        type: DataTypes.INTEGER,
        references: {
            model: "habitaciones",
            key: "id"
        }
    },
    reservasID: {
        type: DataTypes.INTEGER,
        // references: {
        //     model: "reservas",
        //     key: "id"
        // }
    },
   
    cantidadNoches: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precioTotal:{
        type:DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.00
    }

})


export default detalleReservas