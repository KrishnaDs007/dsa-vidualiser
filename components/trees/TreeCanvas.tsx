'use client'

import { motion } from 'framer-motion'
import type { TreeNode, TreeStep } from '@/engine/types'

interface TreeCanvasProps {
  frame: TreeStep
}

export function TreeCanvas({ frame }: TreeCanvasProps) {
  const nodeById = new Map(frame.nodes.map((node) => [node.id, node]))
  const edges = frame.nodes
    .filter((node) => node.parentId)
    .map((node) => ({
      child: node,
      parent: nodeById.get(node.parentId ?? '')
    }))
    .filter((edge): edge is { child: TreeNode; parent: TreeNode } =>
      Boolean(edge.parent)
    )

  return (
    <div className="glass-panel dot-grid min-h-[520px] overflow-hidden rounded-lg p-4">
      <svg className="h-[520px] w-full" viewBox="0 0 820 420">
        {edges.map(({ child, parent }) => (
          <motion.line
            animate={{
              stroke: frame.visitedIds.includes(child.id) ? '#6366F1' : '#91A8B3'
            }}
            key={`${parent.id}-${child.id}`}
            strokeWidth="3"
            x1={parent.x}
            x2={child.x}
            y1={parent.y}
            y2={child.y}
          />
        ))}

        {frame.nodes.map((node) => {
          const state = getNodeState(node.id, frame)

          return (
            <motion.g
              animate={{
                x: node.x,
                y: node.y
              }}
              initial={false}
              key={node.id}
            >
              <motion.circle
                animate={{
                  fill: state.fill,
                  stroke: state.stroke
                }}
                r="24"
                strokeWidth="3"
              />
              <text
                className="select-none text-sm font-black"
                dominantBaseline="middle"
                fill={state.text}
                textAnchor="middle"
              >
                {node.value}
              </text>
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}

function getNodeState(id: string, frame: TreeStep) {
  if (frame.highlightedId === id) {
    return { fill: '#FFE7B8', stroke: '#F59E0B', text: '#172033' }
  }

  if (frame.visitedIds.includes(id)) {
    return { fill: '#14B8A6', stroke: '#0F766E', text: '#FFFFFF' }
  }

  return { fill: '#F8FAFC', stroke: '#CBD5E1', text: '#172033' }
}
