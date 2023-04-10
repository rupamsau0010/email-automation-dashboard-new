const jwt = require("jsonwebtoken")

exports.cookieJwtAuth = (req, res, next) => {
    const token = req.signedCookies.token
    try {
        const email_id = jwt.verify(token, process.env.APPSETTING_MY_JWT_SECRET)
        // req.email_id = email_id
        // console.log("email id ", email_id);
        next()
    } catch (err) {
        console.log(err);
        // res.clearCookie("token")
        return res.redirect("/")
    }
}