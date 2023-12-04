const express = require('express')
const bodyParser =require('body-parser')
const Codechef = require('./routes/Codechef')

const app = express()

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json())

app.use("/",Codechef)

app.listen(PORT , ()=>{
    console.log(`Listening to port ${PORT}`);
})