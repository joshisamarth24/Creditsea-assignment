import { Router, Request, Response, NextFunction } from "express";
import Loan from "../models/loan";
import authMiddleware from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";
import { IUser } from "../models/userModel";

// Extend Express Request type
interface AuthRequest extends Request {
  user: IUser;
}

// Create custom handler types that work with AuthRequest type
type AuthRequestHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

const router = Router();

// POST a new loan application (user)
router.post(
  "/loan",
  authMiddleware as any, // Type assertion for middleware
  ((async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const { fullName, amount,tenure, purpose, employmentStatus, employmentAddress } = authReq.body;
      const applicantId = authReq.user.id;

      const newLoan = new Loan({
        fullName,
        amount,
        tenure,
        purpose,
        employmentStatus,
        employmentAddress,
        applicantId,
      });

      await newLoan.save();
      res.status(201).json({ message: "Loan application submitted", loan: newLoan });
    } catch (error) {
      res.status(500).json({ message: "Error submitting loan application", error });
    }
  }) as any)
);

// PATCH to verify/reject loan (verifier)
router.patch(
  "/loan/verify/:id",
  authMiddleware as any,
  roleMiddleware(["verifier"]) as any,
  ((async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const { id } = authReq.params;
      const { status } = authReq.body;

      if (!["verified", "rejected","pending"].includes(status)) {
        res.status(400).json({ message: "Invalid status" });
        return;
      }

      const loan = await Loan.findById(id);
      if (!loan) {
        res.status(404).json({ message: "Loan not found" });
        return;
      }

      loan.status = status;
      await loan.save();

      res.status(200).json({ message: `Loan ${status}`, loan });
    } catch (error) {
      res.status(500).json({ message: "Error updating loan status", error });
    }
  }) as any)
);

// PATCH to approve/reject loan (admin)
router.patch(
  "/loan/approve/:id",
  authMiddleware as any,
  roleMiddleware(["admin"]) as any,
  ((async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const { id } = authReq.params;
      const { status } = authReq.body;

      if (!["approved", "rejected"].includes(status)) {
        res.status(400).json({ message: "Invalid status" });
        return;
      }

      const loan = await Loan.findById(id);
      if (!loan) {
        res.status(404).json({ message: "Loan not found" });
        return;
      }

      loan.status = status;
      await loan.save();

      res.status(200).json({ message: `Loan ${status}`, loan });
    } catch (error) {
      res.status(500).json({ message: "Error updating loan status", error });
    }
  }) as any)
);

router.get(
    "/loans",
    authMiddleware as any,
    roleMiddleware(["admin", "verifier"]) as any,
    ((async (req: Request, res: Response) => {
      try {
        const { status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        
        // Build query
        const query: any = {};
        if (status) {
          query.status = status;
        }
  
        // Calculate skip for pagination
        const skip = (Number(page) - 1) * Number(limit);
  
        // Build sort object
        const sort: any = {};
        sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;
  
        // Get total count for pagination
        const total = await Loan.countDocuments(query);
  
        // Execute query with pagination and sorting
        const loans = await Loan.find(query)
          .sort(sort)
          .skip(skip)
          .limit(Number(limit))
          .populate('applicantId', 'fullName email'); // Assuming you want to populate user details
  
        res.status(200).json({
          message: "Loans retrieved successfully",
          data: {
            loans,
            pagination: {
              total,
              page: Number(page),
              pages: Math.ceil(total / Number(limit)),
              limit: Number(limit)
            }
          }
        });
      } catch (error) {
        res.status(500).json({ message: "Error retrieving loans", error });
      }
    }) as any)
  );

  router.get('/userLoans/:id', authMiddleware as any, roleMiddleware(["user"]) as any, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const loans = await Loan.find({ applicantId: id });
        res.status(200).json({ message: "Loans retrieved successfully", loans });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving loans", error });
        }
    }
    );

export default router;