import express, { json } from 'express'
import cors from 'cors'
import { connect } from 'mongoose'
import { blogsRouter } from './controllers/blogs.js'
import { usersRouter } from './controllers/users.js'
import { errorHandler, requestLogger, tokenExtractor, unknownEndpoint, userExtractor } from './utilities/middleware.js'
import { MONGODB_URI } from "./utilities/config.js"
import { errorlogger, info } from './utilities/logger.js'
import { loginRouter } from './controllers/login.js'
import { testingRouter } from "./controllers/testing.js"

connect(MONGODB_URI).then(() => {
    info("Connected to MongoDB");
}).catch((err) => {
    errorlogger(err);
})

export const app = express()
app.use(cors())
app.use(json())
app.use(requestLogger)
app.use(tokenExtractor)
if (process.env.NODE_ENV === 'test') {
    app.use('/api/testing', testingRouter)
}
app.use('/blogs', userExtractor, blogsRouter)
app.use('/users', usersRouter)
app.use('/login', loginRouter)

app.use(unknownEndpoint)
app.use(errorHandler)
