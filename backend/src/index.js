import express, { json } from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from 'cookie-parser'
import authRoutes from "./routes/auth.routes.js"
import problemRoutes from "./routes/problem.routes.js"
import executionRoute from "./routes/execute.route.js"
import submissionRoute from "./routes/submission.route.js"
import playlistRoutes from "./routes/playlist.route.js"
import profileRoutes from "./routes/profile.routes.js"

dotenv.config()

const app = express(); 

console.log(process.env.PORT)

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin : process.env.FRONTEND_URL || 'http://localhost:3000',
    methods : ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders : ['Content-Type','Authorization'],
    credentials : true
}))

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK',
        message: 'Backend is running'
    })
})

app.get('/',(req,res)=>{
    res.send('hey there its working ')
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/problems', problemRoutes)
app.use('/api/v1/execute-code', executionRoute)
app.use('/api/v1/submission', submissionRoute)
app.use("/api/v1/playlist", playlistRoutes)
app.use("/api/v1/profile", profileRoutes)



app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`)
})