const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, type) => {
    return sequelize.define('User', {
        name: { type: DataTypes.STRING, unique: true, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, unique: true, allowNull: false,
            // validate: { isEmail: {msg: "It must be a valid email address."} }
        },
        islogged: DataTypes.BOOLEAN
        }, {
        sequelize,
        // Crypted password
        hooks: {
            beforeCreate: (user) => {
                const salt = bcrypt.genSaltSync();
                user.password = bcrypt.hashSync(user.password, salt);
            }
        },
        defaultScope: {
            attributes: { exclude: ['password']}
        }
    })
}

// module.exports = (sequelize, type) => {
//     return sequelize.define('User', {
//         name: DataTypes.STRING,
//         password: DataTypes.STRING,
//         email: DataTypes.STRING,
//                 // email: {
//                 //     type: DataTypes.STRING,
//                 //     unique: true,
//                 //     allowNull: false,
//                     // validate: {
//                     //     isEmail: {msg: "It must be a valid email address."},
//                     // }
//                 // },
//                 islogged: DataTypes.BOOLEAN
//             }, {
//                 sequelize,
//                 // Crypted password
//                 hooks: {
//                     beforeCreate: (user) => {
//                         const salt = bcrypt.genSaltSync();
//                         user.password = bcrypt.hashSync(user.password, salt);
//                     }
//                 },
//     })
// }

// const User = sequelize.define('User', {
//     name: DataTypes.STRING,
// });

// module.exports = User;