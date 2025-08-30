import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Calculator, DollarSign, Clock, TrendingDown, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BorrowTabProps {
  balance: number;
  usdEquiv: number;
}

interface ActiveLoan {
  id: string;
  amount: number;
  interestRate: number;
  remainingPayments: number;
  monthlyPayment: number;
  totalRemaining: number;
  startDate: string;
}

export const BorrowTab = ({ balance, usdEquiv }: BorrowTabProps) => {
  const [borrowAmount, setBorrowAmount] = useState("100");
  const { toast } = useToast();

  // Mock active loans
  const activeLoans: ActiveLoan[] = [
    {
      id: "loan_001",
      amount: 500,
      interestRate: 5,
      remainingPayments: 4,
      monthlyPayment: 105,
      totalRemaining: 420,
      startDate: "2024-01-15"
    },
    {
      id: "loan_002", 
      amount: 300,
      interestRate: 4.5,
      remainingPayments: 2,
      monthlyPayment: 156,
      totalRemaining: 312,
      startDate: "2024-02-20"
    }
  ];

  // Borrowing calculations
  const maxBorrow = Math.floor(balance * 0.3); // 30% of balance
  const baseRate = 4.0; // Base 4% monthly rate
  const amountInt = parseInt(borrowAmount) || 0;
  
  // Dynamic interest rate based on amount
  const getDynamicInterestRate = (amount: number) => {
    if (amount <= 100) return baseRate;
    if (amount <= 500) return baseRate + 0.5;
    if (amount <= 1000) return baseRate + 1.0;
    return baseRate + 1.5;
  };

  const interestRate = getDynamicInterestRate(amountInt);
  const borrowUsdValue = amountInt * 0.01; // $0.01 per coin
  const monthlyPayment = Math.ceil(amountInt * (1 + interestRate / 100) / 6);
  const totalRepayment = Math.ceil(amountInt * (1 + (interestRate / 100) * 6));

  const handleBorrow = () => {
    toast({
      title: "Loan approved",
      description: `${borrowAmount} coins borrowed against future earnings`,
    });
  };

  const totalActiveDebt = activeLoans.reduce((sum, loan) => sum + loan.totalRemaining, 0);
  const totalMonthlyPayments = activeLoans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);

  return (
    <div className="space-y-6">
      {/* Borrowing Capacity */}
      <Card className="bg-gradient-primary shadow-primary">
        <CardHeader>
          <CardTitle className="text-primary-foreground flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Creator Advance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary-foreground mb-2">
            {maxBorrow.toLocaleString()} coins
          </div>
          <p className="text-primary-foreground/80">
            Available to borrow (30% of balance)
          </p>
        </CardContent>
      </Card>

      {/* Active Loans */}
      {activeLoans.length > 0 && (
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Active Loans
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {activeLoans.length} active loan{activeLoans.length > 1 ? 's' : ''} • {totalActiveDebt} coins total debt
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeLoans.map((loan) => (
              <div key={loan.id} className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Loan #{loan.id.slice(-3)}</span>
                  <span className="text-sm text-muted-foreground">
                    Started {new Date(loan.startDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="grid gap-2 sm:grid-cols-2 mb-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Original amount</div>
                    <div className="font-medium">{loan.amount} coins</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Interest rate</div>
                    <div className="font-medium">{loan.interestRate}% monthly</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Monthly payment</div>
                    <div className="font-medium">{loan.monthlyPayment} coins</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Remaining</div>
                    <div className="font-medium">{loan.totalRemaining} coins</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{6 - loan.remainingPayments}/6 payments</span>
                  </div>
                  <Progress value={((6 - loan.remainingPayments) / 6) * 100} className="h-2" />
                </div>
              </div>
            ))}

            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-warning" />
                <span className="font-medium text-warning-foreground">Total Monthly Obligations</span>
              </div>
              <div className="text-2xl font-bold text-warning-foreground">
                {totalMonthlyPayments} coins/month
              </div>
              <p className="text-sm text-warning-foreground/80">
                Automatically deducted from future earnings
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Loan Calculator */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Loan Calculator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Borrow against future earnings with dynamic interest rates
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Available to borrow</div>
              <div className="font-bold text-lg">
                {maxBorrow.toLocaleString()} coins
              </div>
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Dynamic rate</div>
              <div className="font-bold text-lg">{interestRate}% monthly</div>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Term length</div>
              <div className="font-bold text-lg">6 months</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="borrow-amount">Loan amount (coins)</Label>
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

          {/* Interest Rate Tiers */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-3">Interest Rate Tiers</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>≤ 100 coins</span>
                <span className="font-medium">4.0% monthly</span>
              </div>
              <div className="flex justify-between">
                <span>101 - 500 coins</span>
                <span className="font-medium">4.5% monthly</span>
              </div>
              <div className="flex justify-between">
                <span>501 - 1000 coins</span>
                <span className="font-medium">5.0% monthly</span>
              </div>
              <div className="flex justify-between">
                <span>&gt; 1000 coins</span>
                <span className="font-medium">5.5% monthly</span>
              </div>
            </div>
          </div>

          {amountInt >= 50 && (
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
                  <span>Interest rate</span>
                  <span className="font-medium">{interestRate}% monthly</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly payment</span>
                  <span className="font-medium">{monthlyPayment} coins</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold">
                <span>Total repayment (6 months)</span>
                <span>{totalRepayment} coins</span>
              </div>
            </div>
          )}

          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-medium text-primary">How It Works</span>
            </div>
            <ul className="text-sm text-primary/80 space-y-1">
              <li>• Instant approval for verified creators</li>
              <li>• Dynamic interest rates based on loan amount</li>
              <li>• Automatic deduction from future earnings</li>
              <li>• Early repayment options available</li>
            </ul>
          </div>

          <Button 
            onClick={handleBorrow}
            className="w-full bg-gradient-primary shadow-primary"
            disabled={amountInt > maxBorrow || amountInt < 50}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Borrow {borrowAmount} Coins
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};