
export default (user, statusCode, res) => {

    //create jwt token
    const token = user.getJwtToken();

    //options for cookie
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
        httpOnly: true, // Cookie cannot be accessed by JavaScript
        secure: true, // Cookie is only sent over HTTPS
    }

    res.status(statusCode).cookie("token", token, options).json({
        token,
    })
};