const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

module.exports = (sequelize, type) => {
    return sequelize.define('Comment', {
        comment_body: { type: DataTypes.TEXT, allowNull: false },
        // path:,
    }, {
        sequelize,
        tableName: 'comments'
    })
}