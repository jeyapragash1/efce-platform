import type { Incident } from "@/types/incident";
import type { RiskItem } from "@/types/risk";
import type { ReportItem } from "@/types/report";
import { incidents } from "@/lib/mock/incidents";
import { risks } from "@/lib/mock/risks";
import { reports } from "@/lib/mock/reports";

export const apiClient = {
  async getIncidents(): Promise<Incident[]> {
    return incidents;
  },
  async getRisks(): Promise<RiskItem[]> {
    return risks;
  },
  async getReports(): Promise<ReportItem[]> {
    return reports;
  },
};
