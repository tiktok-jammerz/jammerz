import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp, Receipt, Info } from "lucide-react";

interface PayoutBreakdownProps {
  grossCoins: number;
  netWithdrawable: number;
  usdEquiv: number;
  fraudScore: number;
}

interface ReceiptLine {
  label: string;
  amount: number;
  type: "deduction" | "addition" | "info";
  details?: string;
}

export const PayoutBreakdown = ({
  grossCoins,
  netWithdrawable,
  usdEquiv,
  fraudScore
}: PayoutBreakdownProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const withdrawAmount = usdEquiv; // Actual withdrawal amount
  
  const ratio = withdrawAmount; // Use actual withdrawal amount as base
  const simpleBreakdown: ReceiptLine[] = [
    { label: "Fan purchase", amount: ratio * 1.887, type: "info" },
    { label: "App Store fee", amount: ratio * -0.566, type: "deduction", details: "Apple/Google platform fee" },
    { label: "Hosting & delivery", amount: ratio * -0.094, type: "deduction" },
    { label: "Safety & moderation", amount: ratio * -0.075, type: "deduction" },
    { label: "Compliance & payouts", amount: ratio * -0.038, type: "deduction" },
    { label: "Creator programs & music rights", amount: ratio * -0.075, type: "deduction" },
    { label: "TikTok margin", amount: ratio * -0.075, type: "deduction" },
  ];

  const expandedBreakdown: ReceiptLine[] = [
    { label: "Fan purchase", amount: ratio * 1.887, type: "info" },
    { label: "Apple/Google app store & payment fee", amount: ratio * -0.566, type: "deduction" },
    { label: "Video storage & CDN streaming", amount: ratio * -0.047, type: "deduction" },
    { label: "Live streaming infrastructure", amount: ratio * -0.047, type: "deduction" },
    { label: "App features & development (Duet, Stitch, For You feed)", amount: ratio * -0.038, type: "deduction" },
    { label: "AI safety systems (spam, scams, harmful content)", amount: ratio * -0.047, type: "deduction" },
    { label: "Human moderators & trust teams", amount: ratio * -0.028, type: "deduction" },
    { label: "Compliance & payout checks (tax, KYC/AML)", amount: ratio * -0.019, type: "deduction" },
    { label: "Creator programs (bonuses, subsidies)", amount: ratio * -0.038, type: "deduction" },
    { label: "Music rights licensing", amount: ratio * -0.038, type: "deduction" },
    { label: "TikTok profit", amount: ratio * -0.075, type: "deduction" },
  ];

  const breakdown = isExpanded ? expandedBreakdown : simpleBreakdown;
  const finalAmount = withdrawAmount;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Transparent Payout Breakdown
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            See exactly where every cent goes from fan purchases to your earnings
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Receipt */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            {breakdown.map((line, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${
                      line.type === "info" ? "font-medium" :
                      line.type === "deduction" ? "text-muted-foreground" :
                      "text-success"
                    }`}>
                      {line.type === "deduction" && "−"} {line.label}
                    </span>
                    {line.details && (
                      <Info className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                  <span className={`font-medium ${
                    line.type === "info" ? "text-foreground" :
                    line.type === "deduction" ? "text-destructive" :
                    "text-success"
                  }`}>
                    ${Math.abs(line.amount).toFixed(3)}
                  </span>
                </div>
                {index < breakdown.length - 1 && line.type !== "info" && (
                  <div className="w-full h-px bg-border mt-2" />
                )}
              </div>
            ))}
            
            <Separator />
            
            <div className="flex items-center justify-between p-3 bg-gradient-success rounded-lg">
              <div className="flex items-center gap-2">
                <span className="font-medium text-success-foreground">You (instant)</span>
                <div className="w-2 h-2 bg-success-foreground rounded-full animate-pulse" />
              </div>
              <span className="font-bold text-success-foreground text-lg">
                ${finalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Show Simple View
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                See More Details
              </>
            )}
          </Button>

          {/* Current Balance Breakdown */}
          <div className="space-y-3">
            <h3 className="font-medium">Your Current Balance Breakdown</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Gross Earnings</div>
                <div className="font-bold">{grossCoins.toLocaleString()} coins</div>
              </div>
              <div className="p-3 bg-gradient-success rounded-lg">
                <div className="text-sm text-success-foreground/80">Net Withdrawable</div>
                <div className="font-bold text-success-foreground">
                  ${usdEquiv.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Trust Score Impact */}
          {fraudScore < 1 && (
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-warning" />
                <span className="font-medium text-warning-foreground">Quality Adjustment Applied</span>
              </div>
              <p className="text-sm text-warning-foreground/80">
                Your earnings have been adjusted by {((1 - fraudScore) * 100).toFixed(1)}% based on content quality and authenticity metrics.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};