"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { motion } from "framer-motion";
import { CldImage } from "next-cloudinary";
import { useTranslations } from "next-intl";
import { IFamilyMember } from "@/types";

interface FamilyNodeData {
  member: IFamilyMember;
  onEdit?: (member: IFamilyMember) => void;
  onDelete?: (id: string) => void;
  isEditor: boolean;
}

function FamilyNode({ data }: NodeProps<FamilyNodeData>) {
  const tCommon = useTranslations("common");
  const tModal = useTranslations("memberModal");
  const { member, onEdit, onDelete, isEditor } = data;

  const formatDate = (date?: Date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.getUTCFullYear();
  };

  const getGenderColor = (gender: string) => {
    return gender === "male" ? "bg-blue-100 border-blue-300" : "bg-pink-100 border-pink-300";
  };

  return (
    <>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-vintage-sepia" />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05, y: -2 }}
        transition={{ duration: 0.3 }}
        className={`px-4 py-3 rounded-lg border-2 vintage-shadow cursor-pointer
                   bg-vintage-light border-vintage-border min-w-[180px]
                   ${getGenderColor(member.gender)}`}
      >
        <div className="space-y-1">
          {member.photoUrl && (
            <div className="flex justify-center mb-2">
              <CldImage
                width="80"
                height="80"
                src={member.photoUrl}
                alt={member.name}
                crop="fill"
                gravity="face"
                className="rounded-full border-2 border-vintage-sepia object-cover"
              />
            </div>
          )}
          <h3 className="font-vintage font-bold text-vintage-sepia text-lg leading-tight">
            {member.name}
          </h3>

          <div className="text-xs text-vintage-dark">
            {formatDate(member.birthDate)} {member.deathDate ? `- ${formatDate(member.deathDate)}` : ""}
          </div>

          {member.description && (
            <p className="text-xs text-vintage-dark italic line-clamp-2 mt-1">
              {member.description}
            </p>
          )}

          {isEditor && (
            <div className="flex gap-2 mt-2 pt-2 border-t border-vintage-border">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(member);
                }}
                className="text-xs px-2 py-1 bg-vintage-sepia text-vintage-paper rounded
                         hover:bg-vintage-dark transition-colors"
              >
                {tCommon("edit")}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(tModal("deleteConfirm"))) {
                    onDelete?.(member._id?.toString() || "");
                  }
                }}
                className="text-xs px-2 py-1 bg-red-600 text-white rounded
                         hover:bg-red-700 transition-colors"
              >
                {tCommon("delete")}
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-vintage-sepia" />
    </>
  );
}

export default memo(FamilyNode);
