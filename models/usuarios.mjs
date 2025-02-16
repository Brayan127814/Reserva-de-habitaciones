import {
    DataTypes
} from "sequelize";
import conectDB from "../config/db.mjs";

// Crear Modelo para el usuario

const users = conectDB.define("users", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [10, 10]
        }
    },
    password: {

        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            min: 8
        }
    },
    roleID: {
        type: DataTypes.INTEGER,
        defaultValue: 2

    }

}, {
    timestamps: true,
    tableName: "users"
})

export default users;