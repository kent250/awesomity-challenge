const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv');

dotenv.config();


const app = express();
const port = process.env.PORT;

//db connection
mongoose.connect(process.env.DBURI)
    .then(()=>{
        app.listen(port, ()=>{
            console.log('Database Connected');
            console.log(`Server Up and learning on port ${port}`);
        })
    })
    .catch((err)=>{
        console.log(err);
});




app.get('/', (req, res) => {
    console.log("connected");
    res.end().status(200);
})

