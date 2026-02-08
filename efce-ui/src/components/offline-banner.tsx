// Copyright (c) 2026 Jeyapragash. All rights reserved.

"use client";

import * as React from "react";

export function OfflineBanner() {
  const [offline, setOffline] = React.useState(false);

  React.useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="bg-amber-500/20 text-amber-700 text-xs px-4 py-2 border-b">
      Offline mode — showing cached data only.
    </div>
  );
}

