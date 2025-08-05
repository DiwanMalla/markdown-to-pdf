declare module "html2pdf.js" {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    html2canvas?: {
      scale?: number;
      [key: string]:;
    };
    jsPDF?: {
      unit?: string;
      format?: string;
      orientation?: string;
      [key: string]: any;
    };
    [key: string]: any;
  }

  function html2pdf(element: HTMLElement, options?: Html2PdfOptions): any;
  export default html2pdf;
}
