'use client'

import type { LinkedListNode, LinkedListStep } from '@/engine/types'

interface LinkedListCanvasProps {
  frame: LinkedListStep
}

export function LinkedListCanvas({ frame }: LinkedListCanvasProps) {
  const width = Math.max(720, frame.nodes.length * 132 + 120)
  const height = 430
  const nodeById = new Map(frame.nodes.map((node) => [node.id, node]))

  return (
    <div className="glass-panel dot-grid min-h-[420px] overflow-x-auto rounded-lg p-5">
      {frame.result && (
        <div className="mb-4 inline-flex rounded-md bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-900">
          result: {frame.result}
        </div>
      )}
      <svg className="min-w-full" height={height} viewBox={`0 0 ${width} ${height}`} width={width}>
        <defs>
          <marker
            id="linked-arrow"
            markerHeight="8"
            markerWidth="10"
            orient="auto"
            refX="9"
            refY="4"
          >
            <path d="M0,0 L10,4 L0,8 z" fill="#6366F1" />
          </marker>
        </defs>

        {frame.nodes.map((node) => {
          if (!node.nextId) return null

          const target = nodeById.get(node.nextId)
          if (!target) return null
          const direction = target.x > node.x ? 1 : -1

          return (
            <line
              key={`${node.id}-${node.nextId}`}
              markerEnd="url(#linked-arrow)"
              stroke="#6366F1"
              strokeWidth="3"
              x1={node.x + direction * 34}
              x2={target.x - direction * 44}
              y1={node.y}
              y2={target.y}
            />
          )
        })}

        {frame.nodes.map((node) => (
          <LinkedNode frame={frame} key={node.id} node={node} />
        ))}
      </svg>
    </div>
  )
}

function LinkedNode({
  node,
  frame
}: {
  node: LinkedListNode
  frame: LinkedListStep
}) {
  const state = getNodeState(node.id, frame)
  const badges = getBadges(node.id, frame)

  return (
    <g>
      <rect
        fill={state.fill}
        height="70"
        rx="10"
        stroke={state.stroke}
        strokeWidth="3"
        width="88"
        x={node.x - 44}
        y={node.y - 35}
      />
      <text
        className="select-none text-2xl font-black"
        dominantBaseline="middle"
        fill={state.text}
        textAnchor="middle"
        x={node.x}
        y={node.y}
      >
        {node.value}
      </text>
      {badges.map((badge, index) => (
        <g key={badge}>
          <rect
            fill="#E8F0FF"
            height="24"
            rx="6"
            stroke="#6366F1"
            width={badge.length * 8 + 18}
            x={node.x - (badge.length * 8 + 18) / 2}
            y={node.y + 52 + index * 30}
          />
          <text
            className="select-none text-xs font-bold"
            dominantBaseline="middle"
            fill="#172033"
            textAnchor="middle"
            x={node.x}
            y={node.y + 64 + index * 30}
          >
            {badge}
          </text>
        </g>
      ))}
    </g>
  )
}

function getNodeState(id: string, frame: LinkedListStep) {
  if (frame.currentId === id) {
    return { fill: '#FFE7B8', stroke: '#F59E0B', text: '#172033' }
  }

  if (frame.nextId === id) {
    return { fill: '#E8F0FF', stroke: '#6366F1', text: '#172033' }
  }

  if (frame.rewiredNodeIds.includes(id)) {
    return { fill: '#14B8A6', stroke: '#0F766E', text: '#FFFFFF' }
  }

  return { fill: '#F8FAFC', stroke: '#CBD5E1', text: '#172033' }
}

function getBadges(id: string, frame: LinkedListStep) {
  return [
    frame.headId === id ? 'head' : null,
    frame.prevId === id ? 'prev' : null,
    frame.currentId === id ? 'current' : null,
    frame.nextId === id ? 'next' : null
  ].filter(Boolean) as string[]
}
