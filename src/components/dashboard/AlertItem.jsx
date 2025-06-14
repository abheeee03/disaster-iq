import { 
  AlertCircleIcon,
  AlertTriangleIcon, 
  InfoIcon 
} from "lucide-react";

export function AlertItem({ type, message, time }) {
  const alertConfig = {
    critical: {
      icon: <AlertCircleIcon className="h-5 w-5" />,
      border: "border-red-500",
      bg: "bg-red-50",
      iconColor: "text-red-500"
    },
    warning: {
      icon: <AlertTriangleIcon className="h-5 w-5" />,
      border: "border-yellow-500",
      bg: "bg-yellow-50",
      iconColor: "text-yellow-500"
    },
    info: {
      icon: <InfoIcon className="h-5 w-5" />,
      border: "border-blue-500", 
      bg: "bg-blue-50",
      iconColor: "text-blue-500"
    }
  };

  const { icon, border, bg, iconColor } = alertConfig[type];

  return (
    <div className={`flex gap-3 ${border} ${bg} border-l-4 p-3 rounded-r`}>
      <div className={iconColor}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-medium">{message}</p>
        <p className="text-sm text-muted-foreground">{time}</p>
      </div>
    </div>
  );
} 