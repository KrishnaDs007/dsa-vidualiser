'use client'

import { motion } from 'framer-motion'
import type { GraphNode, GraphStep } from '@/engine/types'

interface GraphCanvasProps {
  frame: GraphStep
}

export function GraphCanvas({ frame }: GraphCanvasProps) {
  const nodeById = new Map(frame.nodes.map((node) => [node.id, node]))

  return (
    <div className="dot-grid min-h-[520px] overflow-hidden rounded-lg bg-[hsl(var(--surface))] p-4">
      <svg className="h-[520px] w-full" viewBox="0 0 760 400">
        <defs>
          <marker
            id="arrow"
            markerHeight="8"
            markerWidth="8"
            orient="auto"
            refX="6"
            refY="3"
          >
            <path d="M0,0 L0,6 L7,3 z" fill="#B4B2A9" />
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
                animate={{ stroke: active ? '#534AB7' : '#B4B2A9' }}
                markerEnd="url(#arrow)"
                strokeWidth="3"
                x1={source.x}
                x2={target.x}
                y1={source.y}
                y2={target.y}
              />
              <circle cx={midX} cy={midY} fill="#FFFFFF" r="13" />
              <text
                className="select-none text-xs font-bold"
                dominantBaseline="middle"
                fill="#1B1C18"
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
    return { fill: '#FAEEDA', stroke: '#BA7517', text: '#1B1C18' }
  }

  if (frame.settledNodeIds.includes(id)) {
    return { fill: '#1D9E75', stroke: '#1D9E75', text: '#FFFFFF' }
  }

  if (frame.frontierNodeIds.includes(id)) {
    return { fill: '#F8F7FF', stroke: '#534AB7', text: '#1B1C18' }
  }

  if (frame.visitedNodeIds.includes(id)) {
    return { fill: '#E8E4DD', stroke: '#6F6D67', text: '#1B1C18' }
  }

  return { fill: '#FFFFFF', stroke: '#B4B2A9', text: '#1B1C18' }
}
