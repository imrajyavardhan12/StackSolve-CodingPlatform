import express, { json } from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from 'cookie-parser'
import authRoutes from "./routes/auth.routes.js"
import problemRoutes from "./routes/problem.routes.js"

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



app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`)
})