//import express
const express=require('express')

//import env file
require('dotenv').config()

//import cors
const cors=require('cors')
const router = require('./routes/userRouting')

//import db connection
require('./db/dbconnection')

//import router
const rout=require('./routes/userRouting')

//create server using express
const server=express()

//connect with frontend
server.use(cors())

//to convert all incoming json data into js
server.use(express.json())

server.use(rout)

// server.get('/excgetpath/newuser',(req,res)=>{
//     res.send("get request response...")
// })

// server.get('/excgetpath/lastuser',(req,res)=>{
//     res.send("get request response 2...")
// })

//set port
const port=3003 || process.env.port

//running configuration
server.listen(port,()=>{
    console.log(`______Server started @ port number ${port}__________`);
})