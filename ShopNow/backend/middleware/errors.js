import ErrorHandler from "../utils/errorHandler.js";

export default(err, req, res, next) => {
    let error = {
        statusCode: err.statusCode || 500,
        message: err.message || "Internal Server Error",
    }

    // handling invalid mongoose id error
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid ${err?.path}`
        error = new ErrorHandler(message, 404);
    }

    //handling validation error
    if(err.name === "ValidationError"){
        const message = Object.values(err.errors).map((value) => value.message)
        error = new ErrorHandler(message, 400);
    }

    //handling Invalid JWT token
    if(err.name === "JsonWebTokenError"){
        const message = "JSON Web Token not found. Invalid"
        error = new ErrorHandler(message, 400);
    }

    //handling Expired JWT token
    if(err.name === "TokenExpiredError"){
        const message = "JSON Web Token is expired. Invalid"
        error = new ErrorHandler(message, 400);
    }

    // error for development mode
    if(process.env.NODE_ENV === "DEVELOPMENT"){
        res.status(error.statusCode).json({
            message: error.message,
            error: err,
            stack: err?.stack
        })
    }

    //error in production mode
    if(process.env.NODE_ENV === "PRODUCTION"){
        res.status(error.statusCode).json({
            message: error.message,
        })
    }
   
}