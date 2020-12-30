import postResolvers from '../resolvers/post.js'
import userResolvers from '../resolvers/user.js'



const resolvers = {

    Post: {
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length
    },

    Query: {
        ...postResolvers.Query
    },

    Mutation: {
        ...postResolvers.Mutation,
        ...userResolvers.Mutation
    }
}

export default resolvers