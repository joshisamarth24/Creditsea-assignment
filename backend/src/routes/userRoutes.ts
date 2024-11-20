import express from "express";
import { Router, Request, Response, NextFunction } from "express";
import authMiddleware from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";
import User from "../models/userModel";
import { IUser } from "../models/userModel";


interface AuthRequest extends Request {
  user: IUser;
}


const router = express.Router();

router.get(
    "/",
    authMiddleware as any,
    roleMiddleware(["admin"]) as any,
    ((async (req: Request, res: Response) => {
      try {
        const users = await User.find().select("-password");
        res.status(200).json({
          message: "Users retrieved successfully",
          data: {
            users
          }
        });
      } catch (error) {
        res.status(500).json({ message: "Error retrieving users", error });
      }
    }) as any)
  );


  router.patch('/update/:id',authMiddleware as any,roleMiddleware(["admin"]) as any,((async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const { id } = authReq.params;
      const { role } = authReq.body;
  
      const user = await User.findOne({_id:id});
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
  
      user.role = role || user.role;
  
      await user.save();
      res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Error updating user", error });
    }
  }) as any));  

  
export default router;
