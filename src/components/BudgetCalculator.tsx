import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, Users, Calendar, Info } from "lucide-react";

export const BudgetCalculator = () => {
  const [travelers, setTravelers] = useState(2);
  const [days, setDays] = useState(3);

  const accommodationPerDay = 2000;
  const foodPerDay = 1500;
  const transportPerDay = 800;
  const activitiesPerDay = 1200;

  const totalAccommodation = accommodationPerDay * days;
  const totalFood = foodPerDay * days * travelers;
  const totalTransport = transportPerDay * days;
  const totalActivities = activitiesPerDay * days * travelers;

  const totalCost = totalAccommodation + totalFood + totalTransport + totalActivities;
  const perPersonCost = totalCost / travelers;

  return (
    <Card className="overflow-hidden border-2 border-primary/20 shadow-glow animate-slide-up">
      <div className="bg-gradient-primary p-6">
        <CardHeader className="p-0">
          <CardTitle className="text-white flex items-center gap-2 text-2xl">
            <DollarSign className="w-6 h-6" />
            Budget Calculator
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Estimate your trip costs
          </CardDescription>
        </CardHeader>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Input Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Travelers
            </label>
            <Input
              type="number"
              min="1"
              value={travelers}
              onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
              className="text-lg font-semibold"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Days
            </label>
            <Input
              type="number"
              min="1"
              value={days}
              onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
              className="text-lg font-semibold"
            />
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="space-y-3 py-4 border-t border-b border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">🏨 Accommodation</span>
            <span className="font-semibold">₹{totalAccommodation.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">🍽️ Food & Dining</span>
            <span className="font-semibold">₹{totalFood.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">🚗 Transportation</span>
            <span className="font-semibold">₹{totalTransport.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">🎯 Activities</span>
            <span className="font-semibold">₹{totalActivities.toLocaleString()}</span>
          </div>
        </div>

        {/* Total Cost */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-foreground">Total Cost</span>
            <span className="text-2xl font-bold text-primary">
              ₹{totalCost.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Per Person</span>
            <span className="text-lg font-semibold text-accent">
              ₹{perPersonCost.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Money Saving Tips */}
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-1">Money-Saving Tips</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Book accommodations in advance for better rates</li>
                <li>• Try local street food for authentic & affordable meals</li>
                <li>• Use public transport or shared rides</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
