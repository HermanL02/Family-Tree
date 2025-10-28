"use client";

import { useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import FamilyNode from "./FamilyNode";
import { IFamilyMember } from "@/types";

interface FamilyTreeProps {
  members: IFamilyMember[];
  onEditMember: (member: IFamilyMember) => void;
  onDeleteMember: (id: string) => void;
  onUpdateNodePosition: (id: string, position: { x: number; y: number }) => void;
  isEditor: boolean;
}

export default function FamilyTree({
  members,
  onEditMember,
  onDeleteMember,
  onUpdateNodePosition,
  isEditor,
}: FamilyTreeProps) {
  const nodeTypes = useMemo(
    () => ({
      familyNode: FamilyNode,
    }),
    []
  );

  // Convert members to nodes
  const initialNodes: Node[] = useMemo(() => {
    return members.map((member, index) => ({
      id: member._id?.toString() || "",
      type: "familyNode",
      position: member.nodePosition || {
        x: (index % 5) * 250,
        y: Math.floor(index / 5) * 200,
      },
      data: {
        member,
        onEdit: onEditMember,
        onDelete: onDeleteMember,
        isEditor,
      },
    }));
  }, [members, onEditMember, onDeleteMember, isEditor]);

  // Convert relationships to edges
  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];

    members.forEach((member) => {
      const memberId = member._id?.toString();

      // Parent to child edges
      if (member.fatherId) {
        edges.push({
          id: `${member.fatherId}-${memberId}-father`,
          source: member.fatherId.toString(),
          target: memberId || "",
          type: "smoothstep",
          animated: false,
          style: { stroke: "#704214", strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#704214" },
        });
      }

      if (member.motherId) {
        edges.push({
          id: `${member.motherId}-${memberId}-mother`,
          source: member.motherId.toString(),
          target: memberId || "",
          type: "smoothstep",
          animated: false,
          style: { stroke: "#704214", strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#704214" },
        });
      }

      // Spouse edges (only one direction to avoid duplicates)
      member.spouseIds?.forEach((spouseId) => {
        const spouseIdStr = spouseId.toString();
        if (memberId && memberId < spouseIdStr) {
          edges.push({
            id: `${memberId}-${spouseIdStr}-spouse`,
            source: memberId,
            target: spouseIdStr,
            type: "straight",
            animated: false,
            style: { stroke: "#8b7355", strokeWidth: 2, strokeDasharray: "5,5" },
            label: "Spouse",
          });
        }
      });
    });

    return edges;
  }, [members]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onUpdateNodePosition(node.id, node.position);
    },
    [onUpdateNodePosition]
  );

  return (
    <div className="w-full h-[calc(100vh-200px)] bg-vintage-paper rounded-lg border-4 border-vintage-border vintage-shadow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={isEditor ? onNodeDragStop : undefined}
        nodeTypes={nodeTypes}
        nodesDraggable={isEditor}
        nodesConnectable={false}
        fitView
        className="vintage-texture"
      >
        <Controls className="bg-vintage-light border-2 border-vintage-border rounded" />
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#8b7355"
        />
      </ReactFlow>
    </div>
  );
}
