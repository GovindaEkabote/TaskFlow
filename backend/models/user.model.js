import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nmae is required"],
      trim: true,
      maxLength: [30, "Name can not be more than 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minLength: [8, "password can not be more than 8 characters"],
    },
    role: {
      type: String,
      required: [true, "Password is required"],
      enum: ["Employee", "Team Lead", "Admin"],
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    department: {
      type: String,
      trim: true,
      default: null,
    },
    experties: {
      type: [String],
      default: [],
    },
    maxEmployee: {
      type: Number,
      min: [1],
    },
    assignedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
  },
  { timestamps: true },
);


export const User = mongoose.model("User", userSchema)
