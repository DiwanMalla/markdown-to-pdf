"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [markdown, setMarkdown] = useState<string>(
    "# Hello, Markdown!\nType your markdown on the left."
  );
  const [renderedHtml, setRenderedHtml] = useState<string>("");
  const previewRef = useRef<HTMLDivElement>(null);

  // Dynamically import and render markdown
  useEffect(() => {
    const renderMarkdown = async () => {
      const { marked } = await import("marked");
      const html = marked(markdown);
      setRenderedHtml(html);
    };
    renderMarkdown();
  }, [markdown]);

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    const html2pdf = (await import("html2pdf.js")).default;
    html2pdf(previewRef.current, {
      margin: 0.5,
      filename: "markdown.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-2">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Markdown to PDF Converter
      </h1>
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 bg-white rounded-lg shadow-lg p-6">
        <textarea
          className="w-full md:w-1/2 h-96 p-4 border border-gray-200 rounded-lg font-mono text-base focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          aria-label="Markdown input"
        />
        <div
          className="w-full md:w-1/2 h-96 overflow-auto border border-gray-200 rounded-lg bg-gray-100 p-4 prose prose-slate"
          ref={previewRef}
        >
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown() }} />
        </div>
      </div>
      <button
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors"
        onClick={handleDownloadPDF}
      >
        Download as PDF
      </button>
      <p className="mt-4 text-gray-500 text-sm">
        Live preview updates as you type. PDF will match the preview.
      </p>
    </div>
  );
}
