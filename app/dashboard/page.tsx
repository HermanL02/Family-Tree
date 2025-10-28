"use client";

import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { IFamilyMember } from "@/types";
import { useIsAuthorizedEditor } from "@/lib/authorization";

// Dynamic import to avoid SSR issues with ReactFlow
const FamilyTree = dynamic(() => import("@/components/tree/FamilyTree"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-200px)] bg-vintage-paper rounded-lg border-4 border-vintage-border vintage-shadow flex items-center justify-center">
      <p className="text-vintage-dark">Loading family tree...</p>
    </div>
  ),
});

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const isEditor = useIsAuthorizedEditor();
  const [members, setMembers] = useState<IFamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<IFamilyMember | null>(null);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (isLoaded && user) {
      fetchMembers();
    }
  }, [isLoaded, user]);

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/family-members");
      const data = await response.json();
      setMembers(data.members || []);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    setEditingMember(null);
    setShowModal(true);
  };

  const handleEditMember = (member: IFamilyMember) => {
    setEditingMember(member);
    setShowModal(true);
  };

  const handleDeleteMember = async (id: string) => {
    try {
      const response = await fetch(`/api/family-members/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchMembers();
      }
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const handleUpdateNodePosition = async (id: string, position: { x: number; y: number }) => {
    try {
      const member = members.find((m) => m._id?.toString() === id);
      if (!member) return;

      await fetch(`/api/family-members/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...member,
          nodePosition: position,
        }),
      });
    } catch (error) {
      console.error("Error updating node position:", error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  if (!isLoaded || loading) {
    return (
      <main className="min-h-screen p-8 vintage-texture flex items-center justify-center">
        <p className="text-vintage-dark text-xl">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 vintage-texture">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-vintage text-vintage-sepia text-shadow-vintage">
              Family Tree
            </h1>
            <p className="text-vintage-dark mt-1">
              Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
              {!isEditor && <span className="text-sm ml-2">(View Only)</span>}
            </p>
          </div>
          <div className="flex gap-3">
            {isEditor && (
              <button
                onClick={handleAddMember}
                className="px-6 py-2 bg-vintage-sepia text-vintage-paper rounded
                         hover:bg-vintage-dark transition-colors border-2 border-vintage-dark vintage-shadow"
              >
                Add Family Member
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-vintage-border text-vintage-paper rounded
                       hover:bg-vintage-dark transition-colors border-2 border-vintage-dark"
            >
              Logout
            </button>
          </div>
        </div>

        {members.length === 0 ? (
          <div className="bg-vintage-light border-4 border-vintage-border rounded-lg p-12 text-center vintage-shadow">
            <h2 className="text-2xl font-vintage text-vintage-sepia mb-4">
              The family tree is empty
            </h2>
            <p className="text-vintage-dark mb-6">
              {isEditor
                ? "Start building the family legacy by adding the first family member"
                : "No family members have been added yet. Check back later!"}
            </p>
            {isEditor && (
              <button
                onClick={handleAddMember}
                className="px-8 py-3 bg-vintage-sepia text-vintage-paper rounded-lg
                         hover:bg-vintage-dark transition-colors border-2 border-vintage-dark vintage-shadow"
              >
                Add First Member
              </button>
            )}
          </div>
        ) : (
          <FamilyTree
            members={members}
            onEditMember={handleEditMember}
            onDeleteMember={handleDeleteMember}
            onUpdateNodePosition={handleUpdateNodePosition}
            isEditor={isEditor}
          />
        )}
      </div>

      {showModal && (
        <MemberModal
          member={editingMember}
          members={members}
          onClose={() => setShowModal(false)}
          onSave={fetchMembers}
        />
      )}
    </main>
  );
}

// Member Modal Component
function MemberModal({
  member,
  members,
  onClose,
  onSave,
}: {
  member: IFamilyMember | null;
  members: IFamilyMember[];
  onClose: () => void;
  onSave: () => void;
}) {
  const formatDateForInput = (date?: Date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    name: member?.name || "",
    gender: member?.gender || "male",
    birthDate: formatDateForInput(member?.birthDate),
    deathDate: formatDateForInput(member?.deathDate),
    description: member?.description || "",
    fatherId: member?.fatherId?.toString() || "",
    motherId: member?.motherId?.toString() || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = member
        ? `/api/family-members/${member._id}`
        : "/api/family-members";
      const method = member ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          birthDate: formData.birthDate || null,
          deathDate: formData.deathDate || null,
          fatherId: formData.fatherId || null,
          motherId: formData.motherId || null,
        }),
      });

      if (response.ok) {
        onSave();
        onClose();
      }
    } catch (error) {
      console.error("Error saving member:", error);
    } finally {
      setLoading(false);
    }
  };

  const maleMembers = members.filter((m) => m.gender === "male" && m._id?.toString() !== member?._id?.toString());
  const femaleMembers = members.filter((m) => m.gender === "female" && m._id?.toString() !== member?._id?.toString());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-vintage-light border-4 border-vintage-border rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto vintage-shadow">
        <h2 className="text-2xl font-vintage text-vintage-sepia mb-6">
          {member ? "Edit Family Member" : "Add Family Member"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-vintage-dark font-medium mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border-2 border-vintage-border rounded bg-vintage-paper
                         focus:outline-none focus:border-vintage-sepia"
              />
            </div>

            <div>
              <label className="block text-vintage-dark font-medium mb-2">Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as "male" | "female" })}
                className="w-full px-3 py-2 border-2 border-vintage-border rounded bg-vintage-paper
                         focus:outline-none focus:border-vintage-sepia"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-vintage-dark font-medium mb-2">Birth Date</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-3 py-2 border-2 border-vintage-border rounded bg-vintage-paper
                         focus:outline-none focus:border-vintage-sepia"
              />
            </div>

            <div>
              <label className="block text-vintage-dark font-medium mb-2">Death Date</label>
              <input
                type="date"
                value={formData.deathDate}
                onChange={(e) => setFormData({ ...formData, deathDate: e.target.value })}
                className="w-full px-3 py-2 border-2 border-vintage-border rounded bg-vintage-paper
                         focus:outline-none focus:border-vintage-sepia"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-vintage-dark font-medium mb-2">Father</label>
              <select
                value={formData.fatherId}
                onChange={(e) => setFormData({ ...formData, fatherId: e.target.value })}
                className="w-full px-3 py-2 border-2 border-vintage-border rounded bg-vintage-paper
                         focus:outline-none focus:border-vintage-sepia"
              >
                <option value="">None</option>
                {maleMembers.map((m) => (
                  <option key={m._id?.toString()} value={m._id?.toString()}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-vintage-dark font-medium mb-2">Mother</label>
              <select
                value={formData.motherId}
                onChange={(e) => setFormData({ ...formData, motherId: e.target.value })}
                className="w-full px-3 py-2 border-2 border-vintage-border rounded bg-vintage-paper
                         focus:outline-none focus:border-vintage-sepia"
              >
                <option value="">None</option>
                {femaleMembers.map((m) => (
                  <option key={m._id?.toString()} value={m._id?.toString()}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-vintage-dark font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border-2 border-vintage-border rounded bg-vintage-paper
                       focus:outline-none focus:border-vintage-sepia resize-none"
              placeholder="Add notes about this person..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-vintage-sepia text-vintage-paper py-2 rounded
                       hover:bg-vintage-dark transition-colors disabled:opacity-50
                       border-2 border-vintage-dark vintage-shadow"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-vintage-border text-vintage-paper py-2 rounded
                       hover:bg-vintage-dark transition-colors border-2 border-vintage-dark"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
