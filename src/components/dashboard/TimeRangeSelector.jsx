import { Button } from "@/components/ui/button";

export function TimeRangeSelector({ active, onChange }) {
  const options = [
    { value: "12h", label: "12 Hours" },
    { value: "24h", label: "24 Hours" },
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" }
  ];
  
  return (
    <div className="inline-flex items-center rounded-lg border bg-background p-1 shadow-sm">
      {options.map(option => (
        <Button
          key={option.value}
          variant={active === option.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange(option.value)}
          className={`rounded-md px-3 ${active === option.value ? "" : "hover:bg-muted"}`}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
} 