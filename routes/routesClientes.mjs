import { consultarClientes, registerUser } from "../controladores/usuariosControlador.mjs";
import {Router} from 'express'
import { login } from "../middelware/login.mjs";

import { validatorToken } from "../middelware/validarToken.mjs";
import validatorRol from "../middelware/validarRol.mjs";


//rutas 
const routeCliente = Router()

routeCliente.post('/registrar-Clientes',registerUser)
routeCliente.post('/login',login)
routeCliente.get('/consultarCliente',validatorToken,validatorRol(['admin',"usuario","recepcionista"]),consultarClientes)

export default routeCliente;