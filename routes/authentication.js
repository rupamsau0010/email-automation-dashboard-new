// Import the modules
const Express = require("express");
const router = Express.Router();
const sql = require("mssql")
const jwt = require("jsonwebtoken")

// Import user defined modules
const mssql_config = require("../configs/connectMSsql")
const transporter = require("../configs/nodemailer")
const { homerouteMiddleware } = require("../middlewares/homerouteMiddleware");

// home page get route
router.get("/", homerouteMiddleware, (req, res) => {
    res.render("entry");
});


// extra
// create "/check-otp-page" get route for loading the otp page
router.get("/check-otp-page", (req, res) => {
    // console.log("/check-otp-page");
    res.render("otp")
})


// Send OTP to the user for verification
router.post('/send-otp', async (req, res) => {
    try {
        // get the email ID from the request body
        const { email_id } = req.body;
        //console.log(email_id);

        // check if the email ID is from a valid domain
        const regex = /@gofirst\.onmicrosoft\.com$/;
        if (!regex.test(email_id)) {
            res.status(400).send('Invalid email domain');
            return;
        }

        // create a random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // set the OTP expiration time to 1 minute from now
        const expirationTime = new Date(Date.now() + 2 * 60 * 1000)
        var expiration_string = expirationTime.toISOString()

        // console.log(new Date() <= expirationTime);

        // create a connection to the database using mssql_config
        var poolConnection = await sql.connect(mssql_config);

        // check if the email is already present or not
        var get_data_query = "select * from [dbo].[auth] where email_id = @email_id"
        var result = await poolConnection.request().input('email_id', email_id).query(get_data_query);
        // console.log(result.recordset);

        // if already present:
        if (result.recordset.length > 0) {
            // console.log('in the if');
            // update the data in the table
            var update_data_query = "update [dbo].[auth] set otp = @otp, expiration = @expiration where email_id = @email_id";
            var update_request = poolConnection.request();
            update_request.input('otp', otp);
            update_request.input('email_id', email_id);
            update_request.input('expiration', expiration_string);
            await update_request.query(update_data_query);

        } else {
            // insert the OTP into the database
            // console.log("In the else");
            // console.log(email_id, otp, expiration_string);

            var insert_data_query = "INSERT INTO [dbo].[auth] (email_id, otp, expiration) VALUES (@email_id, @otp, @expiration)";
            var insert_request = poolConnection.request();
            insert_request.input('email_id', email_id);
            insert_request.input('otp', otp);
            insert_request.input('expiration', expiration_string);
            await insert_request.query(insert_data_query);

        }

        // close the connection
        await sql.close();

        // send an email with the OTP
        const mailOptions = {
            from: 'rupam.enabled.smtp.auth@gofirst.onmicrosoft.com',
            to: email_id,
            subject: 'Your OTP for Scheduled Task dashboard @cognizant.com',
            text: `Your OTP is ${otp}. This OTP is valid for 1 minute.`
        };
        await transporter.sendMail(mailOptions);

        // save the email id to cookie to access it on the "/check-otp" route
        res.cookie('email_id', email_id);
        // send a success response
        res.redirect("/check-otp-page")
        // res.render("otp")
    } catch (err) {
        console.error(err);
        // res.send(`
        //     <script>
        //     alert(${err});
        //     setTimeout(function() {
        //         window.location.href = '/';
        //     }, 1); // redirect after 1 milisecond
        //     </script>
        // `);
        res.send(err)
    }
});

// Check the otp is valid or not
router.post('/check-otp', async (req, res) => {
    try {
        // create a connection to the database using mssql_config
        var poolConnection = await sql.connect(mssql_config);

        // get the OTP from the request body
        const { otp } = req.body;
        
        // get the email id from cookie
        const email_id = req.cookies.email_id;
        // console.log(email_id);

        // check if the email is already present or not
        var get_data_query = "select * from [dbo].[auth] where email_id = @email_id"
        var result = await poolConnection.request().input('email_id', email_id).query(get_data_query);

        // check if any OTP was found for the given email ID
        if (result.recordset.length === 0) {
            res.status(404).send('Email ID not found');
            return;
        }

        const now = new Date();
        var validOtp = false

        // check if the otp is valid and the time is valid
        if (result.recordset[0]['otp'] == parseInt(otp) && now <= new Date(result.recordset[0]['expiration'])) {
            validOtp = true
        }

        // console.log(now <= new Date(result.recordset[0]['expiration']));
        // console.log(new Date(result.recordset[0]['expiration']))
        // console.log(now);

        if (validOtp) {
            // generate a unique token using jwt
            const payload = { email_id: 'user@example.com' };
            const secret = process.env.MY_JWT_SECRET
            const expiresIn = '24h'

            const token = jwt.sign(payload, secret, { expiresIn })

            // set a cookie with name 'auth_token', value 'authToken', and an expiration time of 24 hours
            res.cookie('token', token, {
                maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
                httpOnly: true,
                signed: true
            });
            
            // send a success response
            // res.render("filter")
            res.redirect("/filter")
        } else {
            // send an error response
            res.send(`
                <script>
                alert('Session Time out or Invalid OTP. Please Try again.');
                setTimeout(function() {
                    window.location.href = '/send-otp';
                }, 1); // redirect after 1 milisecond
                </script>
            `);
        }

        // close the connection
        await sql.close();

    } catch (err) {
        console.error(err);
        res.send(`
            <script>
            alert('Internal server error. Please try again!');
            setTimeout(function() {
                window.location.href = '/';
            }, 1); // redirect after 1 milisecond
            </script>
        `);
    }
});

module.exports = router