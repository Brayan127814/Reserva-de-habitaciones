import habitaciones from '../models/habitaciones.mjs'

class HabitacionesController {
    static async crear(req, res) {
        try {

            const {
                piso,
                numeroHabitacion,
                precio,
                estado,
                descripcion
            } = req.body

            let estadoFinal = estado || "Disponible"
            // validar que la habitacion ya este registrado en el piso acal


            //Validar que todos los campos estern llenos
            if (!piso || !numeroHabitacion || !precio || !descripcion) {
                return res.status(400).json({
                    message: 'Todos los campos son obligatorios'

                })
            }

            const limiteHabitaciones = 6
            // Validar que la habitacion tiene el formato de 
            const expectedRoomNumber = parseInt(`${piso}01`)
            const maxRoomNumber = expectedRoomNumber + limiteHabitaciones - 1
             console.log(`Numero de habitacion ${expectedRoomNumber}`)
             console.log(`maximo numero de habitaciones ${maxRoomNumber}`)

            if (numeroHabitacion < expectedRoomNumber || numeroHabitacion > maxRoomNumber) {
                return res.status(400).json({
                    message: `El número de habitación ${numeroHabitacion} no es válido para el piso ${piso}. Debe estar entre ${expectedRoomNumber} y ${maxRoomNumber}.`
                });
            }

            // Verificar si la habitacion ya  esta registrada en el piso
            const existeHabitacion = await habitaciones.findOne({
                where: {
                    piso,
                    numeroHabitacion
                }
            })
            if (existeHabitacion) {
                return res.status(400).json({
                    mensaje: "Esta habitacion ya se encuentra registrada en el sistema"
                })
            }
            const roomCount = await habitaciones.count({
                where: {
                    piso
                }
            })

            console.log(`cantidad de habitaciones registradas ${roomCount}`)

            if(roomCount > limiteHabitaciones){
                return res.status(400).json({mensaje:`No se pueden registrar mas de ${limiteHabitaciones} en le piso ${piso}`})
            }

           
            const newRoom = await habitaciones.create({
                piso,
                numeroHabitacion,
                precio,
                estado: estadoFinal,
                descripcion
            })

            res.status(200).json({
                Habitacion: newRoom
            })



        } catch (error) {
            console.error(error)
            res.status(500).json({
                mensaje: "Error interno del servidor"
            })
        }
    }

    static async obtenerHabitacionesPorEstado(req, res) {
        try {

            const {
                estado
            } = req.params
            const estadosValidos = ["Disponible", "Ocupada", "Mantenimiento"]

            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({
                    mensajeJ: "Estado no valido"
                })
            }

            const estadoFiltrado = await habitaciones.findAll({
                where: {
                    estado
                }
            })

            if (estadoFiltrado.length === 0) {
                return res.status(404).json({
                    mensaje: "No hay habitaciones con estado"
                })
            }

            res.status(200).json({
                HabitacionesEncontrada: estadoFiltrado
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                mensaje: "Error interno del servidor"
            })
        }
    }

    //actualizar estado y precio

    static async roommUpdate(req, res) {
        try {
            const {
                precio,
                estado
            } = req.body
            if (!precio || !estado) {
                res.status(400).json({
                    mensaje: "Llena todos los campos"
                })
            }

            //VERIFICAR SI LA HABITACION ESTA REGISTRADA

            const roomID = req.params.id
            const room = await habitaciones.findByPk(roomID)
            if (!room) {
                return res.status(404).json({
                    mensaje: "Habitacion no encontrada"
                })
            }

            await room.update({
                precio,
                estado
            })

            res.status(200).json({
                mensaje: "Habitacion actualizada",
                habitacion: room
            })



        } catch (error) {
            console.error(error)
            res.status(500).json({
                msg: "error interno del servidor"
            })
        }


    }
}
export default HabitacionesController