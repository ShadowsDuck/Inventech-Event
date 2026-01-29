import type { ReactNode } from "react";

interface AppShellProps {
  sidebar?: ReactNode;
  header?: ReactNode;
  children: ReactNode;
}

export function AppShell({ sidebar, header, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {sidebar}

      <main className="flex min-w-0 flex-1 flex-col bg-gray-50">
        {header && (
          <header className="border-b border-gray-200 bg-white">
            {header}
          </header>
        )}

        <div className="min-h-0 flex-1">{children}</div>
      </main>
    </div>
  );
}

export default AppShell;
