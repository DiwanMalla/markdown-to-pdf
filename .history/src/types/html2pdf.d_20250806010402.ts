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
      [key: string]: any;
    };
    jsPDF?: {
      unit?: string;
      format?: string | number[];
      orientation?: "portrait" | "landscape" | "p" | "l";
      putOnlyUsedFonts?: boolean;
      floatPrecision?: number;
      userUnit?: number;
      [key: string]: any;
    };
    enableLinks?: boolean;
    pagebreak?: {
      mode?: string | string[];
      before?: string | string[];
      after?: string | string[];
      avoid?: string | string[];
    };
    [key: string]: any;
  }

  interface Html2PdfWorker {
    from(element: HTMLElement): Html2PdfWorker;
    set(options: Html2PdfOptions): Html2PdfWorker;
    save(filename?: string): Promise<void>;
    output(type: string, options?: any): any;
    outputPdf(type?: string): any;
    then(onFulfilled?: (value: any) => any, onRejected?: (reason: any) => any): Promise<any>;
  }

  function html2pdf(): Html2PdfWorker;
  function html2pdf(element: HTMLElement): Html2PdfWorker;
  function html2pdf(element: HTMLElement, options: Html2PdfOptions): Promise<void>;
  
  export default html2pdf;
}
