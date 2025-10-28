import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import FamilyMember from "@/models/FamilyMember";
import { getCurrentUserId, isAuthorizedEditor } from "@/lib/authorizationServer";

// PUT - Update a family member (only authorized editors)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if user is an authorized editor
    const isEditor = await isAuthorizedEditor();
    if (!isEditor) {
      return NextResponse.json(
        { message: "Forbidden: Only authorized editors can update family members" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const data = await request.json();
    await dbConnect();

    // Check if member exists (shared tree - no ownership check)
    const existingMember = await FamilyMember.findById(id);

    if (!existingMember) {
      return NextResponse.json({ message: "Family member not found" }, { status: 404 });
    }

    // Handle bidirectional spouse relationships
    const oldSpouseIds = (existingMember.spouseIds || []).map(id => id.toString());
    const newSpouseIds = data.spouseIds || [];

    // Find spouses to add (in new but not in old)
    const spousesToAdd = newSpouseIds.filter((id: string) => !oldSpouseIds.includes(id));

    // Find spouses to remove (in old but not in new)
    const spousesToRemove = oldSpouseIds.filter(id => !newSpouseIds.includes(id));

    // Add this member to new spouses
    if (spousesToAdd.length > 0) {
      await FamilyMember.updateMany(
        { _id: { $in: spousesToAdd } },
        { $addToSet: { spouseIds: id } }
      );
    }

    // Remove this member from old spouses
    if (spousesToRemove.length > 0) {
      await FamilyMember.updateMany(
        { _id: { $in: spousesToRemove } },
        { $pull: { spouseIds: id } }
      );
    }

    // Update the member
    const updatedMember = await FamilyMember.findByIdAndUpdate(
      id,
      {
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
        nodePosition: data.nodePosition,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ member: updatedMember }, { status: 200 });
  } catch (error) {
    console.error("Error updating family member:", error);
    return NextResponse.json(
      { message: "An error occurred while updating family member" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a family member (only authorized editors)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if user is an authorized editor
    const isEditor = await isAuthorizedEditor();
    if (!isEditor) {
      return NextResponse.json(
        { message: "Forbidden: Only authorized editors can delete family members" },
        { status: 403 }
      );
    }

    const { id } = await params;
    await dbConnect();

    // Check if member exists (shared tree - no ownership check)
    const member = await FamilyMember.findById(id);

    if (!member) {
      return NextResponse.json({ message: "Family member not found" }, { status: 404 });
    }

    // Remove references to this member from others
    await FamilyMember.updateMany(
      { fatherId: id },
      { $set: { fatherId: null } }
    );

    await FamilyMember.updateMany(
      { motherId: id },
      { $set: { motherId: null } }
    );

    await FamilyMember.updateMany(
      { spouseIds: id },
      { $pull: { spouseIds: id } }
    );

    await FamilyMember.updateMany(
      { childrenIds: id },
      { $pull: { childrenIds: id } }
    );

    // Delete the member
    await FamilyMember.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Family member deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting family member:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting family member" },
      { status: 500 }
    );
  }
}
