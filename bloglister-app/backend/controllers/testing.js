import { Router } from "express";
import "dotenv/config";
import { Blog } from "../models/blog.js";
import "express-async-errors"
import { User } from "../models/user.js";
import pkg from 'jsonwebtoken';
const { verify } = pkg;


export const testingRouter = Router()


testingRouter.post('/reset', async (request, response) => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    response.status(204).end()
})

