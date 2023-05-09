// const User = require('../models/User');
// const Post = require('../models/Post');
const { User, Post, PostReaction, Tag, Visited, Comment, UserPostReaction } = require('../database/initDB');
const fs = require('fs');
const session = require('express-session');

module.exports = {
    // Find one post or all posts
    async getPost(req, res) {
        
        if (req.params.post_id) {
            try {
                const id = req.params.post_id;

                const post = await Post.findByPk(id, {
                    include: [
                        { association: 'user', attributes: ['name'] },
                        // { model: Reaction },
                        // { all: true, nested: true }
                        // { association: 'user' },
                        // { model: Visited, where: { user_id: 4 }}
                    ]
                });

                if (post) {
                    return res.status(200).send({
                        activeUser: req.session.userid,
                        post
                    });
                } else {
                    return res.status(400).json({
                        status: 0,
                        message: 'Post not found.'
                    });
                }
            } catch (err) {
                return res.status(400).json({ error: err });
            }
            
            
        } else {
            try {
                const posts = await Post.findAll({
                    // include: 'user'
                    // include: { association: 'user' }
                    // include: { model: User}
                    // include: User
                    include:
                    [
                        // { association: 'user' },
                        { association: 'user', attributes: ['name'] },
                        { model: Visited, attributes: ['UserId'] },
                        // { model: Comment}
                        { model: Comment, attributes: ['UserId'] },
                        { model: PostReaction, include: { model: UserPostReaction } },
                        // { model: PostReaction, include: {all: true, nested: true }},
                        // { model: Visited, where: { user_id: 4 }, required: false}
                    ],
                    // attributes: {
                    //     include: [
                    //         [sequelize.fn('COUNT', sequelize.col('Comments.id')), 'totalCom']
                    //     ]
                    // },
                    order: [
                        ['createdAt', 'DESC']
                    ]
                });
                const amount = await Post.count();

                return res.status(200).json({
                    activeUser: req.session.userid,
                    posts,
                    amount
                });
            } catch (err) {
                return res.status(400).json({ error: err });
            }
        }
    },

    // Create a post for a given userID
    async createPost(req, res) {
        try {
            const user_id = req.session.userid;
            const { title, post_body} = req.body;

            const user = await User.findByPk(user_id);

            if (!user) {
                return res.status(400).json({
                    status: 0,
                    message: 'User does not exist.'
                });
            }

            // const { fileUrl, alt_text } = req.file ? { "", "" } : {"test", "truc" };
            const file_url = req.file ? req.protocol + '://' + req.get('host') + '/media/' + req.file.filename : null;
            const alt_text = req.file ? req.body.alt_text : null;

            // if (req.file) {
                // let path = req.file.path;
            //     let url = req.protocol + '://' + req.get('host');
            //     let filename = req.file.filename;
            //     let fileUrl = url + '/media/' + filename;
            //     alt_text = req.body.alt_text;
            // }

            const post = await Post.create({ title, post_body, user_id, file_url, alt_text});

            return res.status(200).json({
                status: 1,
                message: 'Post saved sucessfully.',
                post, file_url, alt_text
            });

        } catch (err) {
            return res.status(400).json({ error: err });
        }
    },

    // Updating one post given a postID
    async updatePost(req, res) {
        const id = req.params.id;
        const { title, post_body, alt_text } = req.body;
        // const file_url = req.file ? req.protocol + '://' + req.get('host') + '/media/' + req.file.filename : 'null';

        try {
            const post = await Post.findByPk(id);
            if (!post) {
                return res.status(400).json({
                    status: 0,
                    message: 'Post not found.'
                });
            }
            if (post.user_id !== req.session.userid) {
                return res.status(400).json({
                    status: 0,
                    message: 'Unauthorized request.'
                });
            }

            if (req.file) {
                // const oldFilename = post.file_url.split('/media/')[1];
                const oldFilename = post.file_url;
                const file_url = req.protocol + '://' + req.get('host') + '/media/' + req.file.filename;

                await Post.update({
                    title, post_body, file_url, alt_text
                }, { where: { id } });

                if (oldFilename) {
                    fs.unlink('media/' + oldFilename.split('/media/')[1], () => {
                        // res.status(201).json({message: 'Sauce updated successfully!'});
                        // console.log('Media correctly deleted');
                    });
                }  
            } else {
                await Post.update({
                    title, post_body, alt_text
                }, { where: { id } });
            }
            
            return res.status(200).json({
                status: 1,
                message: 'Post updated sucessfully.'
            });

        } catch (err) {
            return res.status(400).json({ error: err });
        }
    },

    // Deleting one post given a postID
    async deletePost(req, res) {
        const id = req.params.id;
        try {
            const post = await Post.findByPk(id);
            if (!post) {
                return res.status(400).json({
                    status: 0,
                    message: 'Post not found.'
                });
            }

            if (post.user_id !== req.session.userid) {
                return res.status(400).json({
                    status: 0,
                    message: 'Unauthorized request.'
                });
            }

            const filename = post.file_url;

            await Post.destroy({ where: { id } });

            if (filename) {
                fs.unlink('media/' + filename.split('/media/')[1], () => {
                    // console.log('Media deleted successfully')
                });
            }
            
            return res.status(200).json({
                status: 1,
                message: 'Post deleted sucessfully.'
            });

        } catch (err) {
            return res.status(400).json({ error: err });
        }
    },

    // Find all the posts read by a given userID
    async findReadPost(req, res) {
        const { user_id } = req.params;
        try {
            const user = await User.findByPk(user_id);
            if (user) {
                const output = await Journal.findAll({
                    where: {
                        user_id
                    }
                });
                return res.status(200).json({
                    status: 1,
                    message: 'This is the list of read posts',
                    output
                });
            } else {
                return res.status(400).json({
                    status: 0,
                    message: 'User not found.'
                });
            }

        } catch (err) {
            return res.status(400).json({ error: err });
        }
    },

    // Mark given post read by a given user
    async markReadPost(req, res) {
        const { post_id } = req.params;
        const user_id = req.session.userid;
        try {
            // const user = await User.findByPk(user_id, {include: Journal});
            const user = await User.findByPk(user_id);
            const post = await Post.findByPk(post_id);
            if (user) {
                // const output = await Journal.create({
                //     user_id: user_id, post_id: post_id
                // });
                // await user.addPost({where: post_id});

                const truc = await Visited.findOrCreate({
                    where: {
                        PostId: post.id,
                        UserId: user.id
                    }
                });

                // const truc2 = await user.createVisited({
                //     post_id: post.id,
                //     user_id: user.id
                // }); 

                // const truc = await user.createVisited({ 
                //     post_id: post.id
                // });

                
                // const truc = await post.update({
                //     journal
                // });
                
                return res.status(200).json({
                    status: 1,
                    message: 'The post has been saved in the read list (aka the Visited table)',
                    
                });
            } else {
                return res.status(400).json({
                    status: 0,
                    message: 'User not found.'
                });
            }

        } catch (err) {
            return res.status(400).json({ error: err });
        }
    },


    // Find posts by tag
    async indexTag(req, res) {
        try {
            const posts = await Post.findAll({
                include: [
                    { model: Tag, where: { name: req.params.tag } }
                ]
            })
            return res.status(200).json(posts);
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    },

    // Find all posts of one user
    async indexOneUser(req, res) {
    
        const { user_id } = req.params;
        try {
            const posts = await Post.findAll({
                include: [
                    { association: 'user', where: { id: user_id } }
                ]
            });
            return res.status(200).send(posts);       
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    },

    // Searching for all posts for a given userID
    async indexUser(req, res) {
        const { user_id } = req.params;

        const user = await User.findByPk(user_id, {
            include: { association: 'post' }
        });

        if (!user) {
            return res.status(400).send({
                status: 0,
                message: 'User not found.'
            });
        }

        return res.status(200).send(user.post);
    },
    
    // Create a post for a given userID with tag check
    async storeTagCheck(req, res) {
        // try {
            const body = req.body;
            // const [ tags ] = await Tag.findOrCreate({
            //     where: { name: body.tags.name }
            // });

            // const tags = await body.tags.map(tag => {
            //     const insertedTag = Tag.findOrCreate({
            //         where: { name: tag.name },
            //         defaults: { name: tag.name }
            //     });
            //     insertedTag.spread((tag, created) => tag)
            // });
            const mapTags = req.body.tags.map(x => myFunction(x));
            async function myFunction(tag) {
                const [validatedTags, c] = await Tag.findOrCreate({ where: {name: tag}})
                return validatedTags;
            };

            // const tags = await Tag.findOrCreate({ where: { name: tag.name }, defaults: { name: tag.name }})
            //                         .spread((tag, created) => tag);

            // console.log(mapTags);
            // const newpost = await Post.create(body);
            // const [tag1, c1] = await Tag.findOrCreate({ where: {name: body.tags.name1 }});
            // const [tag2, c2] = await Tag.findOrCreate({ where: {name: body.tags.name2 }});
            // console.log(tag1, tag2)
            // await newpost.addTags([tag1, tag2]);
            // await newpost.createTag({ name: body.tags.name3});

            return res.status(200).json({
                status: 1,
                message: 'Post saved sucessfully.',
                // newpost
            });

            // Post.create({
            //     title: body.title,
            //     post_body: body.post_body,
            //     tags: [
            //         { name: body.tags.name1 },
            //         { name: body.tags.name2}
            //     ]
            // }, {
            //     include: [
            //         // { association: Tag.belongsToMany(Post) }
            //         Tag
            //     ]
            // });
            

            // User.findByPk(body.user_id)
            //     .then(() => Post.create(body)
            //                     .then(() => Post.addTag(tags)))
            //     .then(() => Post.addTags(tags))
            //     .then(post => Promise.all(tags)
            //         .then(storedTags => post.addTag(storedTags))
            //         .then(() => post))
            //     .then(post => Post.findOne({ where: {id: post.id}, include: [User, Tag]}))
            //     .then(postWithAssociations => res.json(postWithAssociations))
            //     .catch(err => res.status(400).json({ err: `User with id = [${body.userId}] doesn\'t exist.`}))

        // } catch (err) {
        //     return res.status(400).json({ error: err });
        // }
    },

    async likePost(req, res) {
        const id = req.params.id;
        try {
            const post = await Post.findByPk(id);
            if (post) {
                await Post.increment({
                    total_likes: 1
                }, { where: { id } });
                return res.status(200).json({
                    status: 1,
                    message: 'Post likes updated sucessfully.',
                    like: post.total_likes +1
                });
            } else {
                return res.status(400).json({
                    status: 0,
                    message: 'Post not found.'
                });
            }

        } catch (err) {
            return res.status(400).json({ error: err });
        }
    },

}