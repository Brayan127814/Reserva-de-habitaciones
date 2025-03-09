import { Router } from "express";
import Reservations from "../controladores/reservationsControllers.mjs";
import { validatorToken } from "../middelware/validarToken.mjs";

const reservationRoutes= Router()
reservationRoutes.post("/reservations",validatorToken,Reservations.addReservation)
reservationRoutes.get("/getreservation/:id",validatorToken,Reservations.getReservation)

export default reservationRoutes