// Copyright (c) 2026 Jeyapragash. All rights reserved.

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getStoredToken } from "@/lib/api/client";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return <div className="p-6 text-sm text-muted-foreground">Checking session...</div>;
  }

  return <>{children}</>;
}
