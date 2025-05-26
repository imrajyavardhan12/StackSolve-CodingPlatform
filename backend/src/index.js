import express, { json } from "express"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const app = express(); 

console.log(process.env.PORT)

app.use(express.json())

app.use(cors({
    origin : process.env.BASE_URL,
    methods : ['GET','POST','DELETE','OPTIONS'],
    allowedHeaders : ['Content-Type','Authorization'],
    credentials : true
}))

app.get('/',(req,res)=>{
    res.send('hey there its working ')
})

app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`)
})