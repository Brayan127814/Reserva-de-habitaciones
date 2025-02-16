// Middelware para validar el rol del usuario para el tema de lospermisos
const validatorRol = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: 'No hay usuario autenticado'
            })
        }

        //en caso tal que el rol este dentro de los roles permitidos

        if (!allowedRoles.includes(req.user.roleName)) {
            return res.status(403).json({
                message: 'No tienes permisos para realizar esta acción'
            })
        }

        //si el rol tiene todos los permisos
        next()
    }


}

export default validatorRol