const jwt = require("jsonwebtoken")

exports.homerouteMiddleware = (req, res, next) => {
    const token = req.signedCookies.token
    if (token === undefined) {
        next()
    } else {
        try {
            const email_id = jwt.verify(token, process.env.APPSETTING_MY_JWT_SECRET)
            // req.email_id = email_id
            // console.log("email id ", email_id);
            return res.redirect("/filter")
        } catch (err) {
            console.log(err);
            // res.clearCookie("token")
            next()
        }
    }
}