import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import users from '../models/usuarios.mjs'
import validarForm from '../utils/validarFormulario.mjs'



/*
 *
 */
export const incioSesion = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body

        let resultado = validarForm(email, password)
        /*
         * Validar que el usuario exista en la base de datos
         */
        if (!resultado.valido) {
            return res.status(400).json({
                error: resultado.mensaje
            })
        }

        const usuario = await users.findOne({
            where: {
                email
            }
        })

        if (!usuario) {
            return res.status(400).json({
                error: 'El usuario no existe'
            })
        }


        const isMatch = await bcrypt.compare(password, usuario.password)
        if (!isMatch) {
            return res.status(400).json({
                error: 'La contraseña es incorrecta'
            })
        }

        //Generar token

        const token = jwt.sign({
            id: usuario.id
        }, process.envkeySecret, {
            expiresIn: '30d'
        })

        res.json({
         succes:true,
         token
        })
    } catch (error) {

    }
}