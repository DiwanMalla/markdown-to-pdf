declare module "html2pdf.js" {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      allowTaint?: boolean;
      backgroundColor?: string | null;
      height?: number;
      width?: number;
      x?: number;
      y?: number;
      scrollX?: number;
      scrollY?: number;
      windowWidth?: number;
      windowHeight?: number;
      [key: string]: unknown;
    };
    jsPDF?: {
      unit?: string;
      format?: string | number[];
      orientation?: "portrait" | "landscape" | "p" | "l";
      putOnlyUsedFonts?: boolean;
      floatPrecision?: number;
      userUnit?: number;
      [key: string]: unknown;
    };
    enableLinks?: boolean;
    pagebreak?: {
      mode?: string | string[];
      before?: string | string[];
      after?: string | string[];
      avoid?: string | string[];
    };
    [key: string]: unknown;
  }

  interface Html2PdfWorker {
    from(element: HTMLElement): Html2PdfWorker;
    set(options: Html2PdfOptions): Html2PdfWorker;
    save(filename?: string): Promise<void>;
    output(
      type: string,
      options?: Record<string, unknown>
    ): Blob | string | ArrayBuffer;
    outputPdf(type?: string): Blob | string | ArrayBuffer;
    then(
      onFulfilled?: (
        value: Html2PdfWorker
      ) => Html2PdfWorker | Promise<Html2PdfWorker>,
      onRejected?: (reason: Error) => Html2PdfWorker | Promise<Html2PdfWorker>
    ): Promise<Html2PdfWorker>;
  }

  function html2pdf(): Html2PdfWorker;
  function html2pdf(element: HTMLElement): Html2PdfWorker;
  function html2pdf(
    element: HTMLElement,
    options: Html2PdfOptions
  ): Promise<void>;

  export default html2pdf;
}
