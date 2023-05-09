const { User, Post, Reaction, Tag, Comment, PostReaction } = require('../database/initDB');
// const { Post } = require('../models');

module.exports = {
    // Searching for all reactions for a given userID
    async getReactions(req, res) {
        const { post_id } = req.params;
        try {
            const user_id = req.session.userid;

            const user = await User.findByPk(user_id, {
                // include: { model: PostReaction,
                //     where: { ReactionId: 1, PostId: post_id }
                // },
                attributes: ['id']
            });

            const reaction = await Reaction.findOne({ where: { name: 'like' }});
            const reaction_id = reaction.id;

            // const test = await PostReaction.findAndCountAll({
            //     where: {
            //         ReactionId: 1,
            //         PostId: post_id,
            //         // include: {
            //         //     model:
            //         // }
            //     }
            // })

            // const test = await User.findAndCountall({
            //     where: {
            //         // id: user_id,
            //         include: {
            //             model: PostReaction,
            //             where: { ReactionId: 1, PostId: post_id }
            //         }
            //     }
            // });

            if (!user) {
                return res.status(400).send({
                    status: 0,
                    message: 'User not found.'
                });
            }

            const userPR = await user.countPostReactions({
                where: { ReactionId: reaction_id, PostId: post_id }
            });

            return res.status(200).json({
                status: 1,
                message: 'Reactions retrieved sucessfully.',
                userPR
            });
            return res.status(200).send(user.reactions);
        } catch (err) {
            return res.status(400).json({ error: err });
        }
        
    },
    
    // Adding a reaction for a given userID
    async createReaction(req, res) {
        try {
            const { post_id } = req.params;
            const user_id = req.session.userid;
            // if {name: 'like'}
            const { name } = req.body;
            // const name = 'like';
            const user = await User.findByPk(user_id);
            const post = await Post.findByPk(post_id);

            if (!user) {
                return res.status(400).json({
                    status: 0,
                    message: 'User does not exist.'
                });
            }

            const [ reaction ] = await Reaction.findOrCreate({
                where: { name }
            });

            const [ postReaction ] = await PostReaction.findOrCreate({
                where: { ReactionId: reaction.id, PostId: post.id }
            });
            
            // const [ postReaction ]= await post.getPostReactions({
            //     where: { reactionId: reaction.id }
            // });
            // if (postReaction == null) {
            //     [ postReaction ] = await post.addReaction(reaction);
            // }

            const result = await user.addPostReaction(postReaction);

            const count = await post.countPostReactions();
            // console.log('Post has x reactions type: ' + count)
            const count2 = await postReaction.countUserPostReactions();
            // console.log('PostReaction has x users: ' + count2)
            const count3 = await Post.update({total_likes: count2}, {where: {id: post_id}});
            return res.status(200).json({
                status: 1,
                message: 'Reaction saved sucessfully.',
                count2
            });

        } catch (err) {
            return res.status(400).json({ error: err });
        }
    },

    async updateReaction(req, res) {

    },

    async deleteReaction(req, res) {
        try {
            const user_id = req.session.userid;
            // const user_id = 19;
            const { post_id } = req.params;
            const { name } = req.body;
            // const name = 'like';
            const user = await User.findByPk(user_id);
            const post = await Post.findByPk(post_id);
            const reaction = await Reaction.findOne({ where: { name }});
            // console.log(reaction)
            const reaction_id = reaction.id;
           
            if (!user) {
                return res.status(400).json({
                    status: 0,
                    message: 'User does not exist.'
                });
            }

            
            // const test = await user.removePostReaction({
            //     // where: { ReactionId: 1, PostId: post_id}
            //     where: { PostReactionId: 16 }
            // });
            // const test = await user.removePostReaction(16); //this option is working but you need to know the ID number 16...
            const userPR = await user.getPostReactions({
                where: { ReactionId: reaction_id, PostId: post_id}
            });
            await user.removePostReaction(userPR);

            const [ postReaction ] = await post.getPostReactions({
                where: { ReactionId: reaction_id }
            });
            const count2 = await postReaction.countUserPostReactions();
            const count3 = await Post.update({total_likes: count2}, {where: {id: post_id}});

            return res.status(200).json({
                status: 1,
                message: 'Relation deleted sucessfully.',
                count2
            });

        } catch (err) {
            return res.status(400).json({ error: err });
        }
    },

    async getComments(req, res) {
        const { post_id } = req.params;
        try {
            const post = await Post.findByPk(post_id, {
                include: {
                    model: Comment,
                    include: { model: User, attributes: ['name'] }
                },
                // } Comment
            });

            // const coms = await Comment.findAll({
            //     include: { model: Post, where: { id: post_id }}
            // });
            // console.log(coms);

            if (!post) {
                return res.status(400).send({
                    status: 0,
                    message: 'Post not found.'
                });
            }
            return res.status(200).json({
                status: 1,
                message: 'Comments retrieved sucessfully.',
                data: post.Comments
            });
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    },

    async createComment(req, res) {
        const { post_id } = req.params;
        const { comment_body } = req.body;
        const user_id = req.session.userid;

        try {
            const com = await Comment.create({ comment_body, PostId: post_id, UserId: user_id }
                // , {
                // include: [{
                //     association: Comment.belongsTo(Post)
                // }]
            // }
            );
            return res.status(200).json({
                status: 1,
                message: 'Comment saved sucessfully.',
                com
            });
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    },

    async updateComment(req, res) {
        const id = req.params.com_id;
        const comment_body = req.body;
        try {
            const com = await Comment.findByPk(id);
            if (com) {
                await com.update(comment_body);
                return res.status(200).json({
                    status: 1,
                    message: 'Comment updated sucessfully.',
                    com
                });
            } else {
                return res.status(400).json({
                    status: 0,
                    message: 'Comment not found.'
                });
            }
            // const com = await Comment.update(comment_body, {where: { id: comment_id }});
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    },

    async deleteComment(req, res) {
        const id = req.params.com_id;
        try {
            const com = await Comment.findByPk(id);
            if (com) {
                await com.destroy();
                return res.status(200).json({
                    status: 1,
                    message: 'Comment deleted sucessfully.',
                    com
                });
            } else {
                return res.status(400).json({
                    status: 0,
                    message: 'Comment not found.'
                });
            }
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
}