// to automatically catch errors and pass them to Express error handling middleware.
export default (controllerFunction) => (req, res, next) => 
    Promise.resolve(controllerFunction(req, res, next)).catch(next);