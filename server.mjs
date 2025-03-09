
import express from 'express'


import conectDB from './config/db.mjs'
import users from './models/usuarios.mjs'
import roles from './models/role.mjs'
import habitaciones from './models/habitaciones.mjs'
import { reservas } from './models/reservas.mjs'
import routeCliente from './routes/routesClientes.mjs'
import roomRouter from './routes/roomRoute.mjs'
import reservationRoutes from './routes/reservationsRoutes.mjs'

// import roles from './models/role.mjs'
import './relaciones.mjs'


const app = express()
const puerto = process.env.PORT || 3000


app.use(express.json())




app.use('/users',routeCliente)
app.use('/habitaciones',roomRouter)
app.use('/reservas',reservationRoutes)
const init = async () => {
    try {
        await conectDB.sync({
            force: false
        });
        console.log('Database connected successfully');
        app.listen(puerto, () => {
            console.log('Server is running on port ' , puerto);
        })
    } catch (error) {
        console.error('Error al sincronizar la base de datos')
    }

}

init()
