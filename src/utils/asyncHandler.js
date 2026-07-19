const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => {
            console.log(err.message);
            next(err); // An error occurred. Stop the normal request flow and jump to the error-handling middleware.
        });
    };
};

export { asyncHandler };

// const asyncHandler = (fn) => {
//     // an arrow function returning another arrow function
//     return () => {};
// };


// ------------------------ Same as above ------------------------
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         return res.status(error.code || 500).json({
//             status: false,
//             message: error.message
//         });
//     }
// };
