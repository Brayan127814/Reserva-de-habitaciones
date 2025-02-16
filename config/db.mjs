import dotenv from 'dotenv'
import {
    Sequelize
} from 'sequelize'

dotenv.config()
//Verificar que las variables de entorno se estén cargando

console.log(process.env.BD_NAME)
console.log(process.env.BD_USER)
console.log(process.env.BD_PASSWORD)
console.log(process.env.BD_HOST)
const conectDB = new Sequelize(

    process.env.BD_NAME,
    process.env.BD_USER,
    process.env.BD_PASSWORD, {
        dialect: "mysql",
        host: process.env.BD_HOST
    }
)

//Validar la conexion

const testConection = async()=>{
     try {
        
        await conectDB.authenticate()
        console.log('Conexion establecida')
     } catch (error) {

         console.error('Error de conexion', error)
        
     }
}


testConection()


export default conectDB