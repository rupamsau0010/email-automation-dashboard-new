// Getting the modules
require("dotenv").config();

const express = require("express");
const sql = require("mssql")
const cookieParser = require('cookie-parser');
// const session = require("express-session")

// Getting the self defined modules
const authRoutes = require("./routes/authentication")
const tableDataRoutes = require("./routes/tabledata")
const mssql_config = require("./configs/connectMSsql")
const {cookieJwtAuth} = require("./middlewares/authMiddleware")

const app = express();

// setting up the dynamic port as well as the local port.
const port = process.env.APPSETTING_PORT;  

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static("public"));
app.use(cookieParser(process.env.APPSETTING_COOKIE_SECRET));

// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true }
// }))

//--------------------
// Testing
// const expirationTime = new Date();
// expirationTime.setMinutes(expirationTime.getMinutes() + 2);
// console.log(typeof(expirationTime.toISOString()));
// console.log(expirationTime);

//--------------------
// use the routes
app.use("/", authRoutes)
app.use("/", cookieJwtAuth, tableDataRoutes)

// Running the server
app.listen(port, (err) => {
    if(!err) {
        console.log(`Server in running on port ${port}`);
    }
})