import jwt from 'jsonwebtoken'
import users from '../models/usuarios.mjs'
import bcrypt from 'bcrypt'

//Middelware para el inicio de sesion


export const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body

        //Validar que los campos no esten vacios

        if (!email || !password) {
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            })
        }

        const user = await users.findOne({

            where: {
                email
            }
        })

        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            })

        }

        //si el usuario es econtrado  comparamos contraseñas 

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({
                message: 'Contraseña incorrecta'
            })
        }

        //Generar el token JWT

        const token = jwt.sign({
            id: user.id
        }, process.env.keySecret, {
            expiresIn: '1h'
        })

        res.json({
            sucess: true,
            token
        })
    } catch (error) {

        console.error(error)
        res.status(500).json({
            message: 'Error en el servidor'
        })

    }
}