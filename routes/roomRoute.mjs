import HabitacionesControllers from '../controladores/roomsControllers.mjs'
import validatorRol from '../middelware/validarRol.mjs'
import {Router} from 'express'
import { validatorToken } from '../middelware/validarToken.mjs'

const roomRouter = Router()
roomRouter.post('/RegistrarHabitacion',validatorToken,validatorRol(["admin"]),HabitacionesControllers.crear)
roomRouter.get('/obtenerHabitaciones/:estado',validatorToken,validatorRol(['admin',"usuario","recepcionista"]),HabitacionesControllers.obtenerHabitacionesPorEstado)
roomRouter.put('/actualizarHabitacion/:id',HabitacionesControllers.roommUpdate)




export default roomRouter 