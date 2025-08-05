"use client"; // This file uses client-side features like Monaco Editor and DOM manipulation

import { useState, useRef, useEffect } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import "github-markdown-css/github-markdown-light.css";

// Helper to ensure marked.parse returns string synchronously
function safeMarkedParse(md: string): string {
  const result = marked.parse(md);
  if (typeof result === "string") return result;
  // If Promise (should not happen in v15+ without callback), fallback to empty string
  return "";
}

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

export default function Home() {
  const [markdown, setMarkdown] = useState<string>(
    "# My Awesome Document\n\nWelcome to the **Markdown to PDF** converter!\n\n## Features\n- Live preview\n- Easy editing\n- Beautiful PDFs\n\nStart typing your markdown here..."
  );
  const [showDevModal, setShowDevModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [isClient, setIsClient] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoInstance = useRef<unknown>(null);

  // Ensure we're on client side before initializing Monaco
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !editorRef.current || monacoInstance.current) return;

    const initializeMonaco = async () => {
      try {
        const monaco = await import("monaco-editor");
        
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
      } catch (error) {
        console.error("Failed to load Monaco Editor:", error);
      }
    };

    initializeMonaco();

    return () => {
      monacoInstance.current?.dispose();
    };
  }, [isClient, markdown]);

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
      {/* Fully Responsive Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">
                MD
              </span>
            </div>
            <div>
              <h1 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                <span className="hidden sm:inline">Markdown to PDF</span>
                <span className="sm:hidden">MD to PDF</span>
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Live preview & export
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            <button
              className="group relative px-2 sm:px-3 md:px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm"
              onClick={() => setShowDevModal(true)}
            >
              <span className="flex items-center gap-1 sm:gap-2">
                <span className="text-sm">👨‍💻</span>
                <span className="hidden sm:inline">Developer</span>
              </span>
            </button>
            <button
              className="group relative px-2 sm:px-3 md:px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm"
              onClick={handleDownloadPDF}
            >
              <span className="flex items-center gap-1 sm:gap-2">
                <span className="text-sm">📄</span>
                <span className="hidden xs:inline">PDF</span>
                <span className="hidden sm:inline">Download PDF</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Fully Responsive Developer Modal */}
      {showDevModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-4 sm:p-6 lg:p-8 relative transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors text-lg"
              onClick={() => setShowDevModal(false)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="text-center space-y-3 sm:space-y-4">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-xs sm:text-sm font-semibold border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="hidden sm:inline">
                  Open to work: Internship Full Stack Developer
                </span>
                <span className="sm:hidden">Open to work: Full Stack Dev</span>
              </div>

              {/* Avatar and Name */}
              <div className="space-y-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white">
                  {DEVELOPER_INFO.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {DEVELOPER_INFO.name}
                </h2>
                <p className="text-base sm:text-lg text-gray-600">
                  {DEVELOPER_INFO.title}
                </p>
                <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                  📍 {DEVELOPER_INFO.location}
                </p>
              </div>

              {/* Website Link */}
              <a
                href={DEVELOPER_INFO.website}
                className="inline-block text-blue-600 hover:text-blue-700 font-medium underline decoration-2 underline-offset-2 text-sm sm:text-base"
                target="_blank"
                rel="noopener noreferrer"
              >
                🌐{" "}
                <span className="hidden xs:inline">
                  {DEVELOPER_INFO.website}
                </span>
                <span className="xs:hidden">Portfolio</span>
              </a>

              {/* Tech Stack */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                  {DEVELOPER_INFO.techStack.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-2 sm:px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-xs font-medium border border-gray-300 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 transition-all duration-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Links */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-4">
                <a
                  href={DEVELOPER_INFO.portfolio}
                  className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium text-xs sm:text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-sm">💼</span>
                  <span className="hidden xs:inline">Portfolio</span>
                  <span className="xs:hidden">Site</span>
                </a>
                <a
                  href={DEVELOPER_INFO.linkedin}
                  className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium text-xs sm:text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-sm">💼</span>
                  <span>LinkedIn</span>
                </a>
                <a
                  href={DEVELOPER_INFO.github}
                  className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg hover:from-gray-900 hover:to-black transition-all duration-200 font-medium text-xs sm:text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-sm">🔗</span>
                  <span>GitHub</span>
                </a>
                <a
                  href={`mailto:${DEVELOPER_INFO.email}`}
                  className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-medium text-xs sm:text-sm"
                >
                  <span className="text-sm">✉️</span>
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fully Responsive Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 lg:py-8">
        {/* Mobile Tab Switcher */}
        <div className="lg:hidden mb-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === "editor"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("editor")}
            >
              ✏️ Editor
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === "preview"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("preview")}
            >
              👁️ Preview
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 h-[calc(100vh-180px)] sm:h-[calc(100vh-160px)] lg:h-[calc(100vh-140px)]">
          {/* Enhanced Editor Column */}
          <div
            className={`group ${
              activeTab === "editor" ? "block" : "hidden"
            } lg:block`}
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 h-full flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200/50 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex gap-1 sm:gap-1.5">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <h2 className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1 sm:gap-2">
                    <span className="text-sm">✏️</span>
                    <span className="hidden xs:inline">Markdown</span>
                    <span>Editor</span>
                  </h2>
                </div>
                <div className="text-xs text-gray-500 font-mono hidden sm:block">
                  Lines: {markdown.split("\n").length}
                </div>
                <div className="text-xs text-gray-500 font-mono sm:hidden">
                  {markdown.split("\n").length}
                </div>
              </div>
              <div className="flex-1 relative">
                {isClient ? (
                  <div ref={editorRef} className="absolute inset-0" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <div className="text-gray-500 text-sm">Loading editor...</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Preview Column */}
          <div
            className={`group ${
              activeTab === "preview" ? "block" : "hidden"
            } lg:block`}
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 h-full flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200/50 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex gap-1 sm:gap-1.5">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <h2 className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1 sm:gap-2">
                    <span className="text-sm">👁️</span>
                    <span className="hidden xs:inline">Live</span>
                    <span>Preview</span>
                  </h2>
                </div>
                <div className="text-xs text-gray-500 font-mono hidden sm:block overflow-hidden text-ellipsis whitespace-nowrap max-w-32 md:max-w-none">
                  {generateFilename(markdown)}.pdf
                </div>
                <div className="text-xs text-gray-500 font-mono sm:hidden">
                  PDF
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                <div
                  className="p-3 sm:p-4 lg:p-6 markdown-body bg-white/80 backdrop-blur-sm min-h-full text-sm sm:text-base"
                  ref={previewRef}
                  tabIndex={0}
                  aria-label="Markdown preview"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(safeMarkedParse(markdown)),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
