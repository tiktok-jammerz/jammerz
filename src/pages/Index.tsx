import { useState } from "react";
import { CreatorDashboard } from "@/components/CreatorDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Star, UserCheck, AlertTriangle } from "lucide-react";

const Index = () => {
  const [selectedPersona, setSelectedPersona] = useState<"top" | "niche" | "casual" | "malicious" | null>(null);

  const personas = [
    {
      id: "top" as const,
      name: "Top Creator",
      description: "High-earning creator with large audience",
      icon: <Star className="w-5 h-5" />,
      color: "bg-gradient-primary text-primary-foreground",
      stats: "2.1M followers • $795 available"
    },
    {
      id: "niche" as const,
      name: "Niche Creator",
      description: "Specialized content with engaged audience",
      icon: <UserCheck className="w-5 h-5" />,
      color: "bg-gradient-success text-success-foreground",
      stats: "45.2K followers • $132 available"
    },
    {
      id: "casual" as const,
      name: "Casual Creator",
      description: "Part-time creator building audience",
      icon: <Users className="w-5 h-5" />,
      color: "bg-secondary text-secondary-foreground",
      stats: "1.2K followers • $7.90 available"
    },
    {
      id: "malicious" as const,
      name: "Flagged Account",
      description: "Account under review for violations",
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "bg-destructive text-destructive-foreground",
      stats: "Suspended • $0 available"
    }
  ];

  if (selectedPersona) {
    return <CreatorDashboard persona={selectedPersona} onBackToHome={() => setSelectedPersona(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <div className="bg-gradient-primary shadow-primary">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            TikTok Creator Coin Economy
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-2">
            Transparent Payouts • Financial Tools • Creator Banking
          </p>
          <p className="text-primary-foreground/70">
            Experience the future of creator monetization with full transparency
          </p>
        </div>
      </div>

      {/* Persona Selection */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-3">Choose Creator Persona</h2>
          <p className="text-muted-foreground">
            Explore different creator experiences and payout scenarios
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {personas.map((persona) => (
            <Card 
              key={persona.id}
              className="cursor-pointer transition-all hover:shadow-card hover:scale-105 bg-gradient-card border-2 hover:border-primary/50"
              onClick={() => setSelectedPersona(persona.id)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${persona.color}`}>
                    {persona.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span>{persona.name}</span>
                      {persona.id === "top" && (
                        <Badge className="bg-primary text-primary-foreground">
                          Popular
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  {persona.description}
                </p>
                <p className="text-sm font-medium text-foreground">
                  {persona.stats}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Preview */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold text-center mb-8">
            Platform Features
          </h3>
          
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-gradient-card shadow-card text-center">
              <CardContent className="p-6">
                <div className="p-3 bg-primary/20 rounded-full w-fit mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Transparent Payouts</h4>
                <p className="text-sm text-muted-foreground">
                  See exactly where every cent goes with itemized breakdowns
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card text-center">
              <CardContent className="p-6">
                <div className="p-3 bg-success/20 rounded-full w-fit mx-auto mb-4">
                  <Star className="w-6 h-6 text-success" />
                </div>
                <h4 className="font-semibold mb-2">Creator Banking</h4>
                <p className="text-sm text-muted-foreground">
                  Save, invest, and borrow against future earnings
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card text-center">
              <CardContent className="p-6">
                <div className="p-3 bg-warning/20 rounded-full w-fit mx-auto mb-4">
                  <UserCheck className="w-6 h-6 text-warning" />
                </div>
                <h4 className="font-semibold mb-2">Reinvestment Tools</h4>
                <p className="text-sm text-muted-foreground">
                  Boost content, run ads, license music with coins
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button 
            onClick={() => setSelectedPersona("top")}
            className="bg-gradient-primary shadow-primary"
            size="lg"
          >
            Get Started with Top Creator
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
