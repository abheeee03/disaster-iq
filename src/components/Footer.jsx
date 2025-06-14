import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} DisasterIQ. Built with ❤️ for modern observability and monitoring.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a href="#" className="hover:underline">Terms</a>
          <Separator orientation="vertical" className="h-4" />
          <a href="#" className="hover:underline">Privacy</a>
          <Separator orientation="vertical" className="h-4" />
          <a href="#" className="hover:underline">Contact</a>
        </div>
      </div>
    </footer>
  );
} 