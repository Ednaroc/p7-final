const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

module.exports = (sequelize, type) => {
    return sequelize.define('Post', {
        title: DataTypes.STRING,
        post_body: DataTypes.TEXT,
        // tags: DataTypes.STRING,
        total_likes: DataTypes.INTEGER,
        file_url: DataTypes.STRING,
        alt_text: DataTypes.STRING
    }, {
        sequelize
    })
}

// class Post extends Model {}

// Post.init({
//     title: DataTypes.STRING,
//     // post_body: DataTypes.STRING,
//     post_body: DataTypes.TEXT,
//     tags: DataTypes.STRING,
//     total_likes: DataTypes.INTEGER
// }, {
//     sequelize
// });

// const { Model, DataTypes } = require('sequelize');

// class Post extends Model {
//     static init(sequelize) {
//         super.init({
//             title: DataTypes.STRING,
//             // post_body: DataTypes.STRING,
//             post_body: DataTypes.TEXT,
//             tags: DataTypes.STRING,
//             total_likes: DataTypes.INTEGER
//         }, {
//             sequelize
//         })
//     }

//     static associate(models) {
//         // this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
//         // this.belongsToMany(models.Reaction, { foreignKey: 'post_id', through: 'user_reactions', as: 'posts'});
//     }
// }

// module.exports = Post;