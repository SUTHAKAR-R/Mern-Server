import mongoose from 'mongoose'
const { model, Schema } = mongoose


const newUser = new Schema({
    username: String,
    email: String,
    password: String,
    date: String,
    token: String
})

const User = model('User', newUser)

export default User