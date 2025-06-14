import { Badge } from "@/components/ui/badge";

export function ForecastCard({ title, risk, description }) {
  const riskConfig = {
    "Critical": {
      color: "bg-red-50 border-red-200",
      badge: "text-red-700 bg-red-100 border-red-400"
    },
    "High Risk": {
      color: "bg-yellow-50 border-yellow-200",
      badge: "text-yellow-700 bg-yellow-100 border-yellow-400"
    },
    "Watch": {
      color: "bg-blue-50 border-blue-200",
      badge: "text-blue-700 bg-blue-100 border-blue-400"
    },
    "Low Risk": {
      color: "bg-green-50 border-green-200",
      badge: "text-green-700 bg-green-100 border-green-400"
    }
  };
  
  const { color, badge } = riskConfig[risk];
  
  return (
    <div className={`p-4 border rounded-lg ${color}`}>
      <div className="flex justify-between items-center">
        <h3 className="font-medium">{title}</h3>
        <Badge variant="outline" className={badge}>{risk}</Badge>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
} 