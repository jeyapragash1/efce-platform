"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { useNotifications } from "./notifications";

type Incident = {
  id: string;
  title: string;
  service: string;
  severity: string;
  status: string;
  startedAt: string;
  durationMin: number;
};

type Attribution = {
  factor: string;
  contribution: number;
  type: string;
};

type Counterfactual = {
  id: string;
  label: string;
  delta: number; // negative reduces probability
};

export function ExportIncidentPdfButton({
  incident,
  timeline,
  attribution,
  counterfactuals,
  baseProbability,
  onExport,
  disabled,
}: {
  incident: Incident;
  timeline: string[];
  attribution: Attribution[];
  counterfactuals: Counterfactual[];
  baseProbability: number;
  onExport?: () => void;
  disabled?: boolean;
}) {
  const { notify } = useNotifications();
  const exportPdf = async () => {
    if (onExport) {
      onExport();
      return;
    }
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const margin = 40;
    let y = 48;

    // ---------- Header ----------
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`EFCE Incident Report — ${incident.id}`, margin, y);

    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);

    y += 20;
    doc.setDrawColor(200);
    doc.line(margin, y, 555, y);
    y += 18;

    // ---------- Summary ----------
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Incident Summary", margin, y);
    y += 14;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const summaryLines = [
      `Title: ${incident.title}`,
      `Service: ${incident.service}`,
      `Severity: ${incident.severity}`,
      `Status: ${incident.status}`,
      `Started: ${incident.startedAt}`,
      `Duration: ${incident.durationMin} minutes`,
    ];

    summaryLines.forEach((line) => {
      doc.text(line, margin, y);
      y += 14;
    });

    y += 14;

    // ---------- Timeline Table ----------
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Incident Timeline", margin, y);
    y += 8;

    autoTable(doc, {
      startY: y + 6,
      head: [["Step", "Event"]],
      body: timeline.map((t, idx) => [String(idx + 1), t]),
      styles: { fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0] },
      theme: "grid",
      margin: { left: margin, right: margin },
    });

    {
      const lastTableY = (doc as jsPDF & { lastAutoTable?: { finalY?: number } })
        .lastAutoTable?.finalY;
      y = (lastTableY ?? y) + 18;
    }

    // ---------- Attribution Table ----------
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Failure Attribution", margin, y);
    y += 8;

    autoTable(doc, {
      startY: y + 6,
      head: [["Factor", "Type", "Contribution %"]],
      body: attribution.map((a) => [a.factor, a.type, `${a.contribution}%`]),
      styles: { fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0] },
      theme: "grid",
      margin: { left: margin, right: margin },
    });

    {
      const lastTableY = (doc as jsPDF & { lastAutoTable?: { finalY?: number } })
        .lastAutoTable?.finalY;
      y = (lastTableY ?? y) + 18;
    }

    // ---------- Counterfactual Table ----------
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Counterfactual Prevention Options", margin, y);
    y += 14;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Baseline failure probability: ${baseProbability}%`, margin, y);
    y += 10;

    autoTable(doc, {
      startY: y + 6,
      head: [["Control / Prevention", "Expected Reduction", "Projected Probability"]],
      body: counterfactuals.map((c) => {
        const projected = Math.max(0, Math.min(100, baseProbability + c.delta));
        return [c.label, `${Math.abs(c.delta)}%`, `${projected}%`];
      }),
      styles: { fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0] },
      theme: "grid",
      margin: { left: margin, right: margin },
    });

    // ---------- Graph Capture Page ----------
    const graphEl = document.getElementById("efce-graph-capture");

    if (graphEl) {
      try {
        const canvas = await html2canvas(graphEl, {
          backgroundColor: "#ffffff",
          scale: 2,
        });

        const img = canvas.toDataURL("image/png");

        doc.addPage();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Causal Graph", margin, 48);

        // Fit image into page width
        const imgWidth = 520;
        const imgHeight = (canvas.height / canvas.width) * imgWidth;

        doc.addImage(img, "PNG", margin, 70, imgWidth, Math.min(700, imgHeight));
      } catch {
        // If capture fails, still export PDF without the image
        doc.addPage();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Causal Graph", margin, 48);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Graph capture failed. Exported report without graph image.", margin, 70);
      }
    }

    // ---------- Footer ----------
    const pageCount = doc.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(
        `EFCE — Confidential Demo Report | Page ${p} of ${pageCount}`,
        margin,
        820
      );
    }

    doc.save(`EFCE_${incident.id}_Incident_Report.pdf`);
    notify({ message: "Report exported as PDF", type: "success" });
  };

  return (
    <Button onClick={exportPdf} variant="default" data-testid="export-pdf" disabled={disabled}>
      Export PDF
    </Button>
  );
}
