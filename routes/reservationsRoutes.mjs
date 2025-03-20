import { Router } from "express";
import Reservations from "../controladores/reservationsControllers.mjs";
import { validatorToken } from "../middelware/validarToken.mjs";
import validatorRol from "../middelware/validarRol.mjs";
const reservationRoutes= Router()
reservationRoutes.post("/reservations",validatorToken,validatorRol(['admin',"usuario","recepcionista"]),Reservations.addReservation)
reservationRoutes.get("/getreservation/:id",validatorToken,validatorRol(['admin',"usuario","recepcionista"]),Reservations.getReservation)
reservationRoutes.get("/reservas/:id",validatorToken,validatorRol(['admin',"usuario","recepcionista"]),Reservations.updateReservations)
reservationRoutes.get("/reservas",validatorToken,validatorRol(['admin',"usuario","recepcionista"]),Reservations.getReservationUsers)
reservationRoutes.put("/actualizar/:id",validatorToken,Reservations.updateReservations)
reservationRoutes.put("/cancelar/:id",validatorToken,validatorRol(['admin',"usuario","recepcionista"]),Reservations.cancelarReserva)


export default reservationRoutes
validatorRol(['admin',"usuario","recepcionista"])