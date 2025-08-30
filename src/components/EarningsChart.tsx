import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Calendar } from "lucide-react";

interface EarningsChartProps {
  persona: "top" | "niche" | "casual" | "malicious";
}

export const EarningsChart = ({ persona }: EarningsChartProps) => {
  const getChartData = () => {
    const baseData = [
      { day: "Mon", date: "Dec 25" },
      { day: "Tue", date: "Dec 26" },
      { day: "Wed", date: "Dec 27" },
      { day: "Thu", date: "Dec 28" },
      { day: "Fri", date: "Dec 29" },
      { day: "Sat", date: "Dec 30" },
      { day: "Sun", date: "Dec 31" }
    ];

    switch (persona) {
      case "top":
        return baseData.map((item, index) => ({
          ...item,
          earnings: [2100, 2400, 1800, 3200, 2800, 3500, 2900][index],
          cumulative: [2100, 4500, 6300, 9500, 12300, 15800, 18700][index]
        }));
      case "niche":
        return baseData.map((item, index) => ({
          ...item,
          earnings: [180, 220, 160, 280, 240, 320, 190][index],
          cumulative: [180, 400, 560, 840, 1080, 1400, 1590][index]
        }));
      case "casual":
        return baseData.map((item, index) => ({
          ...item,
          earnings: [12, 8, 15, 22, 18, 25, 14][index],
          cumulative: [12, 20, 35, 57, 75, 100, 114][index]
        }));
      case "malicious":
        return baseData.map((item, index) => ({
          ...item,
          earnings: [0, 0, 0, 0, 0, 0, 0][index],
          cumulative: [0, 0, 0, 0, 0, 0, 0][index]
        }));
    }
  };

  const data = getChartData();
  const currentEarnings = data[data.length - 1]?.earnings || 0;
  const totalEarnings = data[data.length - 1]?.cumulative || 0;
  const weeklyGrowth = data.length > 1 ? 
    ((currentEarnings - data[0].earnings) / data[0].earnings * 100) : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-card">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            Earnings: {payload[0].value.toLocaleString()} coins
          </p>
          {payload[1] && (
            <p className="text-muted-foreground">
              Total: {payload[1].value.toLocaleString()} coins
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          7-Day Earnings
        </CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">This Week</span>
          </div>
          <div className={`font-medium ${weeklyGrowth >= 0 ? 'text-success' : 'text-destructive'}`}>
            {weeklyGrowth >= 0 ? '+' : ''}{weeklyGrowth.toFixed(1)}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Today's Earnings</p>
            <p className="text-2xl font-bold">{currentEarnings.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">coins</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Week Total</p>
            <p className="text-2xl font-bold">{totalEarnings.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">coins</p>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {persona === "malicious" ? (
              // Flat line for malicious accounts
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--destructive))", strokeWidth: 2 }}
                />
              </LineChart>
            ) : (
              // Area chart for active accounts
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#earningsGradient)"
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {persona === "malicious" && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">
              Earnings suspended due to policy violations
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};