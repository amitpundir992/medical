import { asyncHandler } from "../utils/asyncHandler.js";

const adminMiddleware = asyncHandler(async(req, res, next)=>{

    try {
        console.log(req.user);
        const adminRole = req.user.isAdmin;
        if(!adminRole)
        return res
        .status(403)
        .json(
            {error: "Access denied .User is not an admin"}
        )
        else{
            next();
        }        
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Admin");

    }
})

export { adminMiddleware }