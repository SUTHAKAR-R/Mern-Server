import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { UserInputError } from 'apollo-server';

import { SECRET_KEY } from '../../config.js'
import User from '../../models/User.js';
import { validateRegisterInput, validateLoginInput } from "../../utils/validators.js";

const issueToken = (user) => {
    const token = jwt.sign(
        
        {
        id: user.id,
        username: user.username,
        email: user.email
        },
        SECRET_KEY,
        { expiresIn: '1h'}
    )
    return token
}

export default {
    
    Mutation: {

        async register(_, { registerInput: {username, email, password, confirmPassword} }) {
            const {errors, valid} = validateRegisterInput(username, email, password, confirmPassword)

            if(!valid) {
                throw new UserInputError('Errors', {errors})
            }

            const res = await User.findOne({ username })
            if (res) {
                    throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }

            password = await bcrypt.hash(password, 12)

            const newUser = new User({
                username,
                email,
                password,
                date: new Date().toISOString(),
            })

            const user = await newUser.save()

            return {
                id: user._id,
                ...user._doc,
                token: issueToken(user)
            } 
        },

        async login(_, {username, password}) {
            
            const {errors, valid} = validateLoginInput(username, password)
            if (!valid) {
                throw new UserInputError('Errors', {errors})
            }

            const user = await User.findOne({username})
            if (!user) {
                errors.general = 'No user is registered with the given username. Register first'
                throw new UserInputError('Errors', {errors})
            }

            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                errors.general = 'Wrong Username/Password Combination'
                throw new UserInputError('Errors', {errors})
            }

            return {
                id: user._id,
                ...user._doc,
                token: issueToken(user)
            }
        }
    }
}