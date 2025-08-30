import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Megaphone, ShoppingBag, Music, Zap, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBalance } from "@/contexts/BalanceContext";

interface ReinvestOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  minAmount: number;
  expectedReturn: string;
  duration: string;
  featured?: boolean;
}

export const ReinvestTab = () => {
  const { availableCoins, investedCoins, reinvestCoins, getUSDEquivalent } = useBalance();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [investAmount, setInvestAmount] = useState("50");
  const { toast } = useToast();

  const reinvestOptions: ReinvestOption[] = [
    {
      id: "saveplus",
      title: "SavePlus",
      description: "Low-risk savings with guaranteed returns",
      icon: <Target className="w-5 h-5" />,
      minAmount: 50,
      expectedReturn: "2% daily",
      duration: "Flexible",
      featured: true
    },
    {
      id: "mari-invest",
      title: "Mari Invest",
      description: "Medium-risk investment portfolio for creators",
      icon: <TrendingUp className="w-5 h-5" />,
      minAmount: 100,
      expectedReturn: "3% daily",
      duration: "30 days min"
    }
  ];

  const handleReinvest = () => {
    const option = reinvestOptions.find(opt => opt.id === selectedOption);
    if (!option) return;

    const investAmountNum = parseInt(investAmount);
    const success = reinvestCoins(investAmountNum, `${option.title} investment`);
    
    if (success) {
      toast({
        title: "Investment Successful!",
        description: `${investAmountNum.toLocaleString()} coins invested in ${option.title}`,
      });
      setSelectedOption("");
      setInvestAmount("50");
    } else {
      toast({
        title: "Investment Failed",
        description: "Insufficient balance or invalid amount.",
        variant: "destructive",
      });
    }
  };

  const selectedReinvestOption = reinvestOptions.find(opt => opt.id === selectedOption);

  return (
    <div className="space-y-6">
      {/* Balance Available for Reinvestment */}
      <Card className="bg-gradient-primary shadow-primary">
        <CardHeader>
          <CardTitle className="text-primary-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Reinvest & Grow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary-foreground mb-2">
            {availableCoins.toLocaleString()} coins
          </div>
          <p className="text-primary-foreground/80">
            Available for reinvestment (${getUSDEquivalent(availableCoins).toFixed(2)} value)
          </p>
          <div className="mt-3 p-3 bg-white/10 rounded-lg">
            <div className="text-primary-foreground/80 text-sm">Currently Invested</div>
            <div className="text-primary-foreground font-bold">{investedCoins.toLocaleString()} coins</div>
          </div>
        </CardContent>
      </Card>

      {/* Reinvestment Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Investment Options</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          {reinvestOptions.map((option) => (
            <Card 
              key={option.id}
              className={`cursor-pointer transition-all hover:shadow-card ${
                selectedOption === option.id 
                  ? "ring-2 ring-primary bg-gradient-card" 
                  : "bg-gradient-card"
              } ${option.featured ? "border-primary shadow-primary" : ""}`}
              onClick={() => setSelectedOption(option.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <CardTitle className="text-base">{option.title}</CardTitle>
                  </div>
                  {option.featured && (
                    <Badge className="bg-primary text-primary-foreground">
                      <Zap className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Min. amount:</span>
                    <span className="font-medium">{option.minAmount} coins</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expected return:</span>
                    <span className="font-medium text-success">{option.expectedReturn}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{option.duration}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Investment Configuration */}
      {selectedOption && selectedReinvestOption && (
        <Card className="bg-gradient-card shadow-card animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedReinvestOption.icon}
              Configure {selectedReinvestOption.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="invest-amount">Investment Amount (coins)</Label>
              <Input
                id="invest-amount"
                type="number"
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
                min={selectedReinvestOption.minAmount}
                max={availableCoins}
                step="1"
              />
              <p className="text-sm text-muted-foreground">
                Minimum: {selectedReinvestOption.minAmount} coins • Available: {availableCoins.toLocaleString()} coins
              </p>
            </div>

            {/* Investment Summary */}
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <h4 className="font-medium">Investment Summary</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Service</span>
                  <span className="font-medium">{selectedReinvestOption.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount</span>
                  <span className="font-medium">{investAmount} coins</span>
                </div>
                <div className="flex justify-between">
                  <span>Expected return</span>
                  <span className="font-medium text-success">{selectedReinvestOption.expectedReturn}</span>
                </div>
                <div className="flex justify-between">
                  <span>Campaign duration</span>
                  <span className="font-medium">{selectedReinvestOption.duration}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span>Remaining balance</span>
                <span className="font-bold">
                  {(availableCoins - parseInt(investAmount)).toLocaleString()} coins
                </span>
              </div>
            </div>

            {/* Special Benefits */}
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="font-medium text-primary">Reinvestment Benefits</span>
              </div>
              <ul className="text-sm text-primary/80 space-y-1">
                <li>• No cash-out fees or delays</li>
                <li>• Higher conversion rates vs external ads</li>
                <li>• Detailed analytics and tracking</li>
                <li>• Direct integration with TikTok algorithm</li>
              </ul>
            </div>

            <Button 
              onClick={handleReinvest}
              className="w-full bg-gradient-primary shadow-primary"
              disabled={
                parseInt(investAmount) < selectedReinvestOption.minAmount || 
                parseInt(investAmount) > availableCoins
              }
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Invest {investAmount} Coins
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Why Reinvest */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Why Reinvest Your Coins?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-success/20 rounded-lg">
                <Zap className="w-4 h-4 text-success" />
              </div>
              <div>
                <h4 className="font-medium">No Fees</h4>
                <p className="text-sm text-muted-foreground">
                  Avoid withdrawal and bank transfer fees by keeping coins in the ecosystem
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Compound Growth</h4>
                <p className="text-sm text-muted-foreground">
                  Reinvested earnings generate more engagement and future income
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};