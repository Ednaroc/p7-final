// All the database configuration
require('dotenv').config();

module.exports = {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    user: 'root',
    password: 'mystrongpassword',
    database: 'p7_db',
    // define: {
    //     timestamps: true,
    //     underscored: true
    // }
};
