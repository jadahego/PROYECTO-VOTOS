const Sequelize = require("sequelize");

const dbConnection = new Sequelize('mydb', 'jafed', 'Davidhg#8', {
    host: 'localhost', //url servidor remoto caso tal
    dialect: 'mysql',
    //logging: false
})


module.exports = {
    dbConnection
}