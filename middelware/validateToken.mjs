import jwt from 'jsonwebtoken'
import users from '../models/usuarios.mjs'
import roles from '../models/role.mjs'


/*
 * Middelware para validar el token generado
 */
export const validarToken = async (req, res, next) => {

    const authHeader = req.headers.authorization
    const token = authHeader || authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    // Verificar el token

    jwt.verify(token, process.env.keySecret, async (err, user) => {
        if (err) {
            return res.status(401).json({
                mensaje: "Token no valido"
            })
        }
        //Validar el rol para el tema de permisos

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
                return res.status(401).json({
                    mensaje: "No tienes los permisos necesarios para esta accion"
                })
            }

            //extraer el rol

            const roleName = userRol.role ? userRol.roleName : null

            req.user = {
                id: user.id,
                name: userRol.name,
                roleID: userRol.roleID,
                roleName: roleName
            }

            next()
        } catch (error) {
            console.log(error)
            return res.status(401).json({
                mensaje: "No tienes los permisos necesarios para esta accion"
            })
        }
    })

}