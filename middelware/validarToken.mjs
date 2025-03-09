import jwt from 'jsonwebtoken'

import users from '../models/usuarios.mjs'
import roles from '../models/role.mjs'

//Middelware para validar el token generado
export const validatorToken = async (req, res, next) => {
    try {

        const autHeader = req.headers.authorization
        const token = autHeader && autHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({
                menaje: "token no valido"
            })
        }

        //decodificar token


        jwt.verify(token, process.env.keySecret, async (err, user) => {
            if (err) {
                return res.status(401).json({
                    menaje: "token no valido"
                })
            }

            //validar rol
            try {

                const userRol = await users.findOne({
                    where: {
                        id: user.id
                    },
                    include: {
                        model: roles,
                        attributes: ["roleName"]
                    },
                    attributes: ["name", "roleID"]
                })

                if (!userRol) {
                    return res.status(403).json({
                        message: 'El usuario no tiene permisos para esta accion'
                    })
                }

                //extraer informacion importante

                const rolName = userRol.role ? userRol.role.roleName : null

                console.log("este es el rol   "+rolName)
                console.log("Usuario encontrado:", JSON.stringify(userRol, null, 2));

                req.user = {
                    id:user.id,
                    name: userRol.name,
                    roleID: userRol.roleID,
                    roleName: rolName
                }
  
                next()
            } catch (error) {

                console.error(error)
                return res.status(500).json({
                    mensaje: "error"
                })

            }
        })
    } catch (error) {

        console.error(error)
        res.status(500).json({
            mensajej: "error"
        })

    }

    


}