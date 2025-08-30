import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, AlertTriangle } from 'lucide-react';

interface ResultNodeData {
  label: string;
  value: number;
  max: number;
  formula: string;
  fraudBlocked?: boolean;
}

export const ResultNode = memo(({ data }: { data: ResultNodeData }) => {
  const percentage = (data.value / data.max) * 100;
  const displayPercentage = (data.value * 100).toFixed(1);

  return (
    <Card className={`min-w-[250px] border-4 shadow-xl ${
      data.fraudBlocked 
        ? 'bg-destructive/10 border-destructive' 
        : 'bg-primary/10 border-primary'
    }`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {data.fraudBlocked ? (
              <AlertTriangle className="w-5 h-5 text-destructive" />
            ) : (
              <Trophy className="w-5 h-5 text-primary" />
            )}
            <h3 className="text-sm font-bold">{data.label}</h3>
          </div>
          <Badge variant={data.fraudBlocked ? "destructive" : "default"} className="text-lg px-3 py-1">
            {displayPercentage}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground font-mono mb-3">
          {data.formula}
        </p>
        
        {!data.fraudBlocked && (
          <>
            <div className="w-full bg-muted rounded-full h-3 mb-2">
              <div 
                className="h-3 rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10% min</span>
              <span>{percentage.toFixed(1)}% of max</span>
              <span>70% max</span>
            </div>
          </>
        )}
        
        {data.fraudBlocked && (
          <div className="text-center py-2">
            <p className="text-xs text-destructive font-medium">
              Account flagged - earnings blocked
            </p>
          </div>
        )}
      </CardContent>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 bg-primary border-2 border-background"
      />
    </Card>
  );
});