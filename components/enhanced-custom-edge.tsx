"use client"

import { useCallback } from "react"
import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath, useReactFlow } from "reactflow"

export default function EnhancedCustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
  markerEnd,
  animated = false,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const { setEdges } = useReactFlow()

  const onEdgeClick = useCallback(
    (evt: React.MouseEvent<SVGGElement, MouseEvent>, id: string) => {
      evt.stopPropagation()
      setEdges((edges) => edges.filter((edge) => edge.id !== id))
    },
    [setEdges],
  )

  return (
    <>
      {/* Main edge path */}
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          stroke: '#10b981',
          strokeWidth: 2,
          filter: animated ? 'drop-shadow(0 0 4px #10b981)' : 'none',
          ...style
        }} 
      />
      
      {/* Animated flow indicator */}
      {animated && (
        <g className="animate-pulse">
          <circle 
            r="3" 
            fill="#10b981"
            className="opacity-80"
          >
            <animateMotion 
              dur="2s" 
              repeatCount="indefinite"
              path={edgePath}
            />
          </circle>
        </g>
      )}
      
      {/* Flow direction arrows */}
      <defs>
        <marker
          id={`arrow-${id}`}
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path 
            d="M0,0 L0,6 L9,3 z" 
            fill="#10b981"
            className="opacity-80"
          />
        </marker>
      </defs>
      
      {/* Multiple direction indicators along the path */}
      <g>
        {[0.3, 0.7].map((position, index) => {
          const point = edgePath.split(' ').slice(1).join(' ')
          return (
            <circle
              key={index}
              r="2"
              fill="#10b981"
              className="opacity-60"
              style={{
                transformOrigin: 'center',
                animation: `flow-pulse 2s ease-in-out infinite ${index * 0.5}s`
              }}
            >
              <animateMotion
                dur="0.1s"
                begin={`${position * 2}s`}
                repeatCount="indefinite"
                path={edgePath}
              />
            </circle>
          )
        })}
      </g>

      <EdgeLabelRenderer>
        {data?.label && (
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: "#1e293b",
              padding: "4px 8px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 500,
              pointerEvents: "all",
              border: "1px solid #10b981",
              color: "#10b981",
              boxShadow: "0 0 8px rgba(16, 185, 129, 0.2)",
            }}
            className="nodrag nopan"
          >
            {data.label}
          </div>
        )}
        
        {/* Data type indicator */}
        {data?.type && (
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY + 20}px)`,
              background: "#10b981",
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 9,
              fontWeight: 600,
              pointerEvents: "none",
              color: "#000",
              opacity: 0.8,
            }}
            className="nodrag nopan"
          >
            {data.type}
          </div>
        )}
      </EdgeLabelRenderer>
      
      <style jsx>{`
        @keyframes flow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </>
  )
}