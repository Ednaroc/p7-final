const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

module.exports = (sequelize, type) => {
    return sequelize.define('Reaction', {
        name: DataTypes.STRING,
    }, {
        sequelize,
        tableName: 'reactions'
    })
}

// const { Model, DataTypes } = require('sequelize');

// class Reaction extends Model {
//     static init(sequelize) {
//         super.init({
//             name: DataTypes.STRING,
//         }, {
//             sequelize,
//             tableName: 'reactions'
//         })
//     }

//     static associate(models) {
//         // this.belongsToMany(models.User, { foreignKey: 'reaction_id', through: 'user_reactions', as: 'users'});
//         // this.belongsToMany(models.Post, { foreignKey: 'reaction_id', through: 'user_reactions', as: 'posts'});
//     }
// }

// module.exports = Reaction;