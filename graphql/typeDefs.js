import { gql } from 'apollo-server'


const typeDefs = gql`

        type Post {
            id: ID!
            username: String!
            body: String!
            date: String!
            likes: [Like]!
            comments: [Comment]!
            likeCount: Int!
            commentCount: Int!
        }

        type Like {
            id: ID!
            username: String!
            date: String!
        }

        type Comment {
            id: ID!
            username: String!
            body: String!
            date: String!
        }

        type User {
            id: ID!
            username: String!
            email: String!
            password: String!
            date: String!
            token: String!
        }

        type Query {
            getPosts: [Post]
            getPost(postId: String!): Post
        }

        input RegisterInput {
            username: String!
            email: String!
            password: String!
            confirmPassword: String
        }

        type Mutation {
            register(registerInput: RegisterInput): User!
            login(username: String!, password: String): User!
            createPost(body: String!): Post!
            deletePost(postId: String!): String!
            likePost(postId: String!): Post!
            createComment(postId: String!, body: String!): Post!
            deleteComment(postId: ID!, commentId: ID!): Post!
        }
`

export default typeDefs