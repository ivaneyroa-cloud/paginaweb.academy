"use client";

import { useState } from "react";
import jsPDF from "jspdf";

interface GuideSection {
    title: string;
    content: string;
}

interface LessonGuideProps {
    moduleIndex: number;
    moduleTitle: string;
    lessonTitle: string;
    guide: GuideSection[];
}

export default function LessonGuide({ moduleIndex, moduleTitle, lessonTitle, guide }: LessonGuideProps) {
    const [expanded, setExpanded] = useState(false);

    const handleDownloadPDF = () => {
        const doc = new jsPDF("p", "mm", "a4");
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - margin * 2;
        let y = margin;

        // ── Helper: check if we need a new page ──
        const checkPage = (needed: number) => {
            if (y + needed > pageHeight - margin) {
                doc.addPage();
                y = margin;
            }
        };

        // ── Header Bar ──
        doc.setFillColor(10, 17, 40); // --background
        doc.rect(0, 0, pageWidth, 45, "F");

        // Gradient accent line
        doc.setFillColor(29, 78, 216); // --primary
        doc.rect(0, 45, pageWidth / 2, 2, "F");
        doc.setFillColor(6, 182, 212); // --accent
        doc.rect(pageWidth / 2, 45, pageWidth / 2, 2, "F");

        // Header text
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("SHIPPAR ACADEMY", margin, 15);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(156, 163, 175); // --text-secondary
        doc.text(`Módulo ${moduleIndex} — ${moduleTitle}`, margin, 22);

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(lessonTitle, margin, 36);

        y = 55;

        // ── Body content ──
        doc.setTextColor(40, 40, 40);

        guide.forEach((section, i) => {
            checkPage(20);

            // Section number + title
            doc.setFillColor(29, 78, 216);
            doc.roundedRect(margin, y - 4, 6, 6, 1, 1, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.setFont("helvetica", "bold");
            doc.text(`${i + 1}`, margin + 2, y);

            doc.setTextColor(29, 78, 216);
            doc.setFontSize(13);
            doc.setFont("helvetica", "bold");
            doc.text(section.title, margin + 10, y + 1);

            y += 8;

            // Divider line
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.3);
            doc.line(margin, y, pageWidth - margin, y);
            y += 6;

            // Section content — word wrap
            doc.setTextColor(60, 60, 60);
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");

            const lines = doc.splitTextToSize(section.content, contentWidth);
            lines.forEach((line: string) => {
                checkPage(6);
                doc.text(line, margin, y);
                y += 5.5;
            });

            y += 8;
        });

        // ── Footer ──
        const totalPages = doc.getNumberOfPages();
        for (let p = 1; p <= totalPages; p++) {
            doc.setPage(p);

            // Footer line
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.3);
            doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

            // Footer text
            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(150, 150, 150);
            doc.text(
                "Shippar Academy — shippar.com.ar — Material exclusivo para alumnos",
                margin,
                pageHeight - 10
            );
            doc.text(
                `Página ${p} de ${totalPages}`,
                pageWidth - margin - 25,
                pageHeight - 10
            );
        }

        // ── Save ──
        const fileName = `Shippar_Academy_Modulo${moduleIndex}_${lessonTitle.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
        doc.save(fileName);
    };

    return (
        <div className="glass-card overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-xl">📘</span>
                    <div className="text-left">
                        <h3 className="text-white font-bold text-sm">Guía Completa del Módulo</h3>
                        <p className="text-text-muted text-xs mt-0.5">
                            {guide.length} secciones • Click para {expanded ? "cerrar" : "expandir"}
                        </p>
                    </div>
                </div>
                <svg
                    className={`w-5 h-5 text-text-muted transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Expandable Content */}
            {expanded && (
                <div className="border-t border-border-dark animate-slide-up">
                    <div className="max-h-[60vh] overflow-y-auto p-5 space-y-5">
                        {guide.map((section, i) => (
                            <div key={i}>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
                                        <span className="text-primary text-[10px] font-bold">{i + 1}</span>
                                    </div>
                                    <h4 className="text-white font-semibold text-sm">{section.title}</h4>
                                </div>
                                <p className="text-text-secondary text-sm leading-relaxed ml-7 whitespace-pre-line">
                                    {section.content}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Download Button */}
                    <div className="p-4 border-t border-border-dark">
                        <button
                            onClick={handleDownloadPDF}
                            className="w-full py-3 rounded-xl bg-primary/15 border border-primary/25 text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/25 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Descargar PDF
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
