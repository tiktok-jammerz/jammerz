import React, { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ConnectionMode,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { CategoryNode } from './flow-nodes/CategoryNode';
import { ResultNode } from './flow-nodes/ResultNode';

const nodeTypes = {
  category: CategoryNode,
  result: ResultNode,
};

interface RewardFlowVisualizationProps {
  persona: "top" | "niche" | "casual" | "malicious";
}

export const RewardFlowVisualization = ({ persona }: RewardFlowVisualizationProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const handleNodeClick = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  // Calculate Y positions based on expanded nodes
  const calculateYPositions = () => {
    const baseY = 100;
    const nodeSpacing = 150;
    const expandedNodeHeight = 300;
    const normalNodeHeight = 120;
    
    let currentY = baseY;
    const positions: { [key: string]: number } = {};
    
    const nodeOrder = ['fraud-gate', 'base-layer', 'ai-adjusted', 'temporal'];
    
    nodeOrder.forEach((nodeId) => {
      positions[nodeId] = currentY;
      const isExpanded = expandedNodes.has(nodeId);
      currentY += isExpanded ? expandedNodeHeight : normalNodeHeight;
      currentY += nodeSpacing;
    });
    
    // Position final calc node in the middle
    const totalHeight = currentY - nodeSpacing;
    positions['final-calc'] = totalHeight / 2 - 50;
    
    return positions;
  };

  const getPersonaData = () => {
    switch (persona) {
      case "top":
        return {
          fraudGate: { value: 1, max: 1 },
          marketHealth: { value: 1.10, max: 1.2 },
          categoryWeight: { value: 1.20, max: 1.2 },
          base: { value: 1.15, max: 1.2 },
          contentQuality: { value: 0.9, max: 1.0 },
          interactionQuality: { value: 0.9, max: 1.0 },
          aiAdjusted: { value: 0.90, max: 1.0 },
          immediateEngagement: { value: 0.95, max: 1.0 },
          weeklyEngagement: { value: 0.90, max: 1.0 },
          temporal: { value: 0.9575, max: 1.0 },
          scaler: { value: 0.5833, max: 0.5833 },
          finalReward: { value: 0.666, max: 0.70 }
        };
      case "niche":
        return {
          fraudGate: { value: 1, max: 1 },
          marketHealth: { value: 1.05, max: 1.2 },
          categoryWeight: { value: 1.00, max: 1.2 },
          base: { value: 1.025, max: 1.2 },
          contentQuality: { value: 0.8, max: 1.0 },
          interactionQuality: { value: 0.8, max: 1.0 },
          aiAdjusted: { value: 0.80, max: 1.0 },
          immediateEngagement: { value: 0.70, max: 1.0 },
          weeklyEngagement: { value: 0.75, max: 1.0 },
          temporal: { value: 0.8675, max: 1.0 },
          scaler: { value: 0.5833, max: 0.5833 },
          finalReward: { value: 0.415, max: 0.70 }
        };
      case "casual":
        return {
          fraudGate: { value: 1, max: 1 },
          marketHealth: { value: 1.00, max: 1.2 },
          categoryWeight: { value: 0.90, max: 1.2 },
          base: { value: 0.95, max: 1.2 },
          contentQuality: { value: 0.3, max: 1.0 },
          interactionQuality: { value: 0.3, max: 1.0 },
          aiAdjusted: { value: 0.30, max: 1.0 },
          immediateEngagement: { value: 0.40, max: 1.0 },
          weeklyEngagement: { value: 0.50, max: 1.0 },
          temporal: { value: 0.735, max: 1.0 },
          scaler: { value: 0.5833, max: 0.5833 },
          finalReward: { value: 0.122, max: 0.70 }
        };
      case "malicious":
        return {
          fraudGate: { value: 0, max: 1 },
          marketHealth: { value: 1.00, max: 1.2 },
          categoryWeight: { value: 1.00, max: 1.2 },
          base: { value: 1.00, max: 1.2 },
          contentQuality: { value: 0.1, max: 1.0 },
          interactionQuality: { value: 0.1, max: 1.0 },
          aiAdjusted: { value: 0.10, max: 1.0 },
          immediateEngagement: { value: 0.20, max: 1.0 },
          weeklyEngagement: { value: 0.30, max: 1.0 },
          temporal: { value: 0.65, max: 1.0 },
          scaler: { value: 0.5833, max: 0.5833 },
          finalReward: { value: 0.00, max: 0.70 }
        };
    }
  };

  const data = getPersonaData();

  const createCategoryNodes = () => {
    const yPositions = calculateYPositions();
    
    const baseNodes: Node[] = [
      {
        id: 'fraud-gate',
        type: 'category',
        position: { x: 50, y: yPositions['fraud-gate'] },
        data: { 
          label: 'Fraud Gate',
          value: data.fraudGate.value,
          max: data.fraudGate.max,
          description: 'Account verification status',
          isExpanded: expandedNodes.has('fraud-gate'),
          onClick: () => handleNodeClick('fraud-gate'),
          components: [
            {
              name: 'Gate Status',
              value: data.fraudGate.value,
              max: data.fraudGate.max,
              description: 'Proven fraud detection (0 = blocked, 1 = clean)'
            }
          ]
        },
      },
      {
        id: 'base-layer',
        type: 'category',
        position: { x: 50, y: yPositions['base-layer'] },
        data: { 
          label: 'Base Layer',
          value: data.base.value,
          max: data.base.max,
          description: '0.5 × Market + 0.5 × Category',
          isExpanded: expandedNodes.has('base-layer'),
          onClick: () => handleNodeClick('base-layer'),
          components: [
            {
              name: 'Market Health',
              value: data.marketHealth.value,
              max: data.marketHealth.max,
              description: 'Platform growth metrics (active users, retention)'
            },
            {
              name: 'Category Weight',
              value: data.categoryWeight.value,
              max: data.categoryWeight.max,
              description: 'Content category priority (community voting, underserved niches)'
            }
          ]
        },
      },
      {
        id: 'ai-adjusted',
        type: 'category',
        position: { x: 50, y: yPositions['ai-adjusted'] },
        data: { 
          label: 'AI-Adjusted',
          value: data.aiAdjusted.value,
          max: data.aiAdjusted.max,
          description: '0.5 × Content + 0.5 × Interaction',
          isExpanded: expandedNodes.has('ai-adjusted'),
          onClick: () => handleNodeClick('ai-adjusted'),
          components: [
            {
              name: 'Content Quality',
              value: data.contentQuality.value,
              max: data.contentQuality.max,
              description: 'ML-based scoring, moderation checks, originality'
            },
            {
              name: 'Interaction Quality',
              value: data.interactionQuality.value,
              max: data.interactionQuality.max,
              description: 'Meaningful engagement (dwell time, verified users, comment quality)'
            }
          ]
        },
      },
      {
        id: 'temporal',
        type: 'category',
        position: { x: 50, y: yPositions['temporal'] },
        data: { 
          label: 'Temporal',
          value: data.temporal.value,
          max: data.temporal.max,
          description: '0.5 + 0.5 × (0.3 × Immediate + 0.7 × Weekly)',
          isExpanded: expandedNodes.has('temporal'),
          onClick: () => handleNodeClick('temporal'),
          components: [
            {
              name: 'Immediate Engagement',
              value: data.immediateEngagement.value,
              max: data.immediateEngagement.max,
              description: "Today's performance (normalized against peer tier)"
            },
            {
              name: 'Weekly Engagement',
              value: data.weeklyEngagement.value,
              max: data.weeklyEngagement.max,
              description: '7-day moving average engagement (peer-normalized)'
            }
          ]
        },
      },
      {
        id: 'final-calc',
        type: 'result',
        position: { x: 500, y: yPositions['final-calc'] },
        data: { 
          label: 'Final Reward %', 
          value: data.finalReward.value, 
          max: data.finalReward.max,
          formula: data.fraudGate.value === 0 ? 'Gate = 0 → 0%' : 'clamp(Scaler × Base × AI × Temporal, 10%, 70%)',
          fraudBlocked: data.fraudGate.value === 0
        },
      },
    ];

    return baseNodes;
  };

  const initialNodes = createCategoryNodes();

  const initialEdges: Edge[] = [
    { id: 'e1', source: 'fraud-gate', target: 'final-calc', animated: true, style: { stroke: data.fraudGate.value === 0 ? '#ef4444' : '#10b981' } },
    { id: 'e2', source: 'base-layer', target: 'final-calc', animated: true },
    { id: 'e3', source: 'ai-adjusted', target: 'final-calc', animated: true },
    { id: 'e4', source: 'temporal', target: 'final-calc', animated: true },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(createCategoryNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when expandedNodes changes
  const updateNodes = useCallback(() => {
    setNodes(createCategoryNodes());
  }, [expandedNodes, persona]);

  // Update nodes when expanded state changes
  useEffect(() => {
    updateNodes();
  }, [updateNodes]);
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="h-[800px] bg-gradient-card rounded-lg border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        attributionPosition="bottom-left"
        className="rounded-lg"
      >
        <MiniMap 
          nodeColor={(node) => {
            if (node.type === 'result') return '#6366f1';
            if (node.type === 'calculation') return '#8b5cf6';
            return '#10b981';
          }}
          className="bg-background border border-border rounded"
        />
        <Controls className="bg-background border border-border rounded" />
        <Background gap={20} size={1} className="opacity-20" />
      </ReactFlow>
    </div>
  );
};