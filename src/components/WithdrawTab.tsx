import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle, Banknote, Calendar, Clock, Shield, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WithdrawTabProps {
  balance: number;
  usdEquiv: number;
  kycTier: "L0" | "L1" | "L2" | "L3";
  canWithdraw: boolean;
  status: "verified" | "pending" | "flagged";
}

export const WithdrawTab = ({
  balance,
  usdEquiv,
  kycTier,
  canWithdraw,
  status
}: WithdrawTabProps) => {
  const [withdrawMode, setWithdrawMode] = useState<"instant" | "monthly">("instant");
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState(usdEquiv.toString());
  const { toast } = useToast();

  const handleWithdraw = () => {
    if (!canWithdraw) {
      toast({
        title: "Withdrawal not available",
        description: "Check your balance and account status",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Withdrawal initiated",
      description: `$${amount} withdrawal request submitted`,
    });
  };

  const minWithdrawal = 20;
  const instantFee = parseFloat(amount) * 0.02; // 2% instant fee
  const monthlyBonus = parseFloat(amount) * 0.01; // 1% monthly bonus

  return (
    <div className="space-y-6">
      {/* Balance Overview */}
      <Card className="bg-gradient-success shadow-card">
        <CardHeader>
          <CardTitle className="text-success-foreground flex items-center gap-2">
            <Banknote className="w-5 h-5" />
            Available Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-success-foreground mb-2">
            ${usdEquiv.toFixed(2)}
          </div>
          <p className="text-success-foreground/80">
            {balance.toLocaleString()} coins available
          </p>
        </CardContent>
      </Card>

      {/* KYC Status */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>KYC Level</span>
            <Badge variant={kycTier === "L3" ? "default" : "secondary"}>
              {kycTier}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className={`flex items-center gap-2 ${kycTier >= "L1" ? "text-success" : "text-muted-foreground"}`}>
              <div className={`w-2 h-2 rounded-full ${kycTier >= "L1" ? "bg-success" : "bg-muted-foreground"}`} />
              <span className="text-sm">Basic verification</span>
            </div>
            <div className={`flex items-center gap-2 ${kycTier >= "L2" ? "text-success" : "text-muted-foreground"}`}>
              <div className={`w-2 h-2 rounded-full ${kycTier >= "L2" ? "bg-success" : "bg-muted-foreground"}`} />
              <span className="text-sm">Identity verification</span>
            </div>
            <div className={`flex items-center gap-2 ${kycTier >= "L3" ? "text-success" : "text-muted-foreground"}`}>
              <div className={`w-2 h-2 rounded-full ${kycTier >= "L3" ? "bg-success" : "bg-muted-foreground"}`} />
              <span className="text-sm">Enhanced verification</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Form */}
      {canWithdraw ? (
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle>Withdraw Funds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={minWithdrawal}
                max={usdEquiv}
                step="0.01"
              />
              <p className="text-sm text-muted-foreground">
                Minimum withdrawal: ${minWithdrawal}
              </p>
            </div>

            {/* Withdrawal Mode */}
            <div className="space-y-4">
              <Label>Withdrawal Method</Label>
              <RadioGroup value={withdrawMode} onValueChange={(value: "instant" | "monthly") => setWithdrawMode(value)}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="instant" id="instant" />
                    <Label htmlFor="instant" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          <span className="font-medium">Instant Withdrawal</span>
                        </div>
                        <Badge variant="outline">2% fee</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Receive funds immediately. Fee: ${instantFee.toFixed(2)}
                      </p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">Monthly Batch</span>
                        </div>
                        <Badge variant="default" className="bg-success">+1% bonus</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Next payout: 1st of next month. Bonus: ${monthlyBonus.toFixed(2)}
                      </p>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger>
                  <SelectValue placeholder="Select withdrawal destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank1">Chase Bank ****1234</SelectItem>
                  <SelectItem value="bank2">Wells Fargo ****5678</SelectItem>
                  <SelectItem value="paypal">PayPal (user@email.com)</SelectItem>
                  <SelectItem value="venmo">Venmo (@username)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Summary */}
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Amount</span>
                <span>${amount}</span>
              </div>
              {withdrawMode === "instant" && (
                <div className="flex justify-between text-destructive">
                  <span>Instant fee (2%)</span>
                  <span>-${instantFee.toFixed(2)}</span>
                </div>
              )}
              {withdrawMode === "monthly" && (
                <div className="flex justify-between text-success">
                  <span>Monthly bonus (1%)</span>
                  <span>+${monthlyBonus.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t pt-2">
                <span>You receive</span>
                <span>
                  ${withdrawMode === "instant" 
                    ? (parseFloat(amount) - instantFee).toFixed(2)
                    : (parseFloat(amount) + monthlyBonus).toFixed(2)
                  }
                </span>
              </div>
            </div>

            <Button 
              onClick={handleWithdraw}
              className="w-full bg-gradient-primary shadow-primary"
              disabled={!destination || parseFloat(amount) < minWithdrawal}
            >
              {withdrawMode === "instant" ? (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Withdraw Instantly
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Monthly Withdrawal
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Withdrawal Not Available</h3>
                <p className="text-sm mt-1">
                  {status === "flagged" 
                    ? "Your account is under review. Withdrawals are temporarily disabled."
                    : usdEquiv < minWithdrawal
                    ? `Minimum withdrawal amount is $${minWithdrawal}. Current balance: $${usdEquiv.toFixed(2)}`
                    : "Complete KYC verification to enable withdrawals."
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};