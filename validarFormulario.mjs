export const validarForm = (email, password) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
        return {
            valido: false,
            mensaje: "correo no valido"
        }
    }
    if (!password.trim()) {
        return {
            valido: false,
            mensaje: "contraseña no valida"
        }

    }
    return {
        valido: true,
        mensaje: "validacion exitosa"
    }
}