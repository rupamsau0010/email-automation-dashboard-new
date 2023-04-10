// Import the modules
const Express = require("express");
const router = Express.Router();
const sql = require("mssql")

// Import user defined modules
const mssql_config = require("../configs/connectMSsql")

// functions for getting proper format of date
function getDateWithRequiredFormat(dateStr) {
    var dateStr = dateStr;
    var date = new Date(dateStr);

    var day = date.getDate();
    var month = date.toLocaleString('default', { month: 'short' });
    var year = date.getFullYear();

    var formattedDate = `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
    return formattedDate
}

function getOrdinalSuffix(day) {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
}

// use <a></a> to highlight the links in the url
function highlightLinks(paragraph) {
    const urlRegex = /(?<!href=")(https?:\/\/[^\s]+)/g;
    return paragraph.replace(urlRegex, '<a href="$1" target="_blank" style="text-decoration:none">$1</a>');
}

// filter data get route
router.get("/filter", (req, res) => {
    res.render("filter")
})

// see the data in a table format based on conditions
router.get("/table-data", async (req, res) => {
    // console.log(req.session.data);
    // var data = JSON.parse(req.session.data)
    // console.log("data - ", data);

    // let storedData = localStorage.getItem('data');
    // let data = JSON.parse(storedData);
 
    // // get the data from req.query
    // let data = JSON.parse(req.query.data);

    // get the data from table
    // get email id from req.cookie
    const email_id = req.cookies.email_id
    const view = req.cookies.view

    // create a connection to the database using mssql_config
    var poolConnection = await sql.connect(mssql_config);

    // update the table data on the database
    var table_data_query = "select data from [dbo].[data_table] where user_id = @email_id and [view] = @view"
    var data_request = poolConnection.request();
    data_request.input('email_id', email_id);
    data_request.input('view', view);
    result = await data_request.query(table_data_query);

    // close the connection
    await sql.close();

    // console.log(result.recordset[0])
    var json_data = JSON.parse(result.recordset[0].data)
    // console.log(json_data);
    // console.log(json_data[0]);

    for (var i=0; i<json_data.length; i++) {
        task_details = json_data[i].task_details
        new_task_details = highlightLinks(task_details)
        json_data[i].task_details = new_task_details
    }
    res.render("data", {data: json_data})
})

// get the table data based on condition
// get my tasks
router.post("/get-my-tasks", async (req, res) => {
    // get data from the req.body
    const importance = req.body.importance;
    const job_status = req.body.flexRadioDefault

    // get email id from req.cookie
    const email_id = req.cookies.email_id

    // save the severity and completed to cookie
    res.cookie('importance', importance);
    res.cookie('job_status', job_status);
    res.cookie('view', 'self')

    // create completed variable
    var completed = false
    if (job_status === "completed") {
        completed = true
    }

    // create a connection to the database using mssql_config
    var poolConnection = await sql.connect(mssql_config);
    var result = []

    if (importance === "0") {
        if (job_status === "all") {
            var my_task_data_query = "select * from [dbo].[task_details] where employee_id = @email_id order by last_date asc"
            var data_request = poolConnection.request();
            data_request.input('email_id', email_id);
            result = await data_request.query(my_task_data_query);
        } else {
            var my_task_data_query = "select * from [dbo].[task_details] where employee_id = @email_id and completed = @completed order by last_date asc"
            var data_request = poolConnection.request();
            data_request.input('email_id', email_id);
            data_request.input('completed', completed);
            result = await data_request.query(my_task_data_query);
        }
    } else {
        if (job_status === "all") {
            var my_task_data_query = "select * from [dbo].[task_details] where severity = @severity and employee_id = @email_id order by last_date asc"
            var data_request = poolConnection.request();
            data_request.input('severity', parseInt(importance));
            data_request.input('email_id', email_id);
            result = await data_request.query(my_task_data_query);
        } else {
            var my_task_data_query = "select * from [dbo].[task_details] where severity = @severity and employee_id = @email_id and completed = @completed order by last_date asc"
            var data_request = poolConnection.request();
            data_request.input('severity', parseInt(importance));
            data_request.input('email_id', email_id);
            data_request.input('completed', completed);
            result = await data_request.query(my_task_data_query);
        }
    }
    // console.log(result.recordset);
    // console.log(result.recordset.length);
    // res.json(result.recordset)

    // create a new arr of all the task_id which will be stored on the cookie for being accessed on the /update-task-completion-status
    let task_id_arr = []

    // create a new arr of json including the only necessary data with proper format
    let data = []
    for(var i=0; i<result.recordset.length; i++) {
        let dist = {}

        // add keys on the json
        dist.task_id = result.recordset[i].task_id
        dist.task_name = result.recordset[i].task_name
        dist.task_details = result.recordset[i].task_details
        dist.completed = result.recordset[i].completed

        // set view = self for self data, view = given for given data
        dist.view = "self"

        // console.log(dist.completed);

        // Craete a proper form of assigned date and last date
        dist.assigned_date = getDateWithRequiredFormat(result.recordset[i].assigned_date)
        dist.last_date = getDateWithRequiredFormat(result.recordset[i].last_date)

        // append the json in the arr
        data.push(dist)

        // append the task_id on the task_id_arr
        task_id_arr.push(dist.task_id)
    }
    // console.log("data in the get my data route - ", data);
    // store the task_id_arr to cookie
    res.cookie('task_id_arr', JSON.stringify(task_id_arr))
    // res.cookie('data', JSON.stringify(data))

    // // close the connection
    // await sql.close();

    // // render the data page
    // res.render("data", {data: data})

    // redirect the page to lode the conditional table data by taking the data from the query
    // res.redirect("/table-data?data=" + JSON.stringify(data));

    // update the table data on the database -- insert into [dbo].[data_table] values (@email_id, @table_data_str)
    var table_data_query = `IF EXISTS (SELECT * FROM [dbo].[data_table] WHERE user_id = @email_id and [view] = 'self')
    BEGIN
        UPDATE [dbo].[data_table] SET data = @table_data_str WHERE user_id = @email_id and [view] = 'self'
    END
    ELSE
    BEGIN
        INSERT INTO [dbo].[data_table] (user_id, data, [view]) VALUES (@email_id, @table_data_str, 'self')
    END
    `
    var data_request = poolConnection.request();
    data_request.input('email_id', email_id);
    data_request.input('table_data_str', JSON.stringify(data));
    result = await data_request.query(table_data_query);

    // close the connection
    await sql.close();

    // redirect to the "/table-data"
    res.redirect("/table-data")
})

// get the tasks given by me
router.post("/get-given-tasks", async (req, res) => {
    // get data from the req.body
    const importance = req.body.importance;
    const job_status = req.body.flexRadioDefault
    
    // console.log(importance);
    // console.log(job_status);

    // get email id from req.cookie
    const email_id = req.cookies.email_id


    // save the severity and completed to cookie
    res.cookie('importance', importance);
    res.cookie('job_status', job_status);
    res.cookie('view', 'given')

    // create completed variable
    var completed = false
    if (job_status === "completed") {
        completed = true
    }

    // create a connection to the database using mssql_config
    var poolConnection = await sql.connect(mssql_config);
    var result = []

    if (importance === "0") {
        if (job_status === "all") {
            var my_task_data_query = "select * from [dbo].[task_details] where sender_id = @email_id order by last_date asc"
            var data_request = poolConnection.request();
            data_request.input('email_id', email_id);
            result = await data_request.query(my_task_data_query);
        } else {
            var my_task_data_query = "select * from [dbo].[task_details] where sender_id = @email_id and completed = @completed order by last_date asc"
            var data_request = poolConnection.request();
            data_request.input('email_id', email_id);
            data_request.input('completed', completed);
            result = await data_request.query(my_task_data_query);
        }
    } else {
        if (job_status === "all") {
            var my_task_data_query = "select * from [dbo].[task_details] where severity = @severity and sender_id = @email_id order by last_date asc"
            var data_request = poolConnection.request();
            data_request.input('severity', parseInt(importance));
            data_request.input('email_id', email_id);
            result = await data_request.query(my_task_data_query);
        } else {
            var my_task_data_query = "select * from [dbo].[task_details] where severity = @severity and sender_id = @email_id and completed = @completed order by last_date asc"
            var data_request = poolConnection.request();
            data_request.input('severity', parseInt(importance));
            data_request.input('email_id', email_id);
            data_request.input('completed', completed);
            result = await data_request.query(my_task_data_query);
        }
    }

    // console.log(result.recordset);
    // console.log(result.recordset.length);
    // res.json(result.recordset)

    // create a new arr of all the task_id which will be stored on the cookie for being accessed on the /update-task-completion-status
    let task_id_arr = []

    // create a new arr of json including the only necessary data with proper format
    let data = []
    for(var i=0; i<result.recordset.length; i++) {
        let dist = {}

        // add keys on the json
        dist.employee_id = result.recordset[i].employee_id
        dist.task_id = result.recordset[i].task_id
        dist.task_name = result.recordset[i].task_name
        dist.task_details = result.recordset[i].task_details
        dist.completed = result.recordset[i].completed

        // set view = self for self data, view = given for given data
        dist.view = "given"

        // console.log(typeof(dist.completed));

        // Craete a proper form of assigned date and last date
        dist.assigned_date = getDateWithRequiredFormat(result.recordset[i].assigned_date)
        dist.last_date = getDateWithRequiredFormat(result.recordset[i].last_date)

        // append the json in the arr
        data.push(dist)

        // append the task_id on the task_id_arr
        task_id_arr.push(dist.task_id)
    }
    // console.log("data in the given task route - ", data);
    // console.log("data in the given task route stringfy() - ", JSON.stringify(data));

    // store the task_id_arr to cookie
    res.cookie('task_id_arr', JSON.stringify(task_id_arr))
    // res.cookie('data', cookieValue)

    // // set on the localstorage
    // localStorage.setItem('data', JSON.stringify(data));

    // // use express-session
    // req.session.data = JSON.stringify(data)

    // // close the connection
    // await sql.close();

    // // render the data page
    // res.render("data", {data: data})
    // redirect the page to lode the conditional table data
    // res.redirect("/table-data?data=" + JSON.stringify(data));
    // res.redirect("/table-data")

    // update the table data on the database
    var table_data_query = `IF EXISTS (SELECT * FROM [dbo].[data_table] WHERE user_id = @email_id and [view] = 'given')
    BEGIN
        UPDATE [dbo].[data_table] SET data = @table_data_str WHERE user_id = @email_id and [view] = 'given'
    END
    ELSE
    BEGIN
        INSERT INTO [dbo].[data_table] (user_id, data, [view]) VALUES (@email_id, @table_data_str, 'given')
    END
    `
    var data_request = poolConnection.request();
    data_request.input('email_id', email_id);
    data_request.input('table_data_str', JSON.stringify(data));
    result = await data_request.query(table_data_query);

    // close the connection
    await sql.close();

    // redirect to the "/table-data"
    res.redirect("/table-data")
})

// update the task's completion states based on the information
router.post("/update-task-completion-status", async (req, res) => {
    // get the switch input data
    const switch_data = req.body
    // console.log(switch_data);

    // get email id, task_id_arr and view from req.cookie
    const email_id = req.cookies.email_id
    var task_id_arr = JSON.parse(req.cookies.task_id_arr)
    const view = req.cookies.view

    // now collect the data for rendering the page
    const importance = req.cookies.importance
    const job_status = req.cookies.job_status

    // create completed variable
    var completed = "False"
    if (job_status === "completed") {
        completed = "True"
    }

    // console.log(email_id, task_id_arr, view, importance, job_status, completed);

    // get the email body
    var email_body = email_id.split("@")[0]

    var ids = []
    for (let key in switch_data) {
        // access each property of the response body using the key
        if (switch_data[key] === "on") {
            // check the request of change is genuine or not
            if (view === "self" && key.split("-")[1] === email_body) {
                ids.push(key)
            } else if (view === "given" && key.split("-")[0] === email_body) {
                ids.push(key)
            }
        }
    }
    // console.log("ids => ", ids);

    // create a id string from the ids
    const idString = ids.map(id => `'${id}'`).join(',');
    // console.log(idString);

    // create arr for the task_ids which will be set as 'completed = False'
    var ids_false = []
    for (var i=0; i<task_id_arr.length; i++) {
        if (!ids.includes(task_id_arr[i])) {
            // check the request of change is genuine or not
            if (view === "self" && task_id_arr[i].split("-")[1] === email_body) {
                ids_false.push(task_id_arr[i])
            } else if (view === "given" && task_id_arr[i].split("-")[0] === email_body) {
                ids_false.push(task_id_arr[i])
            }
        }
    }
    // console.log("id_false => ", ids_false);

    const ids_false_string = ids_false.map(id => `'${id}'`).join(',');
    // console.log(ids_false_string);

    // console.log("len of the ids before await ", ids.length);
    // create a connection to the database using mssql_config
    var poolConnection = await sql.connect(mssql_config);
    // console.log("hello world");
    // if all the switch button is off
    // console.log("len of the ids ", ids.length);
    if (ids.length === 0 && ids_false.length === 0) {
        // the user trying to update the data is not nither given the task nor this task has been assigned to her/him
        // render the data page
        res.render("data", {data: []})
        return;

    } else if (ids.length === 0) {
        // update the data in the tabel
        // ids.length === 0 means only one condition could be there - update the 'completion' to false in some cases
        // console.log("ids.length === 0");
        var task_update_query2 = `UPDATE [dbo].[task_details] SET completed = 'False' WHERE task_id IN (${ids_false_string})`;
        var update_request2 = poolConnection.request();
        var done2 = await update_request2.query(task_update_query2);
        
    } else if (ids_false.length === 0) {
        // update the data on the table
        // console.log("ids.length !== 0");
        var task_update_query1 = `UPDATE [dbo].[task_details] SET completed = 'True' WHERE task_id IN (${idString})`;
        var update_request1 = poolConnection.request();
        var done1 = await update_request1.query(task_update_query1);

    } else {
        // update the data on the table
        // ids.length !== 0 and ids_false !== 0
        // console.log("ids.length !== 0");
        var task_update_query1 = `UPDATE [dbo].[task_details] SET completed = 'True' WHERE task_id IN (${idString})`;
        var task_update_query2 = `UPDATE [dbo].[task_details] SET completed = 'False' WHERE task_id IN (${ids_false_string})`;
        var update_request1 = poolConnection.request();
        var update_request2 = poolConnection.request();
        var done1 = await update_request1.query(task_update_query1);
        var done2 = await update_request2.query(task_update_query2);
    }

    // fetch the data from the table the data on the table
    // get data
    var result = []
    var task_id_arr_str = task_id_arr.map(id => `'${id}'`).join(',');
    var severity = parseInt(importance)

    if (importance === "0") {
        if (job_status === "all") {
            // console.log("0", "all");
            var my_task_data_query = `select * from [dbo].[task_details] where task_id in (${task_id_arr_str}) order by last_date asc`
            var data_request = poolConnection.request();
            result = await data_request.query(my_task_data_query);
        } else {
            // console.log("0", "not-all");
            var my_task_data_query = `select * from [dbo].[task_details] where task_id in (${task_id_arr_str}) and completed = '${completed}' order by last_date asc`
            var data_request = poolConnection.request();
            result = await data_request.query(my_task_data_query);
        }
    } else {
        if (job_status === "all") {
            // console.log("not-0", "all");
            var my_task_data_query = `select * from [dbo].[task_details] where task_id in (${task_id_arr_str}) and severity = ${severity} order by last_date asc`
            var data_request = poolConnection.request();
            result = await data_request.query(my_task_data_query);
        } else {
            // console.log("not-0", "not-all");
            var my_task_data_query = `select * from [dbo].[task_details] where task_id in (${task_id_arr_str}) and severity = ${severity} and completed = '${completed}' order by last_date asc`
            var data_request = poolConnection.request();
            result = await data_request.query(my_task_data_query);
        }
    }

    // create a new arr of json including the only necessary data with proper format
    let data = []
    task_id_arr = []
    if ( view === "self" ) {
        for(var i=0; i<result.recordset.length; i++) {
            let dist = {}
    
            // add keys on the json
            dist.task_id = result.recordset[i].task_id
            dist.task_name = result.recordset[i].task_name
            dist.task_details = result.recordset[i].task_details
            dist.completed = result.recordset[i].completed

            // set view = self for self data, view = given for given data
            dist.view = "self"
    
            // Craete a proper form of assigned date and last date
            dist.assigned_date = getDateWithRequiredFormat(result.recordset[i].assigned_date)
            dist.last_date = getDateWithRequiredFormat(result.recordset[i].last_date)
    
            // append the json in the arr
            data.push(dist)

            // append the task_id on the task_id_arr
            task_id_arr.push(dist.task_id)
        }
    } else {
        for(var i=0; i<result.recordset.length; i++) {
            let dist = {}
    
            // add keys on the json
            dist.task_id = result.recordset[i].task_id
            dist.task_name = result.recordset[i].task_name
            dist.employee_id = result.recordset[i].employee_id
            dist.task_details = result.recordset[i].task_details
            dist.completed = result.recordset[i].completed

            // set view = self for self data, view = given for given data
            dist.view = "given"
    
            // Craete a proper form of assigned date and last date
            dist.assigned_date = getDateWithRequiredFormat(result.recordset[i].assigned_date)
            dist.last_date = getDateWithRequiredFormat(result.recordset[i].last_date)
    
            // append the json in the arr
            data.push(dist)

            // append the task_id on the task_id_arr
            task_id_arr.push(dist.task_id)
        }
    }
    // console.log(data);

    // update the task_id_arr, data to cookie
    res.cookie('task_id_arr', JSON.stringify(task_id_arr))
    // res.cookie('data', JSON.stringify(data))

    // // close the connection
    // await sql.close();

    // // render the data page
    // res.render("data", {data: data})
    // redirect the page to lode the conditional table data
    // res.redirect("/table-data")
    // res.redirect("/table-data?data=" + JSON.stringify(data));

    // update the table data on the database
    var table_data_query = `IF EXISTS (SELECT * FROM [dbo].[data_table] WHERE user_id = @email_id and [view] = @view)
    BEGIN
        UPDATE [dbo].[data_table] SET data = @table_data_str WHERE user_id = @email_id and [view] = @view
    END
    ELSE
    BEGIN
        INSERT INTO [dbo].[data_table] (user_id, data, [view]) VALUES (@email_id, @table_data_str, @view)
    END
    `
    var data_request = poolConnection.request();
    data_request.input('email_id', email_id);
    data_request.input('table_data_str', JSON.stringify(data));
    data_request.input('view', view);
    result = await data_request.query(table_data_query);

    // close the connection
    await sql.close();

    // redirect to the "/table-data"
    res.redirect("/table-data")
})

module.exports = router