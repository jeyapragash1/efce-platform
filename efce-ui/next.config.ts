// Copyright (c) 2026 Jeyapragash. All rights reserved.

import type { NextConfig } from "next";
import createBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  turbopack: {},
};

export default withBundleAnalyzer(nextConfig);

