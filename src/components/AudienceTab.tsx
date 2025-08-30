import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Globe, Users, Shield, Clock, Smartphone, CheckCircle } from "lucide-react";

interface AudienceTabProps {
  persona: "top" | "niche" | "casual" | "malicious";
}

export const AudienceTab = ({ persona }: AudienceTabProps) => {
  const getAudienceData = () => {
    switch (persona) {
      case "top":
        return {
          topLocations: [
            { country: "United States", percent: 35, flag: "🇺🇸" },
            { country: "United Kingdom", percent: 18, flag: "🇬🇧" },
            { country: "Canada", percent: 12, flag: "🇨🇦" },
            { country: "Australia", percent: 8, flag: "🇦🇺" },
            { country: "Germany", percent: 7, flag: "🇩🇪" }
          ],
          engagementDepth: 85,
          verifiedUsers: 78,
          avgAccountAge: 24,
          deviceDiversity: 92,
          audienceQuality: "Excellent",
          trustScore: 95
        };
      case "niche":
        return {
          topLocations: [
            { country: "United States", percent: 42, flag: "🇺🇸" },
            { country: "Canada", percent: 28, flag: "🇨🇦" },
            { country: "United Kingdom", percent: 15, flag: "🇬🇧" },
            { country: "Netherlands", percent: 8, flag: "🇳🇱" },
            { country: "Sweden", percent: 7, flag: "🇸🇪" }
          ],
          engagementDepth: 92,
          verifiedUsers: 84,
          avgAccountAge: 32,
          deviceDiversity: 88,
          audienceQuality: "High",
          trustScore: 88
        };
      case "casual":
        return {
          topLocations: [
            { country: "United States", percent: 48, flag: "🇺🇸" },
            { country: "Mexico", percent: 22, flag: "🇲🇽" },
            { country: "Brazil", percent: 15, flag: "🇧🇷" },
            { country: "Philippines", percent: 10, flag: "🇵🇭" },
            { country: "India", percent: 5, flag: "🇮🇳" }
          ],
          engagementDepth: 68,
          verifiedUsers: 62,
          avgAccountAge: 18,
          deviceDiversity: 75,
          audienceQuality: "Good",
          trustScore: 72
        };
      case "malicious":
        return {
          topLocations: [
            { country: "Unknown", percent: 45, flag: "❓" },
            { country: "Various", percent: 25, flag: "🌍" },
            { country: "Proxy", percent: 20, flag: "🔒" },
            { country: "VPN", percent: 10, flag: "🛡️" }
          ],
          engagementDepth: 15,
          verifiedUsers: 8,
          avgAccountAge: 3,
          deviceDiversity: 25,
          audienceQuality: "Suspicious",
          trustScore: 5
        };
    }
  };

  const data = getAudienceData();

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "Excellent": return "text-success";
      case "High": return "text-success";
      case "Good": return "text-warning";
      case "Suspicious": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getQualityBadgeVariant = (quality: string) => {
    switch (quality) {
      case "Excellent": 
      case "High": return "default" as const;
      case "Good": return "secondary" as const;
      case "Suspicious": return "destructive" as const;
      default: return "outline" as const;
    }
  };

  return (
    <div className="space-y-6">
      {/* Audience Quality Overview */}
      <Card className={`${
        data.audienceQuality === "Suspicious" 
          ? "border-destructive bg-destructive/5" 
          : "bg-gradient-card shadow-card"
      }`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Audience Quality
            </div>
            <Badge variant={getQualityBadgeVariant(data.audienceQuality)}>
              {data.audienceQuality}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2 ${getQualityColor(data.audienceQuality)}">
            {data.trustScore}%
          </div>
          <p className="text-muted-foreground mb-4">
            Overall audience trust score
          </p>
          <Progress value={data.trustScore} className="h-3" />
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Top Locations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.topLocations.map((location, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{location.flag}</span>
                <span className="font-medium">{location.country}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24">
                  <Progress value={location.percent} className="h-2" />
                </div>
                <span className="text-sm font-medium w-12 text-right">
                  {location.percent}%
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Verified Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {data.verifiedUsers}%
            </div>
            <Progress value={data.verifiedUsers} className="mb-2 h-2" />
            <p className="text-sm text-muted-foreground">
              Percentage of verified followers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Engagement Depth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {data.engagementDepth}%
            </div>
            <Progress value={data.engagementDepth} className="mb-2 h-2" />
            <p className="text-sm text-muted-foreground">
              Deep engagement vs casual likes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Account Age
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {data.avgAccountAge} months
            </div>
            <p className="text-sm text-muted-foreground">
              Average follower account age
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Device Diversity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {data.deviceDiversity}%
            </div>
            <Progress value={data.deviceDiversity} className="mb-2 h-2" />
            <p className="text-sm text-muted-foreground">
              Real device fingerprint diversity
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fraud Indicators */}
      {persona === "malicious" && (
        <Card className="border-destructive bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Fraud Indicators Detected
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                <span className="text-sm font-medium">Bot-like engagement patterns</span>
                <Badge variant="destructive">High Risk</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                <span className="text-sm font-medium">Suspicious geographic clustering</span>
                <Badge variant="destructive">High Risk</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                <span className="text-sm font-medium">New account follower surge</span>
                <Badge variant="destructive">High Risk</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                <span className="text-sm font-medium">Device fingerprint anomalies</span>
                <Badge variant="destructive">High Risk</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quality Insights */}
      {persona !== "malicious" && (
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle>Audience Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="font-medium text-success">High Quality</span>
                </div>
                <p className="text-sm text-success/80">
                  Your audience shows authentic engagement patterns and diverse demographics
                </p>
              </div>
              
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-medium text-primary">Organic Growth</span>
                </div>
                <p className="text-sm text-primary/80">
                  Steady follower growth with healthy engagement ratios
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};