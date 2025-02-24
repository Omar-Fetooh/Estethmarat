import jwt from "jsonwebtoken";

import { AppError } from "../Utils/index.js";
import { Company, Investor, Organization } from "../../DB/models/index.js";

export const auth = () => {
  return async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
      return next(new AppError("Token is required", 404));
    }

    if (!token.startsWith(process.env.TOKEN_PREFIX)) {
      return next(new AppError("Invalid token", 400));
    }

    const originalToken = token.split(" ")[1];

    const data = jwt.verify(originalToken, process.env.LOGIN_SECRET);
    if (!data?.id) {
      return next(new AppError("Invalid Token Payload", 400));
    }

    // Try to find the user in parallel
    const authUser = await Promise.any([
      Company.findById(data.id),
      Investor.findById(data.id),
      Organization.findById(data.id),
    ]);

    req.authUser = authUser;

    next();
  };
};
