import mongoose, { Schema, Model } from "mongoose";
import { IFamilyMember } from "@/types";

const FamilyMemberSchema = new Schema<IFamilyMember>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, "Please specify gender"],
      enum: ["male", "female"],
    },
    birthDate: {
      type: Date,
    },
    deathDate: {
      type: Date,
    },
    description: {
      type: String,
      trim: true,
    },
    photoUrl: {
      type: String,
    },
    fatherId: {
      type: Schema.Types.ObjectId,
      ref: "FamilyMember",
      default: null,
    },
    motherId: {
      type: Schema.Types.ObjectId,
      ref: "FamilyMember",
      default: null,
    },
    spouseIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "FamilyMember",
      },
    ],
    childrenIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "FamilyMember",
      },
    ],
    nodePosition: {
      x: {
        type: Number,
        default: 0,
      },
      y: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

const FamilyMember: Model<IFamilyMember> =
  mongoose.models.FamilyMember || mongoose.model<IFamilyMember>("FamilyMember", FamilyMemberSchema);

export default FamilyMember;
