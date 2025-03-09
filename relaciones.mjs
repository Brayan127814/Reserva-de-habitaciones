import users from "./models/usuarios.mjs";
import roles from "./models/role.mjs";
import {
    reservas
} from "./models/reservas.mjs";
import detalleReservas from "./models/detalleReservas.mjs";
import habitaciones from "./models/habitaciones.mjs";

/*
 un rol puede tener muchos usuarios
 y un usuaro solo puede terner un rol

*/


roles.hasMany(users, {
    foreignKey: 'roleID'

})
users.belongsTo(roles, {
    foreignKey: 'roleID'

})

/*
    relacion entre reservas y clientes
    un usuario puede realizar muchar reservas  y una reserva puede tener un solo cliente
*/
// Una reserva pertenece a un usuario
reservas.belongsTo(users, {
    foreignKey: 'userID',
    onDelete: 'CASCADE'
})

// Una reserva puede tener muchas habitaciones
// a través de detallesReservas
habitaciones.belongsToMany(reservas, {
    through: detalleReservas,
    foreignKey: 'roomsID'
})

reservas.belongsToMany(habitaciones, {
    through: detalleReservas,
    foreignKey: 'reservasID'
})