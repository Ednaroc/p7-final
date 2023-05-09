// Initialization of connection to database and creation of associations

const UserModel = require('../models/User');
const PostModel = require('../models/Post');
const ReactionModel = require('../models/Reaction');
const TagModel = require('../models/Tag');
const CommentModel = require('../models/Comment');

const dbConfig = require('../config/dbConfig.js');
const { Sequelize, DataTypes, Model } = require('sequelize');


const mysql = require('mysql2');
// // Open the connection to MySQL server
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "mystrongpassword",
// });
// // Run create database statement
// connection.query(
//   `CREATE DATABASE IF NOT EXISTS p7_db`,
//   function (err, results) {
//     console.log(results);
//     console.log(err);
//   }
// );
// // Close the connection
// connection.end()


const { host, port, user, password, database } = dbConfig;

const connection = mysql.createConnection({ host, user, password });
connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
connection.end()

const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

const User = UserModel(sequelize, Sequelize);
const Post = PostModel(sequelize, Sequelize);
const Reaction = ReactionModel(sequelize, Sequelize);
const Tag = TagModel(sequelize, Sequelize);
const Comment = CommentModel(sequelize, Sequelize);


// One-to-Many relationship between User and Post
User.hasMany(Post, { foreignKey: 'user_id', as: 'post' });
Post.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Many-to-Many relationship between Post and User through Visited to record read posts
const Visited = sequelize.define('Visited', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  }
});
// User.belongsToMany(Post, { through: Visited });
// Post.belongsToMany(User, { through: Visited });
Post.hasMany(Visited, { foreignKey: { allowNull: false }});
Visited.belongsTo(Post);
User.hasMany(Visited, { foreignKey: { allowNull: false }});
Visited.belongsTo(User);

// One-to-Many relationship between Post and Comment, User and Comment
Post.hasMany(Comment, { foreignKey: { allowNull: false }});
Comment.belongsTo(Post);
User.hasMany(Comment, { foreignKey: { allowNull: false }});
Comment.belongsTo(User);

// Many-to-Many relationship between Post and Tag
const PostTag = sequelize.define('PostTag', {});
Post.belongsToMany(Tag, { through: PostTag, unique: false });
Tag.belongsToMany(Post, { through: PostTag, unique: false });

// Super Many-to-Many relationship between Post and Reaction
const PostReaction = sequelize.define('PostReaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    }
});
Reaction.belongsToMany(Post, { through: 'PostReaction' });
Post.belongsToMany(Reaction, { through: 'PostReaction' });
PostReaction.belongsTo(Post);
PostReaction.belongsTo(Reaction);
Post.hasMany(PostReaction);
Reaction.hasMany(PostReaction);

// Super Many-to-Many relationship between User and PostReaction
const UserPostReaction = sequelize.define('UserPostReaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    }
});
User.belongsToMany(PostReaction, { through: UserPostReaction });
PostReaction.belongsToMany(User, { through: UserPostReaction });
UserPostReaction.belongsTo(User);
UserPostReaction.belongsTo(PostReaction);
User.hasMany(UserPostReaction);
PostReaction.hasMany(UserPostReaction);

sequelize.sync();

// (async() => {

//   await sequelize.sync();
//   console.log('a')
//   await User.bulkCreate([
//     { name: 'Bulk1', password: '123', email: 'bulk1@gmail.com' },
//     { name: 'Bulk2', password: '123', email: 'bulk2@gmail.com' },
//   ]);
//   console.log('b')
//   await Post.bulkCreate([
//     { title: 'BulkTitle1', post_body: 'BulkBody1', user_id: '1', user: [{ name: 'Bulk1' }]},
//     // { title: '', post_body: ''},
//   ], {
//     include: [user]
//   });
//   console.log('c')

// })();


module.exports = {
  User,
  Post,
  Reaction,
  PostReaction,
  Tag,
  Comment,
  Visited,
  UserPostReaction
};