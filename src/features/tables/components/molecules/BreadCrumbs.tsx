import { House, ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadCrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

export default function BreadCrumbs({
  items,
  showHome = true,
}: BreadCrumbsProps) {
  return (
    <div className="flex items-center gap-1 text-sm">
      {showHome && (
        <>
          <House className="size-3.5 text-zinc-500" />
          {items.length > 0 && (
            <ChevronRight className="size-3 text-zinc-500" />
          )}
        </>
      )}

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-1">
            <p
              className={
                isLast
                  ? "text-zinc-900 font-medium"
                  : "text-zinc-500"
              }
            >
              {item.label}
            </p>

            {!isLast && (
              <ChevronRight className="size-3 text-zinc-500" />
            )}
          </div>
        );
      })}
    </div>
  );
}