const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv');

dotenv.config();


const app = express();
const port = process.env.PORT;
const dbURI = process.env.DBURI

//middleware section

//db connection
mongoose.connect(dbURI)
    .then(()=>{
        app.listen(port, ()=>{
            console.log('Database Connected');
            console.log(`Server Up and learning on port ${port}`);
        })
    })
    .catch((err)=>{
        console.log(err);
});



// routes section
app.get('/', (req, res) => {
    console.log("connected");
    res.end().status(200);
})

