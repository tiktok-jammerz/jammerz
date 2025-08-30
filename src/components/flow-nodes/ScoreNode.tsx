import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ScoreNodeData {
  label: string;
  value: number;
  max: number;
  description: string;
}

export const ScoreNode = memo(({ data }: { data: ScoreNodeData }) => {
  const percentage = (data.value / data.max) * 100;
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 50) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="min-w-[200px] bg-background border-2 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{data.label}</h3>
          <Badge variant="outline" className={getScoreColor()}>
            {data.value.toFixed(3)}/{data.max}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground">{data.description}</p>
        <div className="mt-2 w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${
              percentage >= 80 ? 'bg-success' : 
              percentage >= 50 ? 'bg-warning' : 'bg-destructive'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-center mt-1 font-medium">
          {percentage.toFixed(1)}%
        </p>
      </CardContent>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
    </Card>
  );
});