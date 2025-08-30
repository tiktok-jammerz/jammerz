import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useBalance } from "@/contexts/BalanceContext";
import { BalanceOverview } from "./BalanceOverview";
import { PayoutBreakdown } from "./PayoutBreakdown";
import { WithdrawTab } from "./WithdrawTab";
import { ReinvestTab } from "./ReinvestTab";
import { PurchaseTab } from "./PurchaseTab";
import { BorrowTab } from "./BorrowTab";
import { AudienceTab } from "./AudienceTab";
import { EarningsChart } from "./EarningsChart";
import { Coins, TrendingUp, Shield, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { RewardBreakdown } from "./RewardBreakdown";

interface CreatorDashboardProps {
  persona: "top" | "niche" | "casual" | "malicious";
  onBackToHome?: () => void;
}

export const CreatorDashboard = ({ persona, onBackToHome }: CreatorDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { totalCoins, availableCoins, getUSDEquivalent } = useBalance();
  
  
  // Mock data based on persona using dynamic balance system
  const getPersonaData = () => {
    const grossCoins = totalCoins;
    const netWithdrawable = availableCoins;
    const usdEquiv = getUSDEquivalent(availableCoins);
    
    switch (persona) {
      case "top":
        return {
          grossRevenue: getUSDEquivalent(totalCoins) * 10, // Gross revenue in USD
          rewardPercentage: 0.666, // 66.6% from calculation
          grossCoins,
          netWithdrawable,
          usdEquiv,
          kycTier: "L3" as const,
          fraudScore: 0.95,
          status: "verified" as const,
          name: "TopCreator_Sarah",
          followers: "2.1M"
        };
      case "niche":
        return {
          grossRevenue: getUSDEquivalent(totalCoins) * 5,
          rewardPercentage: 0.415, // 41.5% from calculation
          grossCoins,
          netWithdrawable,
          usdEquiv,
          kycTier: "L2" as const,
          fraudScore: 0.92,
          status: "verified" as const,
          name: "BookTok_Maya",
          followers: "45.2K"
        };
      case "casual":
        return {
          grossRevenue: getUSDEquivalent(totalCoins) * 2,
          rewardPercentage: 0.122, // 12.2% from calculation
          grossCoins,
          netWithdrawable,
          usdEquiv,
          kycTier: "L1" as const,
          fraudScore: 0.88,
          status: "pending" as const,
          name: "DanceFan_Alex",
          followers: "1.2K"
        };
      case "malicious":
        return {
          grossRevenue: getUSDEquivalent(totalCoins) * 8,
          rewardPercentage: 0.00, // 0% due to fraud gate
          grossCoins,
          netWithdrawable: 0,
          usdEquiv: 0.00,
          kycTier: "L0" as const,
          fraudScore: 0.15,
          status: "flagged" as const,
          name: "SuspiciousAccount",
          followers: "0"
        };
    }
  };

  const data = getPersonaData();
  const canWithdraw = data.usdEquiv >= 20 && data.status !== "flagged";

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <div className="bg-gradient-primary shadow-primary">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-primary-foreground">
            <div className="flex items-center gap-3">
              {onBackToHome && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBackToHome}
                  className="text-primary-foreground hover:bg-white/20"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              <div className="p-2 bg-white/20 rounded-lg">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">{data.name}</h1>
                <p className="text-primary-foreground/80">{data.followers} followers</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {data.status === "verified" && (
                <Badge variant="secondary" className="bg-success text-success-foreground">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
              {data.status === "flagged" && (
                <Badge variant="destructive">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Flagged
                </Badge>
              )}
              {data.status === "pending" && (
                <Badge variant="secondary">
                  <Shield className="w-3 h-3 mr-1" />
                  KYC {data.kycTier}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {data.status === "flagged" && (
          <Card className="mb-6 border-destructive bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <p className="font-medium">Account Under Review</p>
                  <p className="text-sm text-destructive/80">
                    Your account has been flagged for suspicious activity. Earnings are on hold pending review.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="relative mb-6">
            <TabsList className="w-full justify-start overflow-x-auto scrollbar-hide flex-nowrap h-auto p-1 bg-muted rounded-lg">
              <TabsTrigger value="overview" className="whitespace-nowrap px-4 py-2 text-sm">Overview</TabsTrigger>
              <TabsTrigger value="breakdown" className="whitespace-nowrap px-4 py-2 text-sm">Breakdown</TabsTrigger>
              <TabsTrigger value="withdraw" className="whitespace-nowrap px-4 py-2 text-sm">Withdraw</TabsTrigger>
              <TabsTrigger value="reinvest" className="whitespace-nowrap px-4 py-2 text-sm">Reinvest</TabsTrigger>
              <TabsTrigger value="purchase" className="whitespace-nowrap px-4 py-2 text-sm">Purchase</TabsTrigger>
              <TabsTrigger value="borrow" className="whitespace-nowrap px-4 py-2 text-sm">Borrow</TabsTrigger>
              <TabsTrigger value="audience" className="whitespace-nowrap px-4 py-2 text-sm">Audience</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <BalanceOverview
              fraudScore={data.fraudScore}
              status={data.status}
            />
            
            <RewardBreakdown
              persona={persona}
              grossRevenue={data.grossRevenue}
              rewardPercentage={data.rewardPercentage}
              netCoins={data.netWithdrawable}
            />
            
            <div className="grid gap-4 md:grid-cols-2">
              <EarningsChart persona={persona} />
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reward %</span>
                    <span className={`font-medium ${data.rewardPercentage > 0.5 ? 'text-success' : data.rewardPercentage > 0.2 ? 'text-warning' : 'text-destructive'}`}>
                      {(data.rewardPercentage * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fraud Score</span>
                    <span className={`font-medium ${data.fraudScore > 0.8 ? 'text-success' : data.fraudScore > 0.5 ? 'text-warning' : 'text-destructive'}`}>
                      {(data.fraudScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">KYC Level</span>
                    <span className="font-medium">{data.kycTier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min Withdrawal</span>
                    <span className="font-medium">$20.00</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="breakdown">
            <PayoutBreakdown
              grossCoins={data.grossCoins}
              netWithdrawable={data.netWithdrawable}
              usdEquiv={data.usdEquiv}
              fraudScore={data.fraudScore}
            />
          </TabsContent>

          <TabsContent value="withdraw">
            <WithdrawTab
              balance={data.netWithdrawable}
              usdEquiv={data.usdEquiv}
              kycTier={data.kycTier}
              canWithdraw={canWithdraw}
              status={data.status}
            />
          </TabsContent>

          <TabsContent value="reinvest">
            <ReinvestTab />
          </TabsContent>

          <TabsContent value="purchase">
            <PurchaseTab
              balance={data.netWithdrawable}
              usdEquiv={data.usdEquiv}
            />
          </TabsContent>

          <TabsContent value="borrow">
            <BorrowTab
              balance={data.netWithdrawable}
              usdEquiv={data.usdEquiv}
            />
          </TabsContent>

          <TabsContent value="audience">
            <AudienceTab persona={persona} />
          </TabsContent>
        </Tabs>

        {/* Sticky Action Buttons - Mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 md:hidden">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <Button 
              variant="outline" 
              className="flex-1"
              disabled={!canWithdraw}
              onClick={() => setActiveTab("withdraw")}
            >
              Withdraw ${data.usdEquiv.toFixed(2)}
            </Button>
            <Button 
              variant="default" 
              className="flex-1 bg-gradient-primary"
              onClick={() => setActiveTab("reinvest")}
            >
              Reinvest
            </Button>
          </div>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex gap-4 mt-8 justify-center">
          <Button 
            variant="outline" 
            size="lg"
            disabled={!canWithdraw}
            onClick={() => setActiveTab("withdraw")}
          >
            Withdraw ${data.usdEquiv.toFixed(2)}
          </Button>
          <Button 
            variant="default" 
            size="lg"
            className="bg-gradient-primary shadow-primary"
            onClick={() => setActiveTab("reinvest")}
          >
            Reinvest Coins
          </Button>
        </div>
      </div>
      
      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </div>
  );
};