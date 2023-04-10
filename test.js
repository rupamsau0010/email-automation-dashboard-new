// let arr1 = [1,2,3,4,5]
// let arr2 = [3,4,6,8,76,7]
// let newarr = []

// for( let i=0; i<arr2.length; i++) {
//     if (!arr1.includes(arr2[i])) {
//         newarr.push(arr2[i])
//     }
// }

// console.log(newarr);

// router.post("/update-task-completion-status", async (req, res) => {
//     // get email id from req.cookie
//     const email_id = req.cookies.email_id

//     // get the email body
//     var email_body = email_id.split("@")[0]

//     var ids = []
//     for (let key in req.body) {
//         // access each property of the response body using the key
//         if (req.body[key] === "checked") {
//             if (key.split("-")[1] === email_body) {
//                 ids.push(key)
//             }
//         }
//     }

//     // console.log(ids);
//     // create a id string from the ids
//     const idString = ids.map(id => `'${id}'`).join(',');
//     // console.log(idString);

//     // create a connection to the database using mssql_config
//     var poolConnection = await sql.connect(mssql_config);

//     // update the data on the table
//     var task_update_query = "update [dbo].[task_details] set completed = 'True' where task_id in (@idString)"
//     var update_request = poolConnection.request();
//     update_request.input('idString', sql.NVarChar, idString);
//     await update_request.query(task_update_query);

//     // now collect the data for rendering the page
//     var importance = req.cookies.importance
//     var completed = req.cookies.completed
//     var view = req.cookies.view

//     console.log(importance, completed);

//     // fetch the data from the table the data on the table
//     // self data
//     if (view === "self") {
//         if (importance === "0") {
//             console.log("in if", idString, completed);
//             var data_query = "select * from [dbo].[task_details] where employee_id = @email_id and completed = @completed order by last_date asc"
//             var data_request = poolConnection.request();
//             data_request.input('email_id', email_id);
//             data_request.input('completed', completed);
//             result = await data_request.query(data_query);
//         } else {
//             console.log("in else");
//             var data_query = "select * from [dbo].[task_details] where employee_id = @email_id and completed = @completed and severity = @severity order by last_date asc"
//             var data_request = poolConnection.request();
//             data_request.input('email_id', email_id);
//             data_request.input('completed', completed);
//             data_request.input('severity', parseInt(importance));
//             result = await data_request.query(data_query);
//         }
//     } else if (view === "given") {
//         if (importance === "0") {
//             console.log("in if", idString, completed);
//             var data_query = "select * from [dbo].[task_details] where sender_id = @email_id and completed = @completed order by last_date asc"
//             var data_request = poolConnection.request();
//             data_request.input('email_id', email_id);
//             data_request.input('completed', completed);
//             result = await data_request.query(data_query);
//         } else {
//             console.log("in else");
//             var data_query = "select * from [dbo].[task_details] where sender_id = @email_id and completed = @completed and severity = @severity order by last_date asc"
//             var data_request = poolConnection.request();
//             data_request.input('email_id', email_id);
//             data_request.input('completed', completed);
//             data_request.input('severity', parseInt(importance));
//             result = await data_request.query(data_query);
//         }
//     }
    
//     console.log(result.recordset);
//     console.log(result);
//     // create a new arr of json including the only necessary data with proper format
//     let data = []
//     for(var i=0; i<result.recordset.length; i++) {
//         let dist = {}

//         // add keys on the json
//         dist.task_id = result.recordset[i].task_id
//         dist.task_name = result.recordset[i].task_name
//         dist.task_details = result.recordset[i].task_details

//         // Craete a proper form of assigned date and last date
//         dist.assigned_date = getDateWithRequiredFormat(result.recordset[i].assigned_date)
//         dist.last_date = getDateWithRequiredFormat(result.recordset[i].last_date)

//         // append the json in the arr
//         data.push(dist)
//     }

//     // close the connection
//     await sql.close();

//     // render the data page
//     res.render("data", {data: data})
// })

const session = require('express-session');

const store = new session.MemoryStore();
console.log('Max session size:', store.maxSize);
