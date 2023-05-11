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
router.post("/create-new-task-data", async (req, res) => {
    try {
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
        function meeting_needed_calculation(last_date) {
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

            // "day-before"
            if (meeting_preferance_day_type.indexOf("day-before") !== -1) {
                const meetingTimeBeforeSameAfter = req.body['before-same-after-time']
                // console.log(typeof(last_date));
                // console.log(meetingTimeBeforeSameAfter);
                // create a datetime obj from the last_date and the meeting time

                const dateParts = last_date.split("/");
                if (dateParts[0].length < 2) {
                    dateParts[0] = '0' + dateParts[0]
                }
                if (dateParts[1].length < 2) {
                    dateParts[1] = '0' + dateParts[1]
                }

                const dataPartsFormat = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`

                // console.log("dataPartsFormat ", dataPartsFormat);
                const dateTime = new Date(dataPartsFormat + 'T' + meetingTimeBeforeSameAfter);
                // console.log("dateTime ", dateTime);
                // console.log(dateTime);

                // one day before same time will be the meeting timinigs
                dateTime.setDate(dateTime.getDate() - 1);
                // console.log("type " + typeof(dateTime.toISOString()));
                // console.log("value " + dateTime.toLocalString());
                // console.log("value " + dateTime);

                const options = { timeZone: 'Asia/Kolkata', hour12: false, weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                const meetingDateTime = dateTime.toLocaleString('en-IN', options);

                // console.log(meetingDateTime);
                // append the meetingDateTime to the 'meeting_dates_times' array
                meeting_dates_times.push(meetingDateTime)

            }

            // "day-same"
            if (meeting_preferance_day_type.indexOf("day-same") !== -1) {
                const meetingTimeBeforeSameAfter = req.body['before-same-after-time']
                // console.log(typeof(last_date));
                // console.log(meetingTimeBeforeSameAfter);
                // create a datetime obj from the last_date and the meeting time

                const dateParts = last_date.split("/");
                if (dateParts[0].length < 2) {
                    dateParts[0] = '0' + dateParts[0]
                }
                if (dateParts[1].length < 2) {
                    dateParts[1] = '0' + dateParts[1]
                }

                const dataPartsFormat = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`
                // console.log("dataPartsFormat ", dataPartsFormat);
                const dateTime = new Date(dataPartsFormat + 'T' + meetingTimeBeforeSameAfter);
                // console.log("dateTime ", dateTime);
                // console.log(dateTime);

                // same day is the meeting timinigs
                const options = { timeZone: 'Asia/Kolkata', hour12: false, weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                const meetingDateTime = dateTime.toLocaleString('en-IN', options);

                // console.log(meetingDateTime);
                // append the meetingDateTime to the 'meeting_dates_times' array
                meeting_dates_times.push(meetingDateTime)

            }

            // "day-after"
            if (meeting_preferance_day_type.indexOf("day-after") !== -1) {
                const meetingTimeBeforeSameAfter = req.body['before-same-after-time']
                // console.log(typeof(last_date));
                // console.log(meetingTimeBeforeSameAfter);
                // create a datetime obj from the last_date and the meeting time

                const dateParts = last_date.split("/");
                if (dateParts[0].length < 2) {
                    dateParts[0] = '0' + dateParts[0]
                }
                if (dateParts[1].length < 2) {
                    dateParts[1] = '0' + dateParts[1]
                }
                const dataPartsFormat = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`
                // console.log("dataPartsFormat ", dataPartsFormat);

                const dateTime = new Date(dataPartsFormat + 'T' + meetingTimeBeforeSameAfter);
                // console.log("dateTime ", dateTime);
                // console.log(dateTime);

                // one day after same time will be the meeting timinigs
                dateTime.setDate(dateTime.getDate() + 1);

                const options = { timeZone: 'Asia/Kolkata', hour12: false, weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                const meetingDateTime = dateTime.toLocaleString('en-IN', options);

                // console.log(meetingDateTime);
                // append the meetingDateTime to the 'meeting_dates_times' array
                meeting_dates_times.push(meetingDateTime)

            }

            // "day-custom"
            if (meeting_preferance_day_type.indexOf("day-custom") !== -1) {
                const customMeetingHowManyDays = req.body['custom-meeting-how-many-days']
                const customMeetingBeforeOrAfter = req.body['custom-meeting-before-after']
                const customMeetingTime = req.body['custom-meeting-time']

                // console.log(typeof(last_date));
                // console.log(meetingTimeBeforeSameAfter);
                // create a datetime obj from the last_date and the meeting time

                const dateParts = last_date.split("/");
                if (dateParts[0].length < 2) {
                    dateParts[0] = '0' + dateParts[0]
                }
                if (dateParts[1].length < 2) {
                    dateParts[1] = '0' + dateParts[1]
                }
                const dataPartsFormat = `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`

                // console.log("dataPartsFormat ", dataPartsFormat);
                const dateTime = new Date(dataPartsFormat + 'T' + customMeetingTime);
                // console.log("dateTime ", dateTime);
                // console.log(dateTime);

                // determine the meeting date by using the customMeetingHowManyDays and customMeetingBeforeOrAfter
                const howManyDays = parseInt(customMeetingHowManyDays)
                if (customMeetingBeforeOrAfter === 'after') {
                    dateTime.setDate(dateTime.getDate() + howManyDays);

                } else if (customMeetingBeforeOrAfter === 'before') {
                    dateTime.setDate(dateTime.getDate() - howManyDays);

                }

                const options = { timeZone: 'Asia/Kolkata', hour12: false, weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
                const meetingDateTime = dateTime.toLocaleString('en-IN', options);

                // console.log(meetingDateTime);
                // append the meetingDateTime to the 'meeting_dates_times' array
                meeting_dates_times.push(meetingDateTime)
            }

            // console.log(meeting_preferance_day_type);
            return meeting_dates_times
        }

        // check the recurrence patteren
        const recurrence = req.body['recurrence']

        let assigned_date_arr = []
        let last_date_arr = []

        // if recurrence === 'custom' or 'daily' or 'weekly' or 'monthly'
        if (recurrence === 'custom') {
            const custom_hidden_start_end_date = JSON.parse(req.body['custom-hidden-start-end-date'])

            // extract all the assigned dates and last dates
            for (i = 0; i < custom_hidden_start_end_date.length; i++) {
                let assigned_date = custom_hidden_start_end_date[i][0]
                let last_date = custom_hidden_start_end_date[i][1]

                assigned_date_arr.push(assigned_date)
                last_date_arr.push(last_date)
            }

            // console.log(assigned_date_arr);
            // console.log(last_date_arr);

        } else if (recurrence === 'daily') {
            const dailyStartDate = req.body['daily-start-date']
            const dailyEndDate = req.body['daily-end-date']
            const dailyCompletionDayAfter = req.body['daily-completion-day-after']
            const dailyCompletionDayAfterInt = parseInt(dailyCompletionDayAfter)

            // console.log(dailyStartDate);
            // console.log(dailyEndDate);

            const startDate = new Date(dailyStartDate);
            const endDate = new Date(dailyEndDate);

            for (let assigned_date = startDate; assigned_date <= endDate; assigned_date.setDate(assigned_date.getDate() + 1)) {
                // console.log(d);
                let last_date = new Date()
                last_date.setDate(assigned_date.getDate() + dailyCompletionDayAfterInt);

                const assigned_date_str = assigned_date.toISOString().slice(0, 10);
                const last_date_str = last_date.toISOString().slice(0, 10);

                assigned_date_arr.push(assigned_date_str)
                last_date_arr.push(last_date_str)
            }

            // console.log(assigned_date_arr);
            // console.log(last_date_arr);

        } else if (recurrence === 'weekly') {
            const weeklyStartDate = req.body['weekly-start-date']
            const weeklyEndDate = req.body['weekly-end-date']
            const weeklyCompletionDayAfter = req.body['weekly-completion-day-after']
            const weeklyRecurrence = req.body['weekly-recurrence']
            const weeklyCompletionDayAfterInt = parseInt(weeklyCompletionDayAfter)

            //console.log("Int " + weeklyCompletionDayAfterInt);
            // console.log(dailyStartDate);
            // console.log(dailyEndDate);
            // console.log(weeklyRecurrence);

            const startDate = new Date(weeklyStartDate);
            const endDate = new Date(weeklyEndDate);
            // console.log(weeklyStartDate, weeklyEndDate);

            // fix the "every-weekdays" and "every-weekends"
            let dayList = []
            if (weeklyRecurrence.includes("every-weekdays") || weeklyRecurrence.includes("every-weekends")) {
                if (weeklyRecurrence.includes("every-weekdays")) {
                    dayList = ["monday", "tuesday", "wednesday", "thursday", "friday"];
                }
                if (weeklyRecurrence.includes("every-weekends")) {
                    dayList.push("saturday");
                    dayList.push("sunday")
                }

            } else {
                dayList = weeklyRecurrence
            }

            for (let assigned_date = startDate; assigned_date <= endDate; assigned_date.setDate(assigned_date.getDate() + 1)) {

                const options = { weekday: 'long' };
                let dayName = assigned_date.toLocaleDateString('en-US', options);
                dayName = dayName.toLowerCase()

                if (dayList.includes(dayName)) {
                    let last_date = new Date()
                    last_date.setDate(assigned_date.getDate() + weeklyCompletionDayAfterInt);

                    const assigned_date_str = assigned_date.toISOString().slice(0, 10);
                    const last_date_str = last_date.toISOString().slice(0, 10);

                    assigned_date_arr.push(assigned_date_str)
                    last_date_arr.push(last_date_str)
                }
            }

        } else if (recurrence === 'monthly') {
            const monthlyStartDate = req.body['monthly-start-date']
            const monthlyEndDate = req.body['monthly-end-date']
            const monthlyCompletionDayAfter = req.body['monthly-completion-day-after']
            const monthlyRecurrence = req.body['monthly-recurrence']
            const monthlyCompletionDayAfterInt = parseInt(monthlyCompletionDayAfter)

            const startDate = new Date(monthlyStartDate);
            const endDate = new Date(monthlyEndDate);

            let dateList = []

            for (let i = 0; i < monthlyRecurrence.length; i++) {
                dateList.push(parseInt(monthlyRecurrence[i].split("-")[1]))
            }
            // console.log(dateList);
            for (let assigned_date = startDate; assigned_date <= endDate; assigned_date.setDate(assigned_date.getDate() + 1)) {
                let date = parseInt(assigned_date.toISOString().slice(8, 10));
                if (dateList.includes(date)) {
                    let last_date = new Date()
                    // console.log(assigned_date.getDate() + monthlyCompletionDayAfterInt);
                    last_date.setDate(assigned_date.getDate() + monthlyCompletionDayAfterInt);

                    const assigned_date_str = assigned_date.toLocaleDateString()
                    const last_date_str = last_date.toLocaleDateString()

                    assigned_date_arr.push(assigned_date_str)
                    last_date_arr.push(last_date_str)
                }
            }
            // console.log(assigned_date_arr);
            // console.log(last_date_arr);
        }

        // sql connectivity
        // create a connection to the database using mssql_config
        var poolConnection = await sql.connect(mssql_config);

        // check meeting needed or not
        const meeting_needed = req.body['meeting-needed'] === 'meeting_needed'

        // write the entries into the database
        let total_tasks = last_date_arr.length
        for (let i = 0; i < total_tasks; i++) {
            // if meeting needed
            // call meeting_needed_calculation function
            if (meeting_needed) {
                let meeting_dates_times = []
                meeting_dates_times = meeting_needed_calculation(last_date_arr[i])
                let meeting_dates_times_str = meeting_dates_times.join("-")
                // console.log(meeting_dates_times);

                // insert into the database
                // all data console.log()
                
                // console.log("sender_id " + sender_id);
                // console.log("employee_ids " + employee_ids);
                // console.log("task_name " + task_name);
                // console.log("task_details " + task_details);
                // console.log("severity " + severity);
                // console.log("CC " + cc);
                // console.log("cc_times " + cc_times);
                // console.log("bcc " + bcc);
                // console.log("bcc_times " + bcc_times);

                // console.log("recurrence " + recurrence);
                // console.log("assigned_date " + assigned_date_arr[i]);
                // console.log("last_date_arr " + last_date_arr[i]);
                // console.log("meeting_needed " + meeting_needed);
                // console.log("meeting_dates_times_str " + meeting_dates_times_str);
                // console.log("---------------------------------------------------------------");

                // sender_id varchar(50),
                // employee_ids varchar(2000),
                // task_name varchar(200),
                // task_details varchar(2000),
                // severity varchar(10),
                // cc varchar(2000),
                // time_after_cc varchar(10),
                // bcc varchar(2000),
                // time_after_bcc varchar(10),
                // recurrence_patteren varchar(20),
                // assigned_date varchar(50),
                // last_date varchar(50),
                // meeting_needed varchar(50),
                // meeting_date_times varchar(1000)

                // code
                var insert_data_query = "INSERT INTO [dbo].[raw_task_details] (sender_id, employee_ids, task_name, task_details, severity, cc, time_after_cc, bcc, time_after_bcc, recurrence_patteren, assigned_date, last_date, meeting_needed, meeting_date_times) VALUES (@sender_id, @employee_ids, @task_name, @task_details, @severity, @cc, @time_after_cc, @bcc, @time_after_bcc, @recurrence_patteren, @assigned_date, @last_date, @meeting_needed, @meeting_date_times)";
                var insert_request = poolConnection.request();
                insert_request.input('sender_id', sender_id);
                insert_request.input('employee_ids', employee_ids);
                insert_request.input('task_name', task_name);
                insert_request.input('task_details', task_details);
                insert_request.input('severity', severity);
                insert_request.input('cc', cc);
                insert_request.input('time_after_cc', cc_times);
                insert_request.input('bcc', bcc);
                insert_request.input('time_after_bcc', bcc_times);
                insert_request.input('recurrence_patteren', recurrence);
                insert_request.input('assigned_date', assigned_date_arr[i]);
                insert_request.input('last_date', last_date_arr[i]);
                insert_request.input('meeting_needed', meeting_needed);
                insert_request.input('meeting_date_times', meeting_dates_times_str);
                await insert_request.query(insert_data_query);

            } else {
                // insert into the database
                // code
                var insert_data_query = "INSERT INTO [dbo].[raw_task_details] (sender_id, employee_ids, task_name, task_details, severity, cc, time_after_cc, bcc, time_after_bcc, recurrence_patteren, assigned_date, last_date, meeting_needed) VALUES (@sender_id, @employee_ids, @task_name, @task_details, @severity, @cc, @time_after_cc, @bcc, @time_after_bcc, @recurrence_patteren, @assigned_date, @last_date, @meeting_needed)";
                var insert_request = poolConnection.request();
                insert_request.input('sender_id', sender_id);
                insert_request.input('employee_ids', employee_ids);
                insert_request.input('task_name', task_name);
                insert_request.input('task_details', task_details);
                insert_request.input('severity', severity);
                insert_request.input('cc', cc);
                insert_request.input('time_after_cc', cc_times);
                insert_request.input('bcc', bcc);
                insert_request.input('time_after_bcc', bcc_times);
                insert_request.input('recurrence_patteren', recurrence);
                insert_request.input('assigned_date', assigned_date_arr[i]);
                insert_request.input('last_date', last_date_arr[i]);
                insert_request.input('meeting_needed', meeting_needed);
                await insert_request.query(insert_data_query);
            }
        }
        res.send(`
            <script>
            alert("Task data successfully inserted!");
            setTimeout(function() {
                window.location.href = '/create-new-task';
            }, 1); // redirect after 1 milisecond
            </script>
        `);

    } catch (err) {
        console.log(err);
    }
})

router.get("/testejs", (req, res) => {
    res.render("test")
})

module.exports = router