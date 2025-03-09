import {
    reservas
} from "../models/reservas.mjs";
import detalleReservas from "../models/detalleReservas.mjs";
import users from "../models/usuarios.mjs";
import habitaciones from "../models/habitaciones.mjs";

class Reservation {
    static async addReservation(req, res) {
        try {

            const {
                fechaEntrada,
                fechaSalida,
                cantidadPersonas,
                Habitaciones
            } = req.body


            //Verificar que el usuario este logueado
            const user = req.user.id
            console.log(user)
            if (!user) {
                return res.status(401).json({
                    message: 'No hay usuario autenticado'
                })
            }
            const hoy = new Date()
            const entrada = new Date(fechaEntrada)
            const salida = new Date(fechaSalida)

            if(entrada < hoy){
                 return res.status(400).json({mensaje:"La fecha de entrada no puede ser anterior a hoy"})

            }
            if(salida <= entrada){
                return res.status(400).json({mensaje:"La fecha de salida debe ser despues de la fecha de entreda"})
            }


            if (!Habitaciones || !Array.isArray(Habitaciones) || Habitaciones.length === 0) {
                return res.status(400).json({
                    message: 'Debe seleccionar al menos una habitación'
                })
            }

            //Obtener habitaciones disponibles
            const habitacionesNoDisponibles = []

            for (let room of Habitaciones) {
                const habitacion = await habitaciones.findOne({
                    where: {
                        id: room.roomID
                    }
                })
                if (!habitacion || habitacion.estado !== "Disponible") {
                    habitacionesNoDisponibles.push(room.roomID)
                }
            }

            if (habitacionesNoDisponibles.length > 0) {
                return res.status(400).json({
                    mensaje: `Las habitaciones ${habitacionesNoDisponibles.join("," )} no están disponibles`
                })
            }

            //Crear reserva
            const newReservation = await reservas.create({
                fechaEntrada,
                fechaSalida,
                cantidadPersonas,
                userID: user
            })

            // Calcular cantidad de noches
          
            const cantidadNoches = Math.ceil((salida - entrada) / (1000 * 60 * 60 * 24))

            //Asociar habitaciones a la reserva
            const detalles = Habitaciones.map(async (room) => {
                const habitacion = await habitaciones.findByPk(room.roomID)
                if(!habitacion) return

                await detalleReservas.create({
                    roomsID:room.roomID,
                    reservasID:newReservation.id,
                    cantidadNoches,
                    precioTotal: habitacion.precio * cantidadNoches
                
                })

                
            await habitaciones.update(
                { estado: "Ocupada" },
                { where: { id: room.roomID } }

            )

            })

            //Actualizar el estado de la habitacion


            await Promise.all(detalles); 
            return res.status(201).json({
                message: 'Reserva creada exitosamente',
                reserva: await reservas.findByPk(newReservation.id, {
                    include: habitaciones  // ✅ Incluir habitaciones en la respuesta
                })
            });
            
        } catch (error) {
            console.error("Error al crear la reserva:", error);
            return res.status(500).json({
                message: "Error interno del servidor",
                error: error.message
            });
        }
    }

    // consultar reserva

    static async getReservation(req, res) {
        try {
                const reservationID = req.params.id
                const user = req.user.id

                if(!user){
                    return res.status(401).json({
                        message: 'No hay usuario autenticado'
                    })
                }

                const reservation = await reservas.findByPk(reservationID,{
                    include:[
                        {
                       
                           model:habitaciones,
                           attributes:["piso","numeroHabitacion","precio"]
                        }
                    ]
                })

                if(!reservation){
                    res.status(404).json({mensaje:"Reservaton no encontrada"})
                }
                return res.status(200).json(reservation)

        } catch (error) {
            console.error("Error al consultar la reserva:", error);
            return res.status(500).json({
                message: "Error interno del servidor",
                error: error.message
            });
            
        }
    }
}

export default Reservation;