'use client'

import { motion } from 'framer-motion'
import type { GraphNode, GraphStep } from '@/engine/types'

interface GraphCanvasProps {
  frame: GraphStep
}

export function GraphCanvas({ frame }: GraphCanvasProps) {
  const nodeById = new Map(frame.nodes.map((node) => [node.id, node]))

  return (
    <div className="visualizer-canvas glass-panel dot-grid min-h-[360px] overflow-x-auto overflow-y-hidden rounded-lg p-4 sm:min-h-[520px] 2xl:min-h-[620px]">
      <svg className="h-[360px] min-w-[720px] sm:h-[520px] sm:min-w-0 sm:w-full" viewBox="0 0 760 400">
        <defs>
          <marker
            id="arrow"
            markerHeight="8"
            markerWidth="8"
            orient="auto"
            refX="6"
            refY="3"
          >
            <path d="M0,0 L0,6 L7,3 z" fill="#91A8B3" />
          </marker>
        </defs>

        {frame.edges.map((edge) => {
          const source = nodeById.get(edge.source)
          const target = nodeById.get(edge.target)
          if (!source || !target) return null

          const active =
            frame.activeNodeId === edge.source ||
            frame.activeNodeId === edge.target
          const midX = (source.x + target.x) / 2
          const midY = (source.y + target.y) / 2

          return (
            <g key={`${edge.source}-${edge.target}`}>
              <motion.line
                animate={{ stroke: active ? '#6366F1' : '#91A8B3' }}
                markerEnd="url(#arrow)"
                strokeWidth="3"
                x1={source.x}
                x2={target.x}
                y1={source.y}
                y2={target.y}
              />
              <circle cx={midX} cy={midY} fill="#F8FAFC" r="13" />
              <text
                className="select-none text-xs font-bold"
                dominantBaseline="middle"
                fill="#172033"
                textAnchor="middle"
                x={midX}
                y={midY}
              >
                {edge.weight}
              </text>
            </g>
          )
        })}

        {frame.nodes.map((node) => (
          <GraphNodeView frame={frame} key={node.id} node={node} />
        ))}
      </svg>
    </div>
  )
}

function GraphNodeView({ node, frame }: { node: GraphNode; frame: GraphStep }) {
  const state = getNodeState(node.id, frame)
  const distance = frame.distances[node.id]

  return (
    <motion.g animate={{ x: node.x, y: node.y }} initial={false}>
      <motion.circle
        animate={{ fill: state.fill, stroke: state.stroke }}
        r="28"
        strokeWidth="3"
      />
      <text
        className="select-none text-sm font-black"
        dominantBaseline="middle"
        fill={state.text}
        textAnchor="middle"
        y="-3"
      >
        {node.label}
      </text>
      {distance !== undefined && (
        <text
          className="select-none text-[10px] font-bold"
          dominantBaseline="middle"
          fill={state.text}
          textAnchor="middle"
          y="13"
        >
          {Number.isFinite(distance) ? distance : 'inf'}
        </text>
      )}
    </motion.g>
  )
}

function getNodeState(id: string, frame: GraphStep) {
  if (frame.activeNodeId === id) {
    return { fill: '#FFE7B8', stroke: '#F59E0B', text: '#172033' }
  }

  if (frame.settledNodeIds.includes(id)) {
    return { fill: '#14B8A6', stroke: '#0F766E', text: '#FFFFFF' }
  }

  if (frame.frontierNodeIds.includes(id)) {
    return { fill: '#E8F0FF', stroke: '#6366F1', text: '#172033' }
  }

  if (frame.visitedNodeIds.includes(id)) {
    return { fill: '#DDE7EE', stroke: '#91A8B3', text: '#52616B' }
  }

  return { fill: '#F8FAFC', stroke: '#CBD5E1', text: '#172033' }
}
