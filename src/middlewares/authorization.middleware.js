import { AppError } from "../Utils/index.js";

export const authorizationMiddleware = (allowedRoles) => {
  return async (req, res, next) => {
    // Get the loggedIn user from the request authUser from auth middleware
    const user = req.authUser;
    // Check if the allowed roles array includes the user role
    if (!allowedRoles.includes(user.role)) {
      // TODO WE WANT TO ADD role field in the models (Investor ,Company , Organization)
      return next(new AppError("Authorization Error", 401));
    }
    next();
  };
};
