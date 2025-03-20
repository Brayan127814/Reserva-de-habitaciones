import {
    reservas
} from "../models/reservas.mjs";
import detalleReservas from "../models/detalleReservas.mjs";
import users from "../models/usuarios.mjs";
import habitaciones from "../models/habitaciones.mjs";
import mergeSortReservations from "../utils/mergeSortReseravations.mjs";
import {
    verificarDisponibilidad
} from "../utils/validarDisponibilidad.mjs";

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

            if (entrada < hoy) {
                return res.status(400).json({
                    mensaje: "La fecha de entrada no puede ser anterior a hoy"
                })

            }
            if (salida <= entrada) {
                return res.status(400).json({
                    mensaje: "La fecha de salida debe ser despues de la fecha de entreda"
                })
            }


            if (!Habitaciones || !Array.isArray(Habitaciones) || Habitaciones.length === 0) {
                return res.status(400).json({
                    message: 'Debe seleccionar al menos una habitación'
                })
            }

            //Obtener habitaciones disponibles
            const habitacionesNoDisponibles = []
            const habitacionesReservadas = []

            for (let room of Habitaciones) {
                const habitacion = await habitaciones.findOne({
                    where: {
                        id: room.roomID
                    }
                })
                if (!habitacion || habitacion.estado !== "Disponible") {
                    habitacionesReservadas.push(room.roomID)
                } else {
                    habitacionesReservadas.push(habitacion)
                }
            }
            console.log(habitacionesReservadas)

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
                if (!habitacion) return

                await detalleReservas.create({
                    roomsID: room.roomID,
                    reservasID: newReservation.id,
                    cantidadNoches,
                    precioTotal: habitacion.precio * cantidadNoches

                })


                await habitaciones.update({
                        estado: "Ocupada"
                    }, {
                        where: {
                            id: room.roomID
                        }
                    }

                )

            })

            //Actualizar el estado de la habitacion


            await Promise.all(detalles);
            return res.status(201).json({
                message: 'Reserva creada exitosamente',
                reserva: await reservas.findByPk(newReservation.id, {
                    include: habitaciones // ✅ Incluir habitaciones en la respuesta
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

            if (!user) {
                return res.status(401).json({
                    message: 'No hay usuario autenticado'
                })
            }

            const reservation = await reservas.findByPk(reservationID, {
                include: [{

                    model: habitaciones,
                    attributes: ["piso", "numeroHabitacion", "precio"]
                }]
            })

            if (!reservation) {
                res.status(404).json({
                    mensaje: "Reservaton no encontrada"
                })
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

    //controlador parra cancelar la reserva:

    static async cancelarReserva(req, res) {
        try {
            let user = req.user.id
            if (!user) {
                res.status(400).json({
                    mensaje: "debes loguearte primero"
                })
            }

            let idReservation = req.params.id
            let reservation = await reservas.findByPk(idReservation,

                {
                    include: {
                        model: habitaciones,
                        through: {
                            attributes: [] // evita traer datos de la tanla intermedia
                        }
                    }
                }
            )


            if (!reservation) {
                return res.status(404).json({
                    mensaje: "No se encontro reserva en la base de datos"
                })
            }
            if (reservation.estado === "Cancelada") {
                return res.status(400).json({
                    mensaje: "La reserva ya esta cancelada"
                })
            }


            await reservas.update({
                estado: "Cancelada"
            }, {
                where: {
                    id: idReservation
                }
            })

            //  cambiar estado de la shabitaciones relacionadas

            // Verificamos si reservation.habitaciones existe antes de acceder a sus valores
            if (reservation.habitaciones && reservation.habitaciones.length > 0) {
                // Extraemos los IDs de las habitaciones asociadas
                const habitacionesIds = reservation.habitaciones.map(h => h.id);

                // Actualizar el estado de las habitaciones a "Disponible"
                await habitaciones.update({
                    estado: "Disponible"
                }, {
                    where: {
                        id: habitacionesIds
                    }
                });

                return res.status(200).json({
                    mensaje: "Reserva Cancelada"
                })

            }

        } catch (error) {
            console.error(error)
            res.status(500).json({
                mensaje: "error interno del servidor"
            })
        }
    }

    static async updateReservations(req, res) {
        try {
            const {
                fechaEntrada,
                fechaSalida,
                Habitaciones
            } = req.body
            const user = req.user.id

            if (!user) {
                return res.status(400).json({
                    mensaje: "No hay usuario autenticado"
                })
            }
            //buscar reserva

            const idReservation = req.params.id

            const reservation = await reservas.findByPk(idReservation)
            if (!reservation) {
                return res.status(404).json({
                    mensaje: "No se econtro ninguna reserva con este id"
                })
            }

            if (new Date() >= new Date(reservation.fechaEntrada)) {
                return res.status(400).json({
                    mensaje: "No se pueden realizar actualizaciones de entrada para reservas en curso o finalizadas"
                })
            }

            //Verificar disponibilidad de las habitaciones para las nuevas fechas.
            const habitacionesIDs = Habitaciones.map(h => h.roomID);

            const habitacionesNoDisponibles = await verificarDisponibilidad(habitacionesIDs, fechaEntrada, fechaSalida)

            if (habitacionesNoDisponibles.length > 1) {
                return res.status(400).json({
                    mensaje: `Las habitaciones ${habitacionesNoDisponibles.join(", ")} no están disponibles en las fechas seleccionadas.`
                });
            }


            await reservas.update({
                fechaEntrada,
                fechaSalida,
                where: {
                    id: idReservation
                }
            })

            return res.status(200).json({
                mensaje: "Reserva actualizada"
            })


        } catch (error) {
            console.error(error)
            res.status(500).json({
                mensaje: "Error interno del servidor"
            })
        }
    }


    static async getReservationUsers(req, res) {

        try {
            const user = req.user.id
            if (!user) {
                return res.status(404).json({
                    mensaje: "No hay usuario logueado"
                })
            }


            // Obtener todas las reservas que le pertenecen al usuario
            const reservation = await reservas.findAll({
                where: {
                    userID: user
                },
                include: [{
                    model: habitaciones,
                    attributes: ["piso", "numeroHabitacion", "precio"]
                }]
            })

            if (!reservation || reservation.length === 0) {
                return res.status(404).json({
                    mensaje: "No se encontraron reservas"
                })
            }

            const sortedReservation = mergeSortReservations(reservation)

            return res.status(200).json({
                reservas: sortedReservation
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                mensaje: "Error interno del servidor"
            })

        }

    }

}

export default Reservation;