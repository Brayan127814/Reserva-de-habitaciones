import conectDB from '../config/db.mjs'
import {
    DataTypes
} from 'sequelize'


//Modelo para el registro de habitaciones


 const habitaciones = conectDB.define("habitaciones", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    piso: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numeroHabitacion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM("Disponible", "Ocupada", "Mantenimiento"),
        allowNull: false,
        defaultValue: "Disponible"
    },
    desripcion:{
        type:DataTypes.STRING,
        allowNull:false
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ["piso", "numeroHabitacion"] // Evita habitaciones duplicadas en el mismo piso
        }
    ] 
});

export default habitaciones;
