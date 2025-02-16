import conectDB from "../config/db.mjs";
import { DataTypes } from "sequelize";

//Modelo tol

const roles = conectDB.define("roles",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    roleName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    descripcion:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

export default roles