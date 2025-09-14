import jsPDF from 'jspdf';
import { ContractDraftResponse } from './enhancedContractApi';

export interface PDFOptions {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  fontSize?: number;
  lineHeight?: number;
  margins?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export class PDFGenerator {
  private options: PDFOptions;

  constructor(options: PDFOptions = {}) {
    this.options = {
      fontSize: 12,
      lineHeight: 1.5,
      margins: { top: 30, bottom: 30, left: 30, right: 30 },
      ...options
    };
  }

  private createDocument(): jsPDF {
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Set document properties
    doc.setProperties({
      title: this.options.title || 'Contract Document',
      author: this.options.author || 'My Jurist',
      subject: this.options.subject || 'Legal Contract',
      keywords: this.options.keywords?.join(', ') || 'legal, contract, myjurist',
      creator: 'My Jurist Contract Generator',
      producer: 'jsPDF'
    });

    return doc;
  }

  private addHeader(doc: jsPDF, title: string, subtitle?: string): number {
    let yPosition = this.options.margins!.top;

    // Add company logo/header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    
    const companyText = 'My Jurist';
    const companyWidth = doc.getTextWidth(companyText);
    const companyX = (doc.internal.pageSize.getWidth() - companyWidth) / 2;
    doc.text(companyText, companyX, yPosition);
    yPosition += 10;

    // Add title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(52, 73, 94);
    
    const titleWidth = doc.getTextWidth(title);
    const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
    doc.text(title, titleX, yPosition);
    yPosition += 8;

    // Add subtitle if provided
    if (subtitle) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(127, 140, 141);
      
      const subtitleWidth = doc.getTextWidth(subtitle);
      const subtitleX = (doc.internal.pageSize.getWidth() - subtitleWidth) / 2;
      doc.text(subtitle, subtitleX, yPosition);
      yPosition += 10;
    }

    // Add separator line
    const lineY = yPosition + 5;
    doc.setDrawColor(189, 195, 199);
    doc.setLineWidth(0.5);
    doc.line(
      this.options.margins!.left,
      lineY,
      doc.internal.pageSize.getWidth() - this.options.margins!.right,
      lineY
    );
    yPosition += 15;

    return yPosition;
  }

  private addMetadata(doc: jsPDF, contract: ContractDraftResponse, startY: number): number {
    let yPosition = startY;

    const metadata = [
      { label: 'Contract Type:', value: contract.template_type.replace('_', ' ').toUpperCase() },
      { label: 'Generated:', value: new Date(contract.created_at).toLocaleDateString() },
      { label: 'Contract ID:', value: contract.contract_id },
      { label: 'Status:', value: contract.status }
    ];

    // Add metadata section header
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text('Document Information', this.options.margins!.left, yPosition);
    yPosition += 8;

    // Add metadata items
    doc.setFontSize(10);
    metadata.forEach((item) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(52, 73, 94);
      doc.text(item.label, this.options.margins!.left, yPosition);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(44, 62, 80);
      doc.text(item.value, this.options.margins!.left + 35, yPosition);
      yPosition += 5;
    });

    yPosition += 10;
    return yPosition;
  }

  private addContent(doc: jsPDF, content: string, startY: number): number {
    let yPosition = startY;
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = doc.internal.pageSize.getWidth() - this.options.margins!.left - this.options.margins!.right;

    // Split content into sections
    const sections = content.split(/\n\s*\n/);
    
    sections.forEach((section) => {
      if (section.trim() === '') return;

      // Check if this is a heading
      const isHeading = /^[A-Z\s\d]+$/.test(section.trim()) || /^\d+\./.test(section.trim());
      
      if (isHeading) {
        // Check if we need a new page
        if (yPosition > pageHeight - this.options.margins!.bottom - 20) {
          doc.addPage();
          yPosition = this.options.margins!.top;
        }

        // Add heading
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(44, 62, 80);
        doc.text(section.trim(), this.options.margins!.left, yPosition);
        yPosition += 8;
      } else {
        // Handle regular paragraph text
        const cleanText = section.trim().replace(/\n/g, ' ');
        
        // Split text into lines that fit the page width
        const lines = doc.splitTextToSize(cleanText, contentWidth);
        
        // Check if we need a new page
        const requiredHeight = lines.length * 6;
        if (yPosition + requiredHeight > pageHeight - this.options.margins!.bottom) {
          doc.addPage();
          yPosition = this.options.margins!.top;
        }
        
        // Add text lines
        doc.setFontSize(this.options.fontSize!);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(44, 62, 80);
        
        lines.forEach((line) => {
          doc.text(line, this.options.margins!.left, yPosition);
          yPosition += 6;
        });
        
        yPosition += 3; // Add space between paragraphs
      }
    });

    return yPosition;
  }

  private addInputDataSummary(doc: jsPDF, contract: ContractDraftResponse, startY: number): number {
    if (Object.keys(contract.input_data).length === 0) return startY;

    let yPosition = startY;
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = doc.internal.pageSize.getWidth() - this.options.margins!.left - this.options.margins!.right;

    // Check if we need a new page
    if (yPosition > pageHeight - this.options.margins!.bottom - 100) {
      doc.addPage();
      yPosition = this.options.margins!.top;
    }

    // Add section header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text('Input Data Summary', this.options.margins!.left, yPosition);
    yPosition += 8;

    // Add description
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(127, 140, 141);
    doc.text('The following information was provided to generate this contract:', this.options.margins!.left, yPosition);
    yPosition += 8;

    // Add input data items
    Object.entries(contract.input_data).forEach(([key, value]) => {
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const valueStr = typeof value === 'string' ? value : JSON.stringify(value);

      // Check if we need a new page
      if (yPosition > pageHeight - this.options.margins!.bottom - 20) {
        doc.addPage();
        yPosition = this.options.margins!.top;
      }

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(52, 73, 94);
      doc.text(`${label}:`, this.options.margins!.left, yPosition);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(44, 62, 80);
      
      // Handle long values by wrapping text
      const valueLines = doc.splitTextToSize(valueStr, contentWidth - 40);
      valueLines.forEach((line) => {
        doc.text(line, this.options.margins!.left + 40, yPosition);
        yPosition += 5;
      });
      
      yPosition += 3;
    });

    return yPosition;
  }

  private addFooter(doc: jsPDF): void {
    const footerText = 'Generated by My Jurist - Professional Legal Contract Generator';
    const pageHeight = doc.internal.pageSize.getHeight();
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(127, 140, 141);
    
    const footerWidth = doc.getTextWidth(footerText);
    const footerX = (doc.internal.pageSize.getWidth() - footerWidth) / 2;
    doc.text(footerText, footerX, pageHeight - 15);
  }

  public generateContractPDF(contract: ContractDraftResponse): jsPDF {
    const doc = this.createDocument();
    
    // Add header
    let yPosition = this.addHeader(doc, contract.title, contract.description);
    
    // Add metadata
    yPosition = this.addMetadata(doc, contract, yPosition);
    
    // Add content
    yPosition = this.addContent(doc, contract.generated_content, yPosition);
    
    // Add input data summary
    yPosition = this.addInputDataSummary(doc, contract, yPosition);
    
    // Add footer to current page
    this.addFooter(doc);
    
    return doc;
  }

  public downloadPDF(contract: ContractDraftResponse, filename?: string): void {
    const doc = this.generateContractPDF(contract);
    const defaultFilename = `${contract.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename || defaultFilename);
  }

  public getPDFAsBlob(contract: ContractDraftResponse): Blob {
    const doc = this.generateContractPDF(contract);
    return doc.output('blob');
  }

  public getPDFAsDataURL(contract: ContractDraftResponse): string {
    const doc = this.generateContractPDF(contract);
    return doc.output('dataurlstring');
  }
}

// Factory function to create PDF generator
export const createPDFGenerator = (options?: PDFOptions) => {
  return new PDFGenerator(options);
}; 