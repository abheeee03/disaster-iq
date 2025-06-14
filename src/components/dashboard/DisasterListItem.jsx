import { Badge } from "@/components/ui/badge";
import { 
  Flame, 
  Activity, 
  Droplet, 
  Cloud, 
  Mountain 
} from "lucide-react";

export function DisasterListItem({ type, name, location, time, severity, coordinates }) {
  const typeConfig = {
    wildfire: {
      icon: <Flame className="h-4 w-4" />,
      color: "text-red-500",
    },
    earthquake: {
      icon: <Activity className="h-4 w-4" />,
      color: "text-yellow-500",
    },
    flood: {
      icon: <Droplet className="h-4 w-4" />,
      color: "text-blue-500",
    },
    storm: {
      icon: <Cloud className="h-4 w-4" />,
      color: "text-blue-700",
    },
    volcano: {
      icon: <Mountain className="h-4 w-4" />,
      color: "text-orange-600",
    }
  };

  const severityConfig = {
    Critical: "bg-red-100 text-red-800 border-red-200",
    Warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Moderate: "bg-blue-100 text-blue-800 border-blue-200",
    Watch: "bg-green-100 text-green-800 border-green-200"
  };

  const { icon, color } = typeConfig[type];

  return (
    <div className="flex items-center gap-3 border-b py-3 last:border-0">
      <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-muted ${color}`}>
        {icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <h4 className="text-sm font-medium truncate">{name}</h4>
          <Badge variant="outline" className={severityConfig[severity]}>{severity}</Badge>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          <p>📍 {location}</p>
          <p className="mt-0.5">🕒 {time}</p>
          <p className="mt-0.5 text-xs opacity-70">{coordinates}</p>
        </div>
      </div>
    </div>
  );
} 