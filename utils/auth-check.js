import { AuthenticationError } from 'apollo-server';
import jwt from 'jsonwebtoken'

import { SECRET_KEY } from '../config.js';

const authCheck = (context) => {
    
    const authHeader = context.req.headers.authorization

    if (authHeader) {

        const token = authHeader.split('Bearer ')[1]

        if (token) {
            try {
                const user = jwt.verify(token, SECRET_KEY)
                return user
            } catch(err) {
                throw new AuthenticationError('Invalid/Expired token')
            }
        } 

        throw new Error("Headers should look like this 'Bearer <token>' ")
    }

    throw new Error('Autherization Headers must be provided')
}

export default authCheck