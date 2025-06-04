import express, { json } from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from 'cookie-parser'
import authRoutes from "./routes/auth.routes.js"
import problemRoutes from "./routes/problem.routes.js"
import executionRoute from "./routes/execute.route.js"
import submissionRoute from "./routes/submission.route.js"

dotenv.config()

const app = express(); 

console.log(process.env.PORT)

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin : process.env.BASE_URL,
    methods : ['GET','POST','DELETE','OPTIONS'],
    allowedHeaders : ['Content-Type','Authorization'],
    credentials : true
}))

app.get('/',(req,res)=>{
    res.send('hey there its working ')
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/problems', problemRoutes)
app.use('/api/v1/execute-code', executionRoute)
app.use('/api/v1/submission', submissionRoute)



app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`)
})