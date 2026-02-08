// Copyright (c) 2026 Jeyapragash. All rights reserved.

"use client";

import * as React from "react";

export function ServiceWorkerRegister() {
  React.useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return null;
}

