import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowDown, ArrowUp, Coins, DollarSign, Shield } from "lucide-react";
import { useBalance } from "@/contexts/BalanceContext";

interface BalanceOverviewProps {
  fraudScore: number;
  status: "verified" | "pending" | "flagged";
}

export const BalanceOverview = ({
  fraudScore,
  status
}: BalanceOverviewProps) => {
  const { totalCoins, availableCoins, getUSDEquivalent } = useBalance();
  
  const grossCoins = totalCoins;
  const netWithdrawable = availableCoins;
  const usdEquiv = getUSDEquivalent(availableCoins);
  
  const platformFee = grossCoins * 0.22;
  const smallCreatorPool = grossCoins * 0.05;
  const fraudAdjustment = grossCoins * (1 - fraudScore);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Gross Earnings */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Coins className="w-4 h-4" />
            Gross Earnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{grossCoins.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">coins this period</p>
        </CardContent>
      </Card>

      {/* Net Withdrawable */}
      <Card className="bg-gradient-success shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-success-foreground flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Withdrawable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success-foreground">
            ${usdEquiv.toFixed(2)}
          </div>
          <p className="text-xs text-success-foreground/80">
            {netWithdrawable.toLocaleString()} coins
          </p>
        </CardContent>
      </Card>

      {/* Platform Fees */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <ArrowDown className="w-4 h-4" />
            Platform Fees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            -{platformFee.toFixed(0)}
          </div>
          <p className="text-xs text-muted-foreground">22% platform fee</p>
        </CardContent>
      </Card>

      {/* Trust Score */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Trust Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(fraudScore * 100).toFixed(0)}%
          </div>
          <Progress 
            value={fraudScore * 100} 
            className="mt-2 h-2"
          />
        </CardContent>
      </Card>

    </div>
  );
};