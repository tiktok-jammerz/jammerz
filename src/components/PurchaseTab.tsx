import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Megaphone, ShoppingBag, Music, Zap, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PurchaseTabProps {
  balance: number;
  usdEquiv: number;
}

interface PurchaseOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  minAmount: number;
  expectedReturn: string;
  duration: string;
  featured?: boolean;
}

export const PurchaseTab = ({ balance, usdEquiv }: PurchaseTabProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [purchaseAmount, setPurchaseAmount] = useState("50");
  const { toast } = useToast();

  const purchaseOptions: PurchaseOption[] = [
    {
      id: "promote",
      title: "Promote Video",
      description: "Higher ranking and minimal views pushed to users",
      icon: <Megaphone className="w-5 h-5" />,
      minAmount: 20,
      expectedReturn: "2-5x views",
      duration: "7 days",
      featured: true
    },
    {
      id: "shop-ads",
      title: "TikTok Shop Ads",
      description: "Advertise your products to targeted audiences",
      icon: <ShoppingBag className="w-5 h-5" />,
      minAmount: 50,
      expectedReturn: "3-8x ROAS",
      duration: "14 days"
    },
    {
      id: "music",
      title: "Commercial Music",
      description: "License trending music for commercial use in your content",
      icon: <Music className="w-5 h-5" />,
      minAmount: 10,
      expectedReturn: "Higher engagement",
      duration: "Lifetime"
    }
  ];

  const handlePurchase = () => {
    const option = purchaseOptions.find(opt => opt.id === selectedOption);
    if (!option) return;

    toast({
      title: "Purchase successful",
      description: `${purchaseAmount} coins spent on ${option.title}`,
    });
  };

  const selectedPurchaseOption = purchaseOptions.find(opt => opt.id === selectedOption);

  return (
    <div className="space-y-6">
      {/* Balance Available for Purchase */}
      <Card className="bg-gradient-primary shadow-primary">
        <CardHeader>
          <CardTitle className="text-primary-foreground flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Purchase Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary-foreground mb-2">
            {balance.toLocaleString()} coins
          </div>
          <p className="text-primary-foreground/80">
            Available for purchases (${usdEquiv.toFixed(2)} value)
          </p>
        </CardContent>
      </Card>

      {/* Purchase Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Available Services</h3>
        
        <div className="grid gap-4 md:grid-cols-3">
          {purchaseOptions.map((option) => (
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

      {/* Purchase Configuration */}
      {selectedOption && selectedPurchaseOption && (
        <Card className="bg-gradient-card shadow-card animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedPurchaseOption.icon}
              Configure {selectedPurchaseOption.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="purchase-amount">Purchase Amount (coins)</Label>
              <Input
                id="purchase-amount"
                type="number"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                min={selectedPurchaseOption.minAmount}
                max={balance}
                step="1"
              />
              <p className="text-sm text-muted-foreground">
                Minimum: {selectedPurchaseOption.minAmount} coins • Available: {balance.toLocaleString()} coins
              </p>
            </div>

            {/* Purchase Summary */}
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <h4 className="font-medium">Purchase Summary</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Service</span>
                  <span className="font-medium">{selectedPurchaseOption.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount</span>
                  <span className="font-medium">{purchaseAmount} coins</span>
                </div>
                <div className="flex justify-between">
                  <span>Expected return</span>
                  <span className="font-medium text-success">{selectedPurchaseOption.expectedReturn}</span>
                </div>
                <div className="flex justify-between">
                  <span>Campaign duration</span>
                  <span className="font-medium">{selectedPurchaseOption.duration}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span>Remaining balance</span>
                <span className="font-bold">
                  {(balance - parseInt(purchaseAmount)).toLocaleString()} coins
                </span>
              </div>
            </div>

            {/* Special Benefits */}
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="font-medium text-primary">Service Benefits</span>
              </div>
              <ul className="text-sm text-primary/80 space-y-1">
                <li>• Instant activation</li>
                <li>• Detailed analytics and tracking</li>
                <li>• Direct integration with TikTok</li>
                <li>• Performance guarantees</li>
              </ul>
            </div>

            <Button 
              onClick={handlePurchase}
              className="w-full bg-gradient-primary shadow-primary"
              disabled={
                parseInt(purchaseAmount) < selectedPurchaseOption.minAmount || 
                parseInt(purchaseAmount) > balance
              }
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Purchase for {purchaseAmount} Coins
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};