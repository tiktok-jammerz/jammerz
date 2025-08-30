import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { PiggyBank, TrendingUp, Calculator, DollarSign, Clock, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SavingsTabProps {
  balance: number;
  usdEquiv: number;
}

export const SavingsTab = ({ balance, usdEquiv }: SavingsTabProps) => {
  const [savingsEnabled, setSavingsEnabled] = useState(false);
  const [savingsPercentage, setSavingsPercentage] = useState([10]);
  const [borrowAmount, setBorrowAmount] = useState("100");
  const [showBorrowCalculator, setShowBorrowCalculator] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  const currentSavings = 450; // coins in savings
  const savingsUsdValue = 4.5;
  const annualYield = 4.2; // 4.2% APY
  const monthlyYield = annualYield / 12;
  
  // Borrowing calculations
  const maxBorrow = Math.floor(balance * 0.3); // 30% of balance
  const monthlyRate = 0.05; // 5% monthly APR
  const borrowUsdValue = parseInt(borrowAmount) * 0.01; // $0.01 per coin

  const handleToggleSavings = () => {
    setSavingsEnabled(!savingsEnabled);
    toast({
      title: savingsEnabled ? "Auto-save disabled" : "Auto-save enabled",
      description: savingsEnabled 
        ? "Future earnings will not be automatically saved"
        : `${savingsPercentage[0]}% of future earnings will be automatically saved`,
    });
  };

  const handleBorrow = () => {
    toast({
      title: "Loan approved",
      description: `${borrowAmount} coins borrowed against future earnings`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Savings */}
      <Card className="bg-gradient-success shadow-card">
        <CardHeader>
          <CardTitle className="text-success-foreground flex items-center gap-2">
            <PiggyBank className="w-5 h-5" />
            Your Savings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-success-foreground mb-2">
            {currentSavings.toLocaleString()} coins
          </div>
          <p className="text-success-foreground/80 mb-4">
            ${savingsUsdValue.toFixed(2)} • {annualYield}% APY
          </p>
          
          <div className="bg-success-foreground/20 rounded-lg p-3">
            <div className="flex items-center justify-between text-success-foreground text-sm">
              <span>Monthly yield</span>
              <span className="font-medium">
                +${((savingsUsdValue * monthlyYield) / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Save Settings */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Auto-Save Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-save" className="text-base font-medium">
                Enable Auto-Save
              </Label>
              <p className="text-sm text-muted-foreground">
                Automatically save a percentage of future earnings
              </p>
            </div>
            <Switch
              id="auto-save"
              checked={savingsEnabled}
              onCheckedChange={handleToggleSavings}
            />
          </div>

          {savingsEnabled && (
            <div className="space-y-4 animate-slide-up">
              <div className="space-y-3">
                <Label>Auto-save percentage: {savingsPercentage[0]}%</Label>
                <Slider
                  value={savingsPercentage}
                  onValueChange={setSavingsPercentage}
                  max={50}
                  min={5}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>5%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Savings Projection</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>If you earn 1000 coins next month:</span>
                    <span className="font-medium">
                      {(1000 * savingsPercentage[0] / 100).toFixed(0)} coins saved
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly yield on savings:</span>
                    <span className="font-medium text-success">
                      +${((savingsUsdValue * monthlyYield) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Borrowing Section */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Creator Advance
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Borrow against future earnings
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Available to borrow</div>
              <div className="font-bold text-lg">
                {maxBorrow.toLocaleString()} coins
              </div>
              <div className="text-sm text-muted-foreground">
                30% of current balance
              </div>
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Interest rate</div>
              <div className="font-bold text-lg">5% monthly</div>
              <div className="text-sm text-muted-foreground">
                Competitive creator rates
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowBorrowCalculator(!showBorrowCalculator)}
            className="w-full"
          >
            {showBorrowCalculator ? "Hide" : "Show"} Borrow Calculator
          </Button>

          {showBorrowCalculator && (
            <div className="space-y-4 animate-slide-up">
              <div className="space-y-2">
                <Label htmlFor="borrow-amount">Borrow amount (coins)</Label>
                <Input
                  id="borrow-amount"
                  type="number"
                  value={borrowAmount}
                  onChange={(e) => setBorrowAmount(e.target.value)}
                  max={maxBorrow}
                  min="50"
                  step="10"
                />
                <p className="text-sm text-muted-foreground">
                  Max available: {maxBorrow.toLocaleString()} coins
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg space-y-3">
                <h4 className="font-medium">Loan Summary</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Loan amount</span>
                    <span className="font-medium">{borrowAmount} coins</span>
                  </div>
                  <div className="flex justify-between">
                    <span>USD value</span>
                    <span className="font-medium">${borrowUsdValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly interest</span>
                    <span className="font-medium">{monthlyRate * 100}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly payment</span>
                    <span className="font-medium">
                      {Math.ceil(parseInt(borrowAmount) * (1 + monthlyRate) / 6)} coins
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total repayment (6 months)</span>
                  <span>
                    {Math.ceil(parseInt(borrowAmount) * (1 + monthlyRate * 6))} coins
                  </span>
                </div>
              </div>

              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium text-primary">How It Works</span>
                </div>
                <ul className="text-sm text-primary/80 space-y-1">
                  <li>• Instant approval for verified creators</li>
                  <li>• Automatic deduction from future earnings</li>
                  <li>• No impact on current withdrawable balance</li>
                  <li>• Early repayment options available</li>
                </ul>
              </div>

              <Button 
                onClick={handleBorrow}
                className="w-full bg-gradient-primary shadow-primary"
                disabled={parseInt(borrowAmount) > maxBorrow || parseInt(borrowAmount) < 50}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Borrow {borrowAmount} Coins
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Financial Education */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Build Your Financial Future
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Savings Benefits</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Earn {annualYield}% annual yield</li>
                <li>• Compound interest on deposits</li>
                <li>• No maintenance fees</li>
                <li>• Instant liquidity when needed</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Creator Advance</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Invest in content before earning</li>
                <li>• Competitive rates for creators</li>
                <li>• Flexible repayment terms</li>
                <li>• Build credit history</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};