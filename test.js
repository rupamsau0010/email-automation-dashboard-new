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

// const session = require('express-session');

// const store = new session.MemoryStore();
// console.log('Max session size:', store.maxSize);


// function getNumberWithSuffix(number) {
//     if (number % 100 >= 11 && number % 100 <= 13) {
//         return number + "th";
//     } else {
//         switch (number % 10) {
//             case 1:
//                 return number + "st";
//             case 2:
//                 return number + "nd";
//             case 3:
//                 return number + "rd";
//             default:
//                 return number + "th";
//         }
//     }
// }

// function getNumberWithSuffix(number) {
//     if (number % 100 >= 11 && number % 100 <= 13) {
//         return number + "th";
//     } else {
//         switch (number % 10) {
//             case 1: return number + "st"; case 2:
//                 return number + "nd"; case 3: return number + "rd"; default: return number + "th";
//         }
//     }
// }

// console.log(getNumberWithSuffix(11));
// console.log(getNumberWithSuffix(12));
// console.log(getNumberWithSuffix(13));
// console.log(getNumberWithSuffix(14));


// function isCommaSeparatedString(str) {
//     const emailPattern = /^([a-zA-Z0-9._-]+@gofirst\.onmicrosoft\.com)(,[a-zA-Z0-9._-]+@gofirst\.onmicrosoft\.com)*$/;
//     return emailPattern.test(str);
// }


// console.log(isCommaSeparatedString("gsgg@gofirst.onmicrosoft.com,"));


// const startDateInput = document.getElementById("custom-start-date");
// const endDateInput = document.getElementById("custom-end-date");
// const addButton = document.getElementById("add-custom-date");
// const datesList = document.getElementById("custom-dates-list");
// const dates = [];

// addButton.addEventListener("click", function (event) {
//     event.preventDefault(); // prevent form submission

//     const startDate = startDateInput.value;
//     const endDate = endDateInput.value;

//     if (!startDate || !endDate) {
//         alert("Please enter the start and end date");
//         return;
//     }

//     dates.push([startDate, endDate]);
//     let output = '';
//     for (let i = 0; i < dates.length; i++) {
//         // console.log(typeof(dates[i][0]));
//         output += `${i + 1}. Trigger date: ${dates[i][0]} || Completed By: ${dates[i][1]}      <button class="btn delete-btn"><i class="fas fa-trash"></i></button><br/>`;
//         // output += dates[i][0] + ' - ' + dates[i][1] + '\n'
//     }

//     datesList.innerHTML = output;

//     // call the submit button enabled function
//     checkFormValidity()

//     // scroll to the bottom of the page
//     // Scroll to the button
//     // scroll to the new date element
//     const newDateElement = datesList.lastElementChild;
//     newDateElement.scrollIntoView({ behavior: "smooth" });

//     startDateInput.value = "";
//     endDateInput.value = "";
// });

// const addCustomMeetingButton = document.getElementById("add-custom-meeting-date-and-time");
// const customMeetingDatesList = document.getElementById("custom-meeting-date-and-time-list");
// const customMeetingDateInput = document.getElementById("custom-meeting-date");
// const customMeetingTimeInput = document.getElementById("custom-meeting-time");
// const customMeetingDates = [];

// addCustomMeetingButton.addEventListener("click", function (event) {
//     event.preventDefault(); // prevent form submission

//     const meetingDate = customMeetingDateInput.value;
//     const meetingTime = customMeetingTimeInput.value;

//     if (!meetingDate || !meetingTime) {
//         alert("Please enter the meeting date and time properly");
//         return;
//     }

//     customMeetingDates.push([meetingDate, meetingTime]);
//     let output = '';
//     for (let i = 0; i < customMeetingDates.length; i++) {
//         // console.log(typeof(dates[i][0]));
//         output += `${i + 1}. Meeting date: ${customMeetingDates[i][0]} || Meeting Time: ${customMeetingDates[i][1]} <br/>`;
//         // output += dates[i][0] + ' - ' + dates[i][1] + '\n'

//     }

//     customMeetingDatesList.innerHTML = output;

//     // scroll to the bottom of the page
//     // Scroll to the button
//     // scroll to the new date element
//     const newDateElement = customMeetingDatesList.lastElementChild;
//     newDateElement.scrollIntoView({ behavior: "smooth" });

//     customMeetingDateInput.value = "";
//     customMeetingTimeInput.value = "";
// });


// const startDateInput = document.getElementById("custom-start-date");
// const endDateInput = document.getElementById("custom-end-date");
// const addButton = document.getElementById("add-custom-date");
// const datesList = document.getElementById("custom-dates-list");
// let dates = [];

// addButton.addEventListener("click", function (event) {
//     event.preventDefault(); // prevent form submission

//     const startDate = startDateInput.value;
//     const endDate = endDateInput.value;

//     if (!startDate || !endDate) {
//         alert("Please enter the start and end date");
//         return;
//     }

//     dates.push([startDate, endDate]);

//     let output = '';
//     for (let i = 0; i < dates.length; i++) {
//         output += `${i + 1}. Trigger date: ${dates[i][0]} || Completed By: ${dates[i][1]} <button class="btn delete-btn"><i class="fas fa-trash"></i></button><br/>`;
//     }

//     datesList.innerHTML = output;

//     // call the submit button enabled function
//     checkFormValidity();

//     // scroll to the bottom of the page
//     const newDateElement = datesList.lastElementChild;
//     newDateElement.scrollIntoView({ behavior: "smooth" });

//     // clear inputs
//     startDateInput.value = "";
//     endDateInput.value = "";

//     // add event listener to each delete button
//     const deleteButtons = document.querySelectorAll('.delete-btn');
//     for (let i = 0; i < deleteButtons.length; i++) {
//         deleteButtons[i].addEventListener('click', function (event) {
//             event.preventDefault();
//             dates.splice(i, 1);
//             let output = '';
//             for (let j = 0; j < dates.length; j++) {
//                 output += `${j + 1}. Trigger date: ${dates[j][0]} || Completed By: ${dates[j][1]} <button class="btn delete-btn"><i class="fas fa-trash"></i></button><br/>`;
//             }
//             datesList.innerHTML = output;

//             // call the submit button enabled function
//             checkFormValidity();

//             // add event listener again after deleting an item
//             addDeleteListeners();
//         });
//     }
// });

// function addDeleteListeners() {
//     const deleteButtons = document.querySelectorAll('.delete-btn');
//     for (let i = 0; i < deleteButtons.length; i++) {
//         deleteButtons[i].addEventListener('click', function (event) {
//             event.preventDefault();
//             dates.splice(i, 1);
//             let output = '';
//             for (let j = 0; j < dates.length; j++) {
//                 output += `${j + 1}. Trigger date: ${dates[j][0]} || Completed By: ${dates[j][1]} <button class="btn delete-btn"><i class="fas fa-trash"></i></button><br/>`;
//             }
//             datesList.innerHTML = output;
//             // call the submit button enabled function
//             checkFormValidity();

//             // add event listener again after deleting an item
//             addDeleteListeners();
//         });
//     }
// }

// addDeleteListeners();



// const customMeetingDateInput = document.getElementById("custom-meeting-date");
// const customMeetingTimeInput = document.getElementById("custom-meeting-time");
// const addCustomMeetingButton = document.getElementById("add-custom-meeting-date-and-time");
// const customMeetingDatesList = document.getElementById("custom-meeting-date-and-time-list");
// const customMeetingDates = [];

// addCustomMeetingButton.addEventListener("click", function (event) {
//     event.preventDefault(); // prevent form submission

//     const meetingDate = customMeetingDateInput.value;
//     const meetingTime = customMeetingTimeInput.value;

//     if (!meetingDate || !meetingTime) {
//         alert("Please enter the meeting date and time properly");
//         return;
//     }

//     customMeetingDates.push([meetingDate, meetingTime]);
//     let output = '';
//     for (let i = 0; i < customMeetingDates.length; i++) {
//         // console.log(typeof(dates[i][0]));

//         output += `${i + 1}. Meeting date: ${customMeetingDates[i][0]} || Meeting Time: ${customMeetingDates[i][1]} <button class="btn meeting-delete-btn"><i class="fas fa-trash"></i></button><br/>`;

//         // output += dates[i][0] + ' - ' + dates[i][1] + '\n'
//     }

//     customMeetingDatesList.innerHTML = output;

//     // call the submit button enebled function
//     // <---- call here ---->

//     // scroll to the bottom of the page
//     const newDateElement = customMeetingDatesList.lastElementChild;
//     newDateElement.scrollIntoView({ behavior: "smooth" });

//     customMeetingDateInput.value = "";
//     customMeetingTimeInput.value = "";

//     const meetingDeleteButtons = document.querySelectorAll('.meeting-delete-btn');
//     for (let i = 0; i < meetingDeleteButtons.length; i++) {
//         meetingDeleteButtons[i].addEventListener('click', function (event) {
//             event.preventDefault();
//             customMeetingDates.splice(i, 1);
//             let output = '';
//             for (let j = 0; j < customMeetingDates.length; j++) {
//                 output += `${i + 1}. Meeting date: ${customMeetingDates[i][0]} || Meeting Time: ${customMeetingDates[i][1]} <button class="btn meeting-delete-btn"><i class="fas fa-trash"></i></button><br/>`;
//             }
//             customMeetingDatesList.innerHTML = output;

//             // call the submit button enabled function
//             // <---- call here ---->

//             // add event listener again after deleting an item
//             addMeetingDeleteListeners();
//         });
//     }
// });

// function addMeetingDeleteListeners() {
//     const meetingDeleteButtons = document.querySelectorAll('.meeting-delete-btn');
//     for (let i = 0; i < meetingDeleteButtons.length; i++) {
//         meetingDeleteButtons[i].addEventListener('click', function (event) {
//             event.preventDefault();
//             customMeetingDates.splice(i, 1);
//             let output = '';
//             for (let j = 0; j < customMeetingDates.length; j++) {
//                 output += `${i + 1}. Meeting date: ${customMeetingDates[i][0]} || Meeting Time: ${customMeetingDates[i][1]} <button class="btn meeting-delete-btn"><i class="fas fa-trash"></i></button><br/>`;
//             }
//             customMeetingDatesList.innerHTML = output;

//             // call the submit button enabled function
//             // checkFormValidity();

//             // add event listener again after deleting an item
//             addMeetingDeleteListeners();
//         });
//     }
// }

// addMeetingDeleteListeners()





// const addCustomMeetingButton = document.getElementById("add-custom-meeting-date-and-time");
// const customMeetingDatesList = document.getElementById("custom-meeting-date-and-time-list");
// const customMeetingDateInput = document.getElementById("custom-meeting-date");
// const customMeetingTimeInput = document.getElementById("custom-meeting-time");
// const clearCustomMeetingCheckbox = document.getElementById("clear-custom-meeting");
// let customMeetingDates = [];

// addCustomMeetingButton.addEventListener("click", function (event) {
//     event.preventDefault(); // prevent form submission

//     const meetingDate = customMeetingDateInput.value;
//     const meetingTime = customMeetingTimeInput.value;

//     if (!meetingDate || !meetingTime) {
//         alert("Please enter the meeting date and time properly");
//         return;
//     }

//     customMeetingDates.push([meetingDate, meetingTime]);
//     let output = '';
//     for (let i = 0; i < customMeetingDates.length; i++) {
//         output += `${i + 1}. Meeting date: ${customMeetingDates[i][0]} || Meeting Time: ${customMeetingDates[i][1]} <button class="btn meeting-delete-btn"><i class="fas fa-trash"></i></button><br/>`;
//     }

//     customMeetingDatesList.innerHTML = output;

//     // enable/disable the submit button
//     checkFormValidity();

//     // scroll to the bottom of the page
//     const newDateElement = customMeetingDatesList.lastElementChild;
//     newDateElement.scrollIntoView({ behavior: "smooth" });

//     customMeetingDateInput.value = "";
//     customMeetingTimeInput.value = "";

//     const meetingDeleteButtons = document.querySelectorAll('.meeting-delete-btn');
//     for (let i = 0; i < meetingDeleteButtons.length; i++) {
//         meetingDeleteButtons[i].addEventListener('click', function (event) {
//             event.preventDefault();
//             customMeetingDates.splice(i, 1);
//             let output = '';
//             for (let j = 0; j < customMeetingDates.length; j++) {
//                 output += `${j + 1}. Meeting date: ${customMeetingDates[j][0]} || Meeting Time: ${customMeetingDates[j][1]} <button class="btn meeting-delete-btn"><i class="fas fa-trash"></i></button><br/>`;
//             }
//             customMeetingDatesList.innerHTML = output;

//             // enable/disable the submit button
//             checkFormValidity();

//             // add event listener again after deleting an item
//             addMeetingDeleteListeners();
//         });
//     }
// });

// function addMeetingDeleteListeners() {
//     const meetingDeleteButtons = document.querySelectorAll('.meeting-delete-btn');
//     for (let i = 0; i < meetingDeleteButtons.length; i++) {
//         meetingDeleteButtons[i].addEventListener('click', function (event) {
//             event.preventDefault();
//             customMeetingDates.splice(i, 1);
//             let output = '';
//             for (let j = 0; j < customMeetingDates.length; j++) {
//                 output += `${j + 1}. Meeting date: ${customMeetingDates[j][0]} || Meeting Time: ${customMeetingDates[j][1]} <button class="btn meeting-delete-btn"><i class="fas fa-trash"></i></button><br/>`;
//             }
//             customMeetingDatesList.innerHTML = output;

//             // enable/disable the submit button
//             checkFormValidity();

//             // add event listener again after deleting an item
//             addMeetingDeleteListeners();
//         });
//     }
// }

// addMeetingDeleteListeners();


// let array1 = [['apple', 'banana'], ['cherry', 'date'], ['god', 'human']];
// let array2 = ['eggplant', 'fig'];

// // Combine the arrays
// let combinedArray = [array1[0].concat(array2), array1[1]];

// // Remove the last three elements from the first array
// // combinedArray[0].splice(-3);

// console.log(combinedArray);

// const date = "2023-05-27";
// const time = "21:00";
// const dateTime = new Date(date + 'T' + time);
// console.log(dateTime);

// dateTime.setDate(dateTime.getDate() - 1);
// const meetingDateTime = dateTime.toISOString();

// console.log(meetingDateTime);

// const startDateStr = '2023-05-12';
// const endDateStr = '2023-06-26';

// const startDate = new Date(startDateStr);
// const endDate = new Date(endDateStr);

// for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
//   console.log(d.toISOString().slice(0, 10));
// }

// const startDateStr = "2023-05-12";
// const endDateStr = "2023-05-26";
// const dayList = ["monday","tuesday","wednesday","thursday","friday"];

// const startDate = new Date(startDateStr);
// const endDate = new Date(endDateStr);

// const result = [];

// for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
//   console.log(date.getDay());  
//   const dayOfWeek = dayList[date.getDay()];
//   if (dayList.includes(dayOfWeek)) {
//     const dateStr = date.toISOString().substring(0, 10);
//     result.push(dateStr);
//   }
// }

// console.log(result);

// const dateStr = '2023-05-28';
// const dateObj = new Date(dateStr + 'T' + '12:00');

// console.log(dateObj);

// const options = { weekday: 'long' };
// let dayName = dateObj.toLocaleDateString('en-US', options);
// dayName = dayName.toLowerCase()

// console.log(dayName); // Output: "Sunday"

const moment = require('moment-timezone');

const date = "2023-05-27";
const time = "21:00";

const options = { weekday: 'long' };
// let dayName = assigned_date.toLocaleDateString('en-US', options);

const dateTime = moment.tz(`${date} ${time}`, 'YYYY-MM-DD HH:mm', 'Asia/Kolkata');

console.log(dateTime.toLocaleDateString('en-US', options)); // output: 2023-05-27T21:00:00+05:30
