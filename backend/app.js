const express = require('express');
const errorMiddleware = require('./middlewares/errors')
const indexingRouter = require('./routes/indexingRoute')
const path = require('path');
const cors =require('cors')
const app = express();
app.use(express.json());
app.use(cors())
app.use('/api',indexingRouter)
// middleware for error
app.use(express.static(path.join(__dirname,"../frontEnd/build")));
app.get("/*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"../frontEnd/build/index.html"))
})
app.use(errorMiddleware);

module.exports =app;