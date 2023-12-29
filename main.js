require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();


// Database Connection
// mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, });
mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to the database"));

//Middlewares
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false
}));

app.use((req,res,next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

//set template engine
app.set("view engine", "ejs");


// app.get('/',(req,res)=>{
//     res.send("Hello World");
// });

//route prefix
app.use("", require('./routes/routes'))

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`Server Running on http://localhost:${PORT}`);
})
