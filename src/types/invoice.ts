export interface InvoiceData {
  vendorName: string;
  gstin: string;
  invoiceNumber: string;
  invoiceDate: string; // DD/MM/YYYY format
  currency: string;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  taxAmount: number;
  totalAmount: number;
  lineItems: Array<{
    description: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}