import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import FamilyMember from "@/models/FamilyMember";
import { getCurrentUserId, isAuthorizedEditor } from "@/lib/authorizationServer";

// GET - Fetch all family members (public - anyone can view)
export async function GET() {
  try {
    await dbConnect();

    // Fetch all members (shared tree - public access)
    const members = await FamilyMember.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ members }, { status: 200 });
  } catch (error) {
    console.error("Error fetching family members:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching family members" },
      { status: 500 }
    );
  }
}

// POST - Create a new family member (only authorized editors)
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if user is an authorized editor
    const isEditor = await isAuthorizedEditor();
    if (!isEditor) {
      return NextResponse.json(
        { message: "Forbidden: Only authorized editors can create family members" },
        { status: 403 }
      );
    }

    const data = await request.json();

    if (!data.name || !data.gender) {
      return NextResponse.json(
        { message: "Name and gender are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const member = await FamilyMember.create({
      userId: userId,
      name: data.name,
      gender: data.gender,
      birthDate: data.birthDate,
      deathDate: data.deathDate,
      description: data.description,
      photoUrl: data.photoUrl,
      fatherId: data.fatherId || null,
      motherId: data.motherId || null,
      spouseIds: data.spouseIds || [],
      childrenIds: data.childrenIds || [],
      nodePosition: data.nodePosition || { x: 0, y: 0 },
    });

    // Update relationships
    if (data.fatherId) {
      await FamilyMember.findByIdAndUpdate(data.fatherId, {
        $addToSet: { childrenIds: member._id },
      });
    }

    if (data.motherId) {
      await FamilyMember.findByIdAndUpdate(data.motherId, {
        $addToSet: { childrenIds: member._id },
      });
    }

    if (data.spouseIds && data.spouseIds.length > 0) {
      await FamilyMember.updateMany(
        { _id: { $in: data.spouseIds } },
        { $addToSet: { spouseIds: member._id } }
      );
    }

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error("Error creating family member:", error);
    return NextResponse.json(
      { message: "An error occurred while creating family member" },
      { status: 500 }
    );
  }
}
