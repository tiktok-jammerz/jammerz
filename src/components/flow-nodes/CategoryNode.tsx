import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Component {
  name: string;
  value: number;
  max: number;
  description: string;
}

interface CategoryNodeData {
  label: string;
  value: number;
  max: number;
  description: string;
  isExpanded: boolean;
  onClick: () => void;
  components: Component[];
}

export const CategoryNode = memo(({ data }: { data: CategoryNodeData }) => {
  const percentage = (data.value / data.max) * 100;
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 50) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card 
      className={`min-w-[250px] bg-background border-2 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl animate-fade-in ${
        data.isExpanded ? 'min-h-[300px] z-10' : 'z-0'
      }`}
      onClick={data.onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {data.isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
            <h3 className="text-sm font-semibold">{data.label}</h3>
          </div>
          <Badge variant="outline" className={getScoreColor()}>
            {data.value.toFixed(3)}/{data.max}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground mb-2">{data.description}</p>
        <div className="w-full bg-muted rounded-full h-2 mb-2">
          <div 
            className={`h-2 rounded-full transition-all ${
              percentage >= 80 ? 'bg-success' : 
              percentage >= 50 ? 'bg-warning' : 'bg-destructive'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-center font-medium mb-2">
          {percentage.toFixed(1)}%
        </p>
        
        {data.isExpanded && (
          <div className="space-y-3 mt-4 pt-3 border-t border-border">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Components
            </h4>
            {data.components.map((component, index) => {
              const compPercentage = (component.value / component.max) * 100;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{component.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {component.value.toFixed(2)}/{component.max}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{component.description}</p>
                  <div className="w-full bg-muted rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full ${
                        compPercentage >= 80 ? 'bg-success' : 
                        compPercentage >= 50 ? 'bg-warning' : 'bg-destructive'
                      }`}
                      style={{ width: `${Math.min(compPercentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
      {data.label !== 'Fraud Gate' && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-primary border-2 border-background"
        />
      )}
    </Card>
  );
});