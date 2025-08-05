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
    const lines = content.split("\n").filter((line) => line.trim());
    if (lines.length === 0) return "document";

    const headingLine = lines.find((line) => line.match(/^#{1,6}\s+/));
    if (headingLine) {
      return (
        headingLine
          .replace(/^#{1,6}\s+/, "")
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .replace(/\s+/g, "-")
          .slice(0, 50) || "document"
      );
    }

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

  // Handle PDF download
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">
            Markdown Live Preview
          </h1>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
            onClick={handleDownloadPDF}
          >
            Download PDF
          </button>
        </div>
      </header>

      {/* Two Column Layout */}
      <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 py-6 gap-4">
        {/* Editor Column */}
        <section className="w-full md:w-1/2 flex flex-col">
          <div className="bg-white rounded shadow flex-1 flex flex-col">
            <div className="bg-gray-200 px-4 py-2 rounded-t">
              <h2 className="text-sm font-semibold text-gray-700">
                Markdown Editor
              </h2>
            </div>
            <textarea
              className="w-full h-full p-4 font-mono text-sm border-t border-gray-300 focus:outline-none focus:border-blue-500 resize-none"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Start typing your markdown here..."
              aria-label="Markdown input"
              spellCheck={true}
              autoFocus
            />
          </div>
        </section>

        {/* Preview Column */}
        <section className="w-full md:w-1/2 flex flex-col">
          <div className="bg-white rounded shadow flex-1 flex flex-col">
            <div className="bg-gray-200 px-4 py-2 rounded-t">
              <h2 className="text-sm font-semibold text-gray-700">
                Live Preview
              </h2>
            </div>
            <div
              className="flex-1 p-4 overflow-auto border-t border-gray-300 prose max-w-none"
              ref={previewRef}
              tabIndex={0}
              aria-label="Markdown preview"
            >
              <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
