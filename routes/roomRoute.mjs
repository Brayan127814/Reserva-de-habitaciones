import HabitacionesControllers from '../controladores/roomsControllers.mjs'
import {Router} from 'express'

const roomRouter = Router()
roomRouter.post('/RegistrarHabitacion',HabitacionesControllers.crear)
roomRouter.get('/obtenerHabitaciones/:estado',HabitacionesControllers.obtenerHabitacionesPorEstado)
roomRouter.put('/actualizarHabitacion/:id',HabitacionesControllers.roommUpdate)




export default roomRouter 