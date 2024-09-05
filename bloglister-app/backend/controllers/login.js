import { compare } from 'bcrypt'
import { User } from '../models/user.js'
import { Router } from "express";
import "dotenv/config";
import pkg from 'jsonwebtoken';
const { sign } = pkg;

export const loginRouter = Router()

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body
    console.log(username, password);

    const user = await User.findOne({ username })
    const passwordCorrect = user === null
        ? false
        : await compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    const token = sign(userForToken, process.env.SECRET)

    response
        .status(200)
        .send({ token, username: user.username, name: user.name })
})
