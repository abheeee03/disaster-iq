import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react";

export function StatCard({ title, count, change, trend, link }) {
  const trendInfo = {
    up: {
      icon: <ArrowUpIcon className="h-4 w-4" />,
      color: "text-red-500",
      bg: "bg-red-100"
    },
    down: {
      icon: <ArrowDownIcon className="h-4 w-4" />,
      color: "text-green-500", 
      bg: "bg-green-100"
    },
    neutral: {
      icon: <ArrowRightIcon className="h-4 w-4" />,
      color: "text-gray-500",
      bg: "bg-gray-100"
    }
  };

  const { icon, color, bg } = trendInfo[trend];

  return (
    <Link href={link} className="block">
      <Card className="transition-all hover:shadow-md overflow-hidden">
        <CardContent className="pt-6">
          <h3 className="font-medium text-muted-foreground">{title}</h3>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-3xl font-bold">{count}</span>
            <Badge variant="outline" className={`flex gap-1 items-center ${color} ${bg}`}>
              {change} {icon}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="pb-3 pt-0 text-xs text-muted-foreground">
          <span>Click to view details</span>
        </CardFooter>
      </Card>
    </Link>
  );
} 