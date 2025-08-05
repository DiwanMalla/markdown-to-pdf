"use client"; // This file uses client-side features like Monaco Editor and DOM manipulation
// Helper to ensure marked.parse returns string synchronously
function safeMarkedParse(md: string): string {
  const result = marked.parse(md);
  if (typeof result === "string") return result;
  // If Promise (should not happen in v15+ without callback), fallback to empty string
  return "";
}

import { useState, useRef, useEffect } from "react";
// Developer info for modal
const DEVELOPER_INFO = {
  name: "Diwan Malla",
  title: "Full-Stack Developer",
  website: "https://www.diwanmalla.com.au",
  location: "Sydney, Australia",
  techStack: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Prisma",
    "Node.js",
    "MongoDB",
    "PostgreSQL",
  ],
  portfolio: "https://www.diwanmalla.com.au",
  linkedin: "https://www.linkedin.com/in/diwan-malla/",
  github: "https://github.com/diwanmalla",
  email: "diwanmalla@gmail.com",
};
import { renderToStaticMarkup } from "react-dom/server";
import * as monaco from "monaco-editor";
import { useLayoutEffect } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import "github-markdown-css/github-markdown-light.css";

export default function Home() {
  const [markdown, setMarkdown] = useState<string>(
    "# My Awesome Document\n\nWelcome to the **Markdown to PDF** converter!\n\n## Features\n- Live preview\n- Easy editing\n- Beautiful PDFs\n\nStart typing your markdown here..."
  );
  const [showDevModal, setShowDevModal] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoInstance = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );

  useLayoutEffect(() => {
    if (editorRef.current && !monacoInstance.current) {
      monacoInstance.current = monaco.editor.create(editorRef.current, {
        value: markdown,
        language: "markdown",
        theme: "vs-light",
        fontSize: 15,
        minimap: { enabled: false },
        wordWrap: "on",
        automaticLayout: true,
      });
      monacoInstance.current.onDidChangeModelContent(() => {
        setMarkdown(monacoInstance.current!.getValue());
      });
    }
    return () => {
      monacoInstance.current?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Handle PDF download
  const handleDownloadPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const filename = generateFilename(markdown);
    const htmlString = `<div class='markdown-body'>${DOMPurify.sanitize(
      safeMarkedParse(markdown)
    )}</div>`;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    document.body.appendChild(tempDiv);
    await html2pdf(tempDiv, {
      margin: 0.5,
      filename: `${filename}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    });
    document.body.removeChild(tempDiv);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MD</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Markdown to PDF
              </h1>
              <p className="text-xs text-gray-500">Live preview & export</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="group relative px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={() => setShowDevModal(true)}
            >
              <span className="flex items-center gap-2">
                👨‍💻 Developer
              </span>
            </button>
            <button
              className="group relative px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={handleDownloadPDF}
            >
              <span className="flex items-center gap-2">
                📄 Download PDF
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Developer Modal */}
      {showDevModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setShowDevModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex flex-col items-center gap-2">
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full mb-2">
                Open to work: Internship Full Stack Developer
              </span>
              <h2 className="text-xl font-bold text-gray-900">
                {DEVELOPER_INFO.name}
              </h2>
              <p className="text-sm text-gray-600">{DEVELOPER_INFO.title}</p>
              <p className="text-xs text-gray-500 mb-2">
                {DEVELOPER_INFO.location}
              </p>
              <a
                href={DEVELOPER_INFO.website}
                className="text-blue-600 hover:underline text-sm mb-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                {DEVELOPER_INFO.website}
              </a>
              <div className="flex flex-wrap gap-2 justify-center my-2">
                {DEVELOPER_INFO.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-1 mt-2 w-full">
                <a
                  href={DEVELOPER_INFO.portfolio}
                  className="text-blue-700 hover:underline text-xs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Portfolio
                </a>
                <a
                  href={DEVELOPER_INFO.linkedin}
                  className="text-blue-700 hover:underline text-xs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  href={DEVELOPER_INFO.github}
                  className="text-blue-700 hover:underline text-xs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <a
                  href={`mailto:${DEVELOPER_INFO.email}`}
                  className="text-blue-700 hover:underline text-xs"
                >
                  {DEVELOPER_INFO.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <div
              ref={editorRef}
              className="w-full h-full min-h-[400px]"
              style={{ minHeight: 400 }}
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
              className="flex-1 p-4 overflow-auto border-t border-gray-300 markdown-body bg-white"
              ref={previewRef}
              tabIndex={0}
              aria-label="Markdown preview"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(safeMarkedParse(markdown)),
              }}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
