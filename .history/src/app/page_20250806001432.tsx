"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [markdown, setMarkdown] = useState<string>(
    "# My Awesome Document\n\nWelcome to the **Markdown to PDF** converter!\n\n## Features\n- Live preview\n- Easy editing\n- Beautiful PDFs\n\nStart typing your markdown here..."
  );
  const [renderedHtml, setRenderedHtml] = useState<string>("");
  const previewRef = useRef<HTMLDivElement>(null);

  // Generate filename from markdown content
  const generateFilename = (content: string): string => {
    // Extract first heading or use first line
    const lines = content.split("\n").filter((line) => line.trim());
    if (lines.length === 0) return "document";

    // Look for first heading (# or ##)
    const headingLine = lines.find((line) => line.match(/^#{1,6}\s+/));
    if (headingLine) {
      return (
        headingLine
          .replace(/^#{1,6}\s+/, "") // Remove heading markers
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "") // Remove special chars
          .replace(/\s+/g, "-") // Replace spaces with hyphens
          .slice(0, 50) || // Limit length
        "document"
      );
    }

    // Use first line if no heading found
    return (
      lines[0]
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 50) || "document"
    );
  };

  // Dynamically import and render markdown
  useEffect(() => {
    const renderMarkdown = async () => {
      const { marked } = await import("marked");
      const html = await marked(markdown);
      setRenderedHtml(html);
    };
    renderMarkdown();
  }, [markdown]);

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    const html2pdf = (await import("html2pdf.js")).default;
    const filename = generateFilename(markdown);
    html2pdf(previewRef.current, {
      margin: 0.5,
      filename: `${filename}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 flex flex-col">
      {/* Sticky Header with Download Button */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <span role="img" aria-label="Markdown">📝</span> Markdown to PDF
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Write markdown, see live preview, download beautiful PDFs
            </p>
          </div>
          <div className="flex flex-col items-end">
            <button
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={handleDownloadPDF}
            >
              <span role="img" aria-label="Download">📄</span> Download PDF
            </button>
            <span className="text-[11px] text-gray-500 mt-1 font-mono select-all">
              {generateFilename(markdown)}.pdf
            </span>
          </div>
        </div>
      </header>

      {/* Responsive Two Column Layout */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-2 sm:px-6 py-6 gap-6">
        {/* Editor Column */}
        <section className="w-full lg:w-1/2 flex flex-col">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 flex-1 flex flex-col min-h-[400px]">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 rounded-t-2xl flex items-center gap-2">
              <span className="text-lg">✏️</span>
              <h2 className="text-base font-semibold text-gray-900">Markdown Editor</h2>
            </div>
            <div className="flex-1 p-4 flex flex-col">
              <textarea
                className="w-full h-full min-h-[300px] p-4 border border-gray-300 rounded-lg font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50 shadow-inner"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Start typing your markdown here..."
                aria-label="Markdown input"
                spellCheck={true}
                autoFocus
              />
            </div>
          </div>
        </section>

        {/* Preview Column */}
        <section className="w-full lg:w-1/2 flex flex-col">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 flex-1 flex flex-col min-h-[400px]">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 rounded-t-2xl flex items-center gap-2">
              <span className="text-lg">👁️</span>
              <h2 className="text-base font-semibold text-gray-900">Live Preview</h2>
            </div>
            <div className="flex-1 p-4 flex flex-col">
              <div
                className="h-full min-h-[300px] overflow-auto border border-gray-300 rounded-lg bg-white p-6 prose prose-slate max-w-none shadow-inner"
                ref={previewRef}
                tabIndex={0}
                aria-label="Markdown preview"
              >
                {/* eslint-disable-next-line react/no-danger */}
                <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
