import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { NotificationBell } from "./notifications";

type Breadcrumb = { label: string; href?: string };

export function Topbar({
  title,
  breadcrumbs,
}: {
  title: string;
  breadcrumbs?: Breadcrumb[];
}) {
  return (
    <header className="h-14 border-b px-6 flex items-center justify-between gap-4">
      <div className="flex flex-col">
        {breadcrumbs?.length ? (
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <ol className="flex items-center gap-2">
              {breadcrumbs.map((crumb, index) => (
                <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-foreground">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 ? <span>/</span> : null}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <h1 className="font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <NotificationBell />
        <ThemeToggle />
        <span className="text-sm text-muted-foreground">v0.1 UI-first</span>
      </div>
    </header>
  );
}
