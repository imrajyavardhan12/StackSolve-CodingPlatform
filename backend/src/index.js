import express from "express"
import dotenv from "dotenv"

dotenv.config()

const app = express(); 

console.log(process.env.PORT)

app.get('/',(req,res)=>{
    res.send('hey there its working ')
})
const x = 5

app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`)
})