import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2Icon, 
  AlertTriangleIcon, 
  XCircleIcon 
} from "lucide-react";

export function StatusItem({ name, status }) {
  const statusConfig = {
    operational: {
      icon: <CheckCircle2Icon className="h-4 w-4" />,
      variant: "outline",
      className: "bg-green-100 text-green-800 border-green-400"
    },
    degraded: {
      icon: <AlertTriangleIcon className="h-4 w-4" />,
      variant: "outline",
      className: "bg-yellow-100 text-yellow-800 border-yellow-400"
    },
    outage: {
      icon: <XCircleIcon className="h-4 w-4" />,
      variant: "outline",
      className: "bg-red-100 text-red-800 border-red-400"
    }
  };

  const { icon, variant, className } = statusConfig[status];
  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div className="flex items-center justify-between py-2">
      <span className="font-medium">{name}</span>
      <Badge variant={variant} className={`flex items-center gap-1 ${className}`}>
        {icon}
        <span>{displayStatus}</span>
      </Badge>
    </div>
  );
} 