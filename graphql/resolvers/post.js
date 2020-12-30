import Post from '../../models/Post.js'
import authCheck from '../../utils/auth-check.js'

export default {

    Query: {

        async getPosts() {
            const posts = await Post.find().sort({date: -1})
            return posts
        },

        async getPost(_, {postId}) {
            const post = await Post.findById(postId)
            if (post) {
                return post
            } else {
                throw new Error("Post not found")
            }
        }
    },

    Mutation: {
        
        async createPost(_, {body}, context) {
            
            if (body.trim() === '') {
                throw new Error('Post body cannot be empty')
            }
            
            const user = authCheck(context)

            const newPost = new Post({
                username: user.username,
                body: body,
                date: new Date().toISOString(),
                user: user.id
            })

            const post = await newPost.save()

            return post

        },

        async deletePost(_, {postId}, context) {

            const user = authCheck(context)
            const post = await Post.findById(postId)

            if (post.username === user.username) {
                await post.delete()
                return "Post deleted successfully"
            } else {
                throw new Error("You are not authorized to delete this post")
            }
        },

        async likePost(_, {postId}, context) {
            const user = authCheck(context)
            const post = await Post.findById(postId)

            if (post) {
               
                if(post.likes.find((like) => {like.username === user.username})) {
                    post.likes = post.likes.filter((like) => like.username !== user.username)
                } else {
                    post.likes.push({
                        username: user.username,
                        date: new Date().toISOString()
                    })
                }
                
                await post.save()
                return post

            } else {
                throw new Error("Post not found")
            }
        },

        async createComment(_, {postId, body}, context) {
            const user = authCheck(context)
            const post = await Post.findById(postId)

            if (body.trim() === '') {
                throw new Error("Comment body cannot be empty")
            }

            if (post) {
                
                post.comments.unshift({
                    username: user.username,
                    body: body,
                    date: new Date().toISOString()
                })

                await post.save()
                return post
            
            } else {
                throw new Error("Post not found")
            }
        },
        
        async deleteComment(_, {postId, commentId}, context) {
            const user = authCheck(context)
            const post = await Post.findById(postId)
            
            if (post) {
                
                const commentIndex = post.comments.findIndex((comment) => comment.id === commentId)
               
                if(post.comments[commentIndex].username === user.username) {
                    post.comments.splice(commentIndex, 1)
                } else {
                    throw new Error("You are not authorized to delete thid post")
                }

                await post.save()
                return post
            
            } else {
                throw new Error("Post not found")
            }
        } 
    }
}