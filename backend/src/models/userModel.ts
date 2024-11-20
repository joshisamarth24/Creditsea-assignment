import mongoose, { Schema, Document } from "mongoose";

// Define the IUser interface to strongly type the user model
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "verifier" | "user";
}

//User schema
const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "verifier", "user"],
    default: "user"
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create and export the User model
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
