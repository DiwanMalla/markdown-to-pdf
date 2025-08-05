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
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length === 0) return 'document';
    
    // Look for first heading (# or ##)
    const headingLine = lines.find(line => line.match(/^#{1,6}\s+/));
    if (headingLine) {
      return headingLine
        .replace(/^#{1,6}\s+/, '') // Remove heading markers
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remove special chars
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .slice(0, 50) // Limit length
        || 'document';
    }
    
    // Use first line if no heading found
    return lines[0]
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 50)
      || 'document';
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
          <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
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
