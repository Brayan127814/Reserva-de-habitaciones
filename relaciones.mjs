import users from "./models/usuarios.mjs";
import roles from "./models/role.mjs";


/*
 un rol puede tener muchos usuarios
 y un usuaro solo puede terner un rol

*/


roles.hasMany(users,{
    foreignKey: 'roleID'
   
})
users.belongsTo(roles,{
    foreignKey: 'roleID'
 
})