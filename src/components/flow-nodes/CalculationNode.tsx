import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator } from 'lucide-react';

interface CalculationNodeData {
  label: string;
  value: number;
  max: number;
  formula: string;
}

export const CalculationNode = memo(({ data }: { data: CalculationNodeData }) => {
  const percentage = (data.value / data.max) * 100;

  return (
    <Card className="min-w-[220px] bg-secondary/30 border-2 border-secondary shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-secondary-foreground" />
            <h3 className="text-sm font-semibold">{data.label}</h3>
          </div>
          <Badge variant="secondary">
            {data.value.toFixed(3)}/{data.max}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground font-mono mb-2">
          {data.formula}
        </p>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-secondary transition-all"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-center mt-1 font-medium">
          {percentage.toFixed(1)}%
        </p>
      </CardContent>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-secondary border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-secondary border-2 border-background"
      />
    </Card>
  );
});