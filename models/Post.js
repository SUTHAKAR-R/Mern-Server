import mongoose from 'mongoose'
const { model, Schema } = mongoose


const newPost = new Schema({
    
    username: String,
    body: String,
    date: String,
    likes: [
        {
            username: String,
            date: String
        }
    ],
    comments: [
        {
            username: String,
            body: String,
            date: String
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})

const Post = model('Post', newPost)

export default Post