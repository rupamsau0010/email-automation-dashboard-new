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

// Create new task post route
// get data from the form and insert it into the database
router.post("/create-new-task-data", (req, res) => {
    // basic common infos
    const sender_id = req.cookies.email_id;
    const employee_ids = req.body['receivers-email-id']
    const task_name = req.body['task-name']
    const task_details = req.body['task-details']
    const severity = req.body['severity']
    const cc = req.body['cc']
    const cc_times = parseInt(req.body['cc-times'])
    const bcc = req.body['bcc'] 
    const bcc_times = parseInt(req.body['bcc-times'])

    // function for calculatin the date and times if meeting needed
    function meeting_needed_calculation() {
        let meeting_dates_times = []
        
        // check meeting type
        let meeting_preferance_day_type = req.body['meeting-preferance-day-type']

        if (!Array.isArray(meeting_preferance_day_type)) {
            meeting_preferance_day_type = [meeting_preferance_day_type]
        }

        // "day-before",
        // "day-same",
        // "day-after",
        // "day-custom"

        if (meeting_preferance_day_type.indexOf("day-before") !== -1) {
            
        } else if (meeting_preferance_day_type.indexOf("day-same") !== -1) {

        } else if (meeting_preferance_day_type.indexOf("day-after") !== -1) {

        } else if (meeting_preferance_day_type.indexOf("day-custom") !== -1) {

        }

        // console.log(meeting_preferance_day_type);

        return meeting_dates_times
    }

    // check the recurrence patteren
    const recurrence = req.body['recurrence']

    // if recurrence === 'custom' or 'daily' or 'weekly' or 'monthly'
    if (recurrence === 'custom') {
        const custom_hidden_start_end_date = JSON.parse(req.body['custom-hidden-start-end-date'])

        let assigned_date_arr = []
        let last_date_arr = []

        // extract all the assigned dates and last dates
        for(i=0; i<custom_hidden_start_end_date.length; i++) {
            let assigned_date = custom_hidden_start_end_date[i][0]
            let last_date = custom_hidden_start_end_date[i][1]

            assigned_date_arr.push(assigned_date)
            last_date_arr.push(last_date)
        }

        // check meeting needed or not
        const meeting_needed = req.body['meeting-needed'] === 'meeting_needed'

        // write the entries into the database
        let total_tasks = assigned_date_arr.length
        for(let i=0; i<total_tasks; i++) {
            // if meeting needed
            // call meeting_needed_calculation function
            if (meeting_needed) {
                let meeting_dates_times = []
                meeting_dates_times = meeting_needed_calculation(assigned_date_arr[i], last_date_arr[i])

                // insert into the database
                // code
            } else {
                // insert into the database
                // code
            }
        }
        

    }else if (recurrence === 'daily') {
        
    } else if (recurrence === 'weekly') {

    } else if (recurrence === 'monthly') {

    }

    res.json({ "data": req.body })
})

// router.get("/testejs", (req, res) => {
//     res.render("test")
// })

module.exports = router