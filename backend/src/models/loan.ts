import mongoose, { Schema, Document } from "mongoose";

export interface ILoan extends Document {
  fullName: string;
  amount: number;
  tenure: number;
  purpose: string;
  status: "pending" | "verified" | "approved" | "rejected";
  employmentStatus: string;
  employmentAddress: string;
  applicantId: mongoose.Types.ObjectId; // reference to the User model
  createdAt: Date;
  updatedAt: Date;
}

const loanSchema = new Schema<ILoan>(
  {
    fullName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    tenure: {
      type: Number,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "approved", "rejected"],
      default: "pending",
    },
    employmentStatus: {
      type: String,
      required: true,
    },
    employmentAddress: {
      type: String,
      required: true,
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Loan = mongoose.model<ILoan>("Loan", loanSchema);

export default Loan;
