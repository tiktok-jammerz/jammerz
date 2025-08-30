import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Shield, TrendingUp, Target, Clock, Network } from "lucide-react";
import { RewardFlowVisualization } from "./RewardFlowVisualization";

interface RewardBreakdownProps {
  persona: "top" | "niche" | "casual" | "malicious";
  grossRevenue: number;
  rewardPercentage: number;
  netCoins: number;
}

interface CalculationData {
  fraudGate: number;
  marketHealth: number;
  categoryWeight: number;
  base: number;
  contentQuality: number;
  interactionQuality: number;
  aiAdjusted: number;
  immediateEngagement: number;
  weeklyEngagement: number;
  temporal: number;
  scaler: number;
}

export const RewardBreakdown = ({ persona, grossRevenue, rewardPercentage, netCoins }: RewardBreakdownProps) => {
  const getCalculationData = (): CalculationData => {
    switch (persona) {
      case "top":
        return {
          fraudGate: 1,
          marketHealth: 1.10,
          categoryWeight: 1.20,
          base: 1.15,
          contentQuality: 0.9,
          interactionQuality: 0.9,
          aiAdjusted: 0.90,
          immediateEngagement: 0.95,
          weeklyEngagement: 0.90,
          temporal: 0.9575,
          scaler: 0.5833
        };
      case "niche":
        return {
          fraudGate: 1,
          marketHealth: 1.05,
          categoryWeight: 1.00,
          base: 1.025,
          contentQuality: 0.8,
          interactionQuality: 0.8,
          aiAdjusted: 0.80,
          immediateEngagement: 0.70,
          weeklyEngagement: 0.75,
          temporal: 0.8675,
          scaler: 0.5833
        };
      case "casual":
        return {
          fraudGate: 1,
          marketHealth: 1.00,
          categoryWeight: 0.90,
          base: 0.95,
          contentQuality: 0.3,
          interactionQuality: 0.3,
          aiAdjusted: 0.30,
          immediateEngagement: 0.40,
          weeklyEngagement: 0.50,
          temporal: 0.735,
          scaler: 0.5833
        };
      case "malicious":
        return {
          fraudGate: 0,
          marketHealth: 1.00,
          categoryWeight: 1.00,
          base: 1.00,
          contentQuality: 0.1,
          interactionQuality: 0.1,
          aiAdjusted: 0.10,
          immediateEngagement: 0.20,
          weeklyEngagement: 0.30,
          temporal: 0.65,
          scaler: 0.5833
        };
    }
  };

  const data = getCalculationData();
  const rawCalculation = data.scaler * data.base * data.aiAdjusted * data.temporal;
  const clampedResult = Math.max(0.10, Math.min(0.70, rawCalculation));

  return (
    <div className="space-y-6">
      {/* Reward Percentage Card */}
      <Card className="bg-gradient-card shadow-card">
        <CardContent className="p-6">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                <span className="text-lg font-medium">Your Reward Percentage</span>
              </div>
              <div className="text-4xl font-bold text-primary">{(rewardPercentage * 100).toFixed(1)}%</div>
              <div className="text-sm space-y-2 text-foreground">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Gross Revenue:</span>
                  <span className="font-medium">${grossRevenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Net Coins Earned:</span>
                  <span className="font-bold text-primary">{netCoins.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flow Visualization */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Reward Calculation Flow
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Interactive visualization of how each factor contributes to your final reward
          </p>
        </CardHeader>
        <CardContent>
          <RewardFlowVisualization persona={persona} />
        </CardContent>
      </Card>
    </div>
  );
};