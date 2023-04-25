// Import the modules
const Express = require("express");
const router = Express.Router();
const sql = require("mssql")

// Import user defined modules
const mssql_config = require("../configs/connectMSsql")

// craete a net task get request page
router.get("/create-new-task", (req, res) => {
    res.render("create-task")
})

router.get("/testejs", (req, res) => {
    res.render("test")
})

module.exports = router