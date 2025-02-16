import {
    Op
} from "sequelize";
import users from "../models/usuarios.mjs";
import roles from "../models/role.mjs";
import bcrypt from 'bcrypt'

//Controlador para registrar usuarios

export const registerUser = async (req, res) => {
    try {
        const {
            name,
            lastName,
            email,
            telefono,
            password,
            roleID
        } = req.body

        if (!name || !lastName || !email || !telefono || !password) {
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            })
        }

        const passwordEncrypting = await bcrypt.hash(password, 10)
        const newRegister = await users.create({
            name,
            lastName,
            email,
            telefono,
            password: passwordEncrypting,
            roleID
        })

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            data: newRegister
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Hubo un error al crear el usuario'
        })

    }
}

//Consultar clientes ´
export const consultarClientes = async (req, res) => {

    try {
        const clientes = await users.findAll({
            include: {
                model: roles,
                where: {
                    roleName: "cliente"
                },
                attributes:["roleName"]
            },
            attributes:["name","lastName","email","telefono"]
        })

        if (!clientes) {
            return res.status(404).json({
                message: 'No hay clientes registrados'
            })
        }

       res.status(200).json({
            Clientes: clientes
        })
    } catch (error) {

        console.error(error);
        res.status(500).json({
            mensaje: "Error interno del servidor"
        })

    }
}


//controlador para consultar rol del usuario

export const consultarRol = async (req, res) => {
    try {
        const {
            id
        } = req.params.id

        const userRol = await users.findOne({
            where: {
                [Op.eq]: id
            },
            include: {
                model: roles,
                attributes: ["roleName"]
            },
            attributes: ["Name", "lastName"]
        })

        if (!userRol) {
            return res.status(404).json({
                message: 'El usuario no existe'
            })
        }

        res.status(200).json({
            message: 'Rol del usuario',
            data: userRol
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error interno del servidor"
        })
    }
}