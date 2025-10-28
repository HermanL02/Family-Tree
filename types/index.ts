import { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  createdAt?: Date;
}

export interface IFamilyMember {
  _id?: Types.ObjectId;
  userId: string; // Clerk user ID (string)
  name: string;
  gender: "male" | "female";
  birthDate?: Date;
  deathDate?: Date;
  description?: string;
  photoUrl?: string;

  // Relationships
  fatherId?: Types.ObjectId | null;
  motherId?: Types.ObjectId | null;
  spouseIds?: Types.ObjectId[];
  childrenIds?: Types.ObjectId[];

  // For React Flow positioning
  nodePosition?: {
    x: number;
    y: number;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

export interface FamilyMemberWithRelations extends IFamilyMember {
  father?: IFamilyMember;
  mother?: IFamilyMember;
  spouses?: IFamilyMember[];
  children?: IFamilyMember[];
}

export interface FamilyTreeNode {
  id: string;
  data: {
    member: IFamilyMember;
  };
  position: { x: number; y: number };
  type: string;
}

export interface FamilyTreeEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  animated?: boolean;
  label?: string;
}
