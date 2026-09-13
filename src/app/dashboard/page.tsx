'use client';

import { useState, useCallback, useRef, useEffect, ChangeEvent, DragEvent, RefObject } from 'react';

// Interfaces
interface LineItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface InvoiceData {
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
  lineItems: LineItem[];
}

// Custom hook for state management
function useInvoiceState() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [activeTab, setActiveTab] = useState<'summary' | 'lineItems'>('summary');
  const [editedLineItems, setEditedLineItems] = useState<LineItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast timeout
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<{ base64Data: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        const mimeType = file.type || 'image/png';
        resolve({ base64Data, mimeType });
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Process file
  const processFile = async (file: File) => {
    setError(null);
    setIsProcessing(true);
    setUploadedFileName(file.name);
    setUploadedFilePreview(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedFilePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const { base64Data, mimeType } = await fileToBase64(file);

      const response = await fetch('/api/parse-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Data, mimeType }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse document');
      }

      if (data.success) {
        setInvoiceData(data.data);
        setEditedLineItems(data.data.lineItems);
        setToastMessage('Invoice processed successfully!');
        setToastType('success');
        setShowToast(true);
      } else {
        throw new Error(data.error || 'Unknown error from API');
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      setToastMessage('Failed to process invoice');
      setToastType('error');
      setShowToast(true);
      setInvoiceData(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle file upload from input
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setError('Please upload an image (PNG, JPG) or PDF file');
      return;
    }

    await processFile(file);

    // Reset input value
    e.target.value = '';
  };

  // Handle file drop
  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setError('Please upload an image (PNG, JPG) or PDF file');
      return;
    }

    await processFile(file);
  };

  // Handle drag over
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Toggle editing mode for line items
  const toggleEditing = useCallback(() => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Enable editing for all items
      setEditedLineItems(invoiceData?.lineItems ?? []);
    } else {
      // Disable editing and save changes
      setEditedLineItems(prev => prev.map(item => ({ ...item })));
      // Update the main invoiceData with edited line items
      setInvoiceData(prev => prev ? { ...prev, lineItems: [...prev.lineItems] } : null);
    }
  }, [isEditing, invoiceData?.lineItems]);

  // Handle input change in editing mode
  const handleLineItemChange = (index: number, field: keyof LineItem, value: string) => {
    setEditedLineItems(prev => {
      if (index < 0 || index >= prev.length) return prev;
      const newItems = [...prev];
      if (field === 'quantity' || field === 'price' || field === 'total') {
        newItems[index] = { ...newItems[index], [field]: parseFloat(value) || 0 };
      } else {
        newItems[index] = { ...newItems[index], [field]: value };
      }
      return newItems;
    });
  };

  // Add a new line item
  const addLineItem = useCallback(() => {
    setEditedLineItems(prev => [
      ...prev,
      {
        description: '',
        quantity: 0,
        price: 0,
        total: 0,
      },
    ]);
  }, []);

  // Delete a line item
  const deleteLineItem = (index: number) => {
    setEditedLineItems(prev => prev.filter((_, i) => i !== index));
  };

  // Save edited line items to invoiceData
  const saveLineItems = useCallback(() => {
    setInvoiceData(prev => prev ? { ...prev, lineItems: [...editedLineItems] } : null);
    setIsEditing(true); // Toggle back to view mode
  }, [editedLineItems]);

  // Export to Excel
  const exportToExcel = useCallback(() => {
    if (!invoiceData) return;

    try {
      // Prepare data for worksheet
      const wsData: any[][] = [
        ['Vendor Name', invoiceData.vendorName],
        ['GSTIN', invoiceData.gstin],
        ['Invoice Number', invoiceData.invoiceNumber],
        ['Currency', invoiceData.currency],
        ['Invoice Date', invoiceData.invoiceDate],
        ['Subtotal', invoiceData.subtotal],
        ['CGST', invoiceData.cgst],
        ['SGST', invoiceData.sgst],
        ['IGST', invoiceData.igst],
        ['Tax Amount', invoiceData.taxAmount],
        ['Total Amount', invoiceData.totalAmount],
        [], // Empty row
        ['Line Items'],
        ['Description', 'Quantity', 'Unit Price', 'Total'],
      ];

      // Add line items
      invoiceData.lineItems.forEach((item: LineItem) => {
        wsData.push([item.description, item.quantity, item.price, item.total]);
      });

      // Use require for xlsx to avoid dynamic import issues in Next.js
      // Note: In a real app, we would need to install xlsx and handle it properly.
      // For now, we'll assume it's available.
      const XLSX = require('xlsx');
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Invoice');

      // Generate buffer and download
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_${invoiceData.invoiceNumber || Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setToastMessage('Exported to Excel successfully!');
      setToastType('success');
      setShowToast(true);
    } catch (err) {
      console.error('Excel export error:', err);
      setToastMessage('Export failed');
      setToastType('error');
      setShowToast(true);
    }
  }, [invoiceData, editedLineItems]); // Note: We should use invoiceData.lineItems, but we are using editedLineItems for preview? We'll use invoiceData for export.

  // Copy JSON to clipboard
  const copyJSON = useCallback(() => {
    if (!invoiceData) return;

    navigator.clipboard
      .writeText(JSON.stringify(invoiceData, null, 2))
      .then(() => {
        setToastMessage('JSON copied to clipboard!');
        setToastType('success');
        setShowToast(true);
      })
      .catch((err) => {
        setToastMessage('Failed to copy JSON');
        setToastType('error');
        setShowToast(true);
      });
  }, [invoiceData]);

  // Get GSTIN status badge
  const getGstinStatus = () => {
    if (!invoiceData?.gstin) return { text: 'Missing', color: 'text-red-400' };
    // Simple GSTIN validation: 15 characters, alphanumeric
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(invoiceData.gstin)
      ? { text: 'Valid', color: 'text-green-400' }
      : { text: 'Invalid', color: 'text-red-400' };
  };

  // Format currency symbol
  const getCurrencySymbol = (currency: string) => {
    switch (currency.toUpperCase()) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      default: return '₹'; // Default to INR
    }
  };

  return {
    invoiceData,
    setInvoiceData,
    isProcessing,
    setIsProcessing,
    error,
    setError,
    showToast,
    setShowToast,
    toastMessage,
    setToastMessage,
    toastType,
    setToastType,
    activeTab,
    setActiveTab,
    editedLineItems,
    setEditedLineItems,
    isEditing,
    setIsEditing,
    uploadedFileName,
    setUploadedFileName,
    uploadedFilePreview,
    setUploadedFilePreview,
    fileInputRef,
    processFile,
    handleFileChange,
    handleDrop,
    handleDragOver,
    toggleEditing,
    handleLineItemChange,
    addLineItem,
    deleteLineItem,
    saveLineItems,
    exportToExcel,
    copyJSON,
    getGstinStatus,
    getCurrencySymbol,
  };
}

// Components
const FileDropZone = ({
  onFileChange,
  onDrop,
  onDragOver,
  fileInputRef,
  isProcessing,
  uploadedFileName,
}: {
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: DragEvent) => Promise<void>;
  onDragOver: (e: DragEvent) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  isProcessing: boolean;
  uploadedFileName: string | null;
}) => {
  return (
    <div
      className="relative z-0 text-center py-12 cursor-pointer"
      onClick={() => fileInputRef.current?.click()}
      onDragOver={onDragOver}
      onDragEnter={onDragOver}
      onDragLeave={onDragOver}
      onDrop={onDrop}
    >
      <div className="relative z-0 flex h-14 w-14 items-center justify-center mb-4 bg-slate-200/50 rounded-lg">
        <svg className="flex-shrink-0 h-6 w-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4a2 2 0 012-2h2.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01-.293.707V14a2 2 0 01-2 2h-3.172a1 1 0 01-.707-.293L7 11V4z"></path>
        </svg>
      </div>
      <h3 className="mb-3 text-slate-500 font-semibold">Drop Invoice Here</h3>
      <p className="text-slate-400 max-w-md">
        Drag & drop your invoice image or PDF, or click to select a file
      </p>
      <div className="mt-4 flex items-center justify-center space-x-3">
        <input
          type="file"
          accept=".png,.jpg,.jpeg,.pdf"
          className="hidden"
          ref={fileInputRef}
          onChange={onFileChange}
        />
        <label
          htmlFor="file-upload"
          className={`flex items-center px-4 py-2 bg-slate-300 text-white text-sm font-medium rounded-lg hover:bg-slate-400 transition-all duration-200 ${
            isProcessing || uploadedFileName ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Browse Files
        </label>
      </div>
    </div>
  );
};

const InvoicePreview = ({
  uploadedFilePreview,
  uploadedFileName,
  isProcessing,
}: {
  uploadedFilePreview: string | null;
  uploadedFileName: string | null;
  isProcessing: boolean;
}) => {
  if (isProcessing && !uploadedFilePreview) {
    return (
      <div className="relative z-0 flex flex-col items-center justify-center py-12">
        <div className="relative z-0 flex h-14 w-14 items-center justify-center mb-4 bg-slate-200/50 rounded-lg animate-pulse">
          <svg className="flex-shrink-0 h-6 w-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path className="animate-spin" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 1118 0z"></path>
          </svg>
        </div>
        <div className="space-y-2 text-center">
          <p className="text-slate-500 font-medium">Processing Invoice...</p>
          <div className="flex items-center space-x-2 text-slate-400">
            <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
            <span>Reading document...</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
            <span>Analyzing with AI...</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
            <span>Extracting line items & totals...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {uploadedFilePreview && uploadedFilePreview.startsWith('data:image') ? (
        <img
          src={uploadedFilePreview}
          alt="Invoice preview"
          className="rounded-xl border border-slate-200/50 max-w-full h-64 object-contain"
        />
      ) : (
        <div className="flex h-64 items-center justify-center bg-slate-100/50 rounded-xl">
          <div className="text-center">
            <svg className="flex-shrink-0 h-8 w-8 mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a2 2 0 110-4m0 0a2 2 0 100-4m-2 4h-2a2 2 0 00-2 2v2a2 2 0 002 2h2zm0 0v2a2 2 0 100 4m0-6a2 2 0 110-4m0 0a2 2 0 100 0-4m-2 4h-2a2 2 0 00-2 2v2a2 2 0 002 2h2z"></path>
            </svg>
            <p className="text-slate-400">{uploadedFileName || 'Document Preview'}</p>
          </div>
        </div>
      )}
    </>
  );
};

const InvoiceSummary = ({
  invoiceData,
  getCurrencySymbol,
}: {
  invoiceData: InvoiceData | null;
  getCurrencySymbol: (currency: string) => string;
}) => {
  if (!invoiceData) return null;

  return (
    <div className="space-y-4">
      {/* Vendor Information */}
      <div className="border-b border-slate-200 pb-3">
        <h3 className="mb-2 text-slate-500 font-semibold">Vendor Information</h3>
        <div className="grid gap-2 sm:grid-cols-2 text-slate-400">
          <div><span className="font-medium">Name:</span> {invoiceData.vendorName}</div>
          <div><span className="font-medium">GSTIN:</span> {invoiceData.gstin}</div>
          <div><span className="font-medium">Invoice #:</span> {invoiceData.invoiceNumber}</div>
          <div><span className="font-medium">Currency:</span> {getCurrencySymbol(invoiceData.currency)}</div>
          <div><span className="font-medium">Date:</span> {invoiceData.invoiceDate}</div>
          <div>
            <span className="font-medium">GST Status:</span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${invoiceData.gstin ? (
              /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(invoiceData.gstin)
                ? 'text-green-400'
                : 'text-red-400'
            ) : 'text-red-400'}`}>
              {invoiceData.gstin ? (
                /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(invoiceData.gstin)
                  ? 'Valid'
                  : 'Invalid'
              ) : 'Missing'}
            </span>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="border-b border-slate-200 pb-3">
        <h3 className="mb-2 text-slate-500 font-semibold">Financial Summary</h3>
        <div className="grid gap-2 sm:grid-cols-3 text-slate-400">
          <div><span className="font-medium">Subtotal:</span> {getCurrencySymbol(invoiceData.currency)} {invoiceData.subtotal.toFixed(2)}</div>
          <div><span className="font-medium">CGST:</span> {getCurrencySymbol(invoiceData.currency)} {invoiceData.cgst.toFixed(2)}</div>
          <div><span className="font-medium">SGST:</span> {getCurrencySymbol(invoiceData.currency)} {invoiceData.sgst.toFixed(2)}</div>
          <div><span className="font-medium">IGST:</span> {getCurrencySymbol(invoiceData.currency)} {invoiceData.igst.toFixed(2)}</div>
          <div><span className="font-medium">Total Tax:</span> {getCurrencySymbol(invoiceData.currency)} {invoiceData.taxAmount.toFixed(2)}</div>
          <div><span className="font-medium">Total Amount:</span> {getCurrencySymbol(invoiceData.currency)} {invoiceData.totalAmount.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

const LineItemTable = ({
  invoiceData,
  editedLineItems,
  isEditing,
  handleLineItemChange,
  addLineItem,
  deleteLineItem,
  saveLineItems,
  getCurrencySymbol,
}: {
  invoiceData: InvoiceData | null;
  editedLineItems: LineItem[];
  isEditing: boolean;
  handleLineItemChange: (index: number, field: keyof LineItem, value: string) => void;
  addLineItem: () => void;
  deleteLineItem: (index: number) => void;
  saveLineItems: () => void;
  getCurrencySymbol: (currency: string) => string;
}) => {
  const lineItems = isEditing ? editedLineItems : invoiceData?.lineItems ?? [];

  return (
    <div className="space-y-4">
      <h3 className="mb-3 text-slate-500 font-semibold">Line Items</h3>
      {lineItems.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">
                  Unit Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">
                  Total
                </th>
                {!isEditing && (
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {lineItems.map((item, index) => (
                <tr key={index} className={`hover:bg-slate-50 transition-all duration-200 ${isEditing ? 'cursor-pointer' : ''}`}>
                  {isEditing ? (
                    <>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                          className="w-full px-3 py-1 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                          className="w-full px-3 py-1 bg-slate-50 border border-slate-200 rounded text-slate border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleLineItemChange(index, 'price', e.target.value)}
                          className="w-full px-3 py-1 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.total}
                          onChange={(e) => handleLineItemChange(index, 'total', e.target.value)}
                          className="w-full px-3 py-1 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3">{item.description}</td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3">{getCurrencySymbol(invoiceData?.currency ?? '')} {Number(item.price).toFixed(2)}</td>
                      <td className="px-4 py-3">{getCurrencySymbol(invoiceData?.currency ?? '')} {Number(item.total).toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => deleteLineItem(index)}
                          className="text-xs text-slate-400 hover:text-slate-500 cursor-pointer"
                        >
                          <svg className="flex-shrink-0 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-slate-400 text-center py-8">No line items found</p>
      )}
      {isEditing && (
        <div className="mt-4 flex items-center space-x-3">
          <button
            onClick={addLineItem}
            className="flex items-center px-4 py-2 bg-slate-300 text-white text-sm font-medium rounded-lg hover:bg-slate-400 transition-all duration-200"
          >
            Add Line Item
          </button>
          <button
            onClick={saveLineItems}
            className="flex items-center px-4 py-2 bg-slate-500 text-white text-sm font-medium rounded-lg hover:bg-slate-600 transition-all duration-200"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

const ActionBar = ({
  invoiceData,
  isProcessing,
  exportToExcel,
  copyJSON,
}: {
  invoiceData: InvoiceData | null;
  isProcessing: boolean;
  exportToExcel: () => void;
  copyJSON: () => void;
}) => {
  return (
    <div className="mt-4 flex flex-col sm:flex-row sm:space-x-3">
      <button
        onClick={exportToExcel}
        disabled={!invoiceData || isProcessing}
        className={`relative z-20 flex-1 px-4 py-2 ${!invoiceData || isProcessing ? 'opacity-50 cursor-not-allowed' : 'bg-slate-500 text-white font-medium hover:bg-slate-600'} rounded-lg transition-all duration-200`}
      >
        Export to Excel
      </button>
      <button
        onClick={copyJSON}
        disabled={!invoiceData || isProcessing}
        className={`relative z-20 flex-1 px-4 py-2 ${!invoiceData || isProcessing ? 'opacity-50 cursor-not-allowed' : 'bg-slate-500 text-white font-medium hover:bg-slate-600'} rounded-lg transition-all duration-200`}
      >
        Copy JSON
      </button>
    </div>
  );
};

const ProcessingOverlay = ({ isProcessing }: { isProcessing: boolean }) => {
  if (!isProcessing) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative z-0 flex flex-col items-center justify-center py-12">
        <div className="relative z-0 flex h-14 w-14 items-center justify-center mb-4 bg-slate-200/50 rounded-lg animate-pulse">
          <svg className="flex-shrink-0 h-6 w-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path className="animate-spin" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 1118 0z"></path>
          </svg>
        </div>
        <div className="space-y-2 text-center text-white">
          <p className="font-medium">Processing Invoice...</p>
          <div className="flex items-center space-x-2 text-slate-400">
            <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
            <span>Reading document...</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
            <span>Analyzing with AI...</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
            <span>Extracting line items & totals...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Toast = ({
  showToast,
  toastMessage,
  toastType,
}: {
  showToast: boolean;
  toastMessage: string;
  toastType: 'success' | 'error';
}) => {
  if (!showToast) return null;

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center space-x-3 rounded-lg px-4 py-2 text-sm font-medium
      ${toastType === 'success' ? 'bg-green-900/70 border border-green-500/50 text-green-400' : 'bg-red-900/70 border border-red-500/50 text-red-400'}
      backdrop-blur-sm shadow-lg transform transition-all duration-300 ease-in-out
      ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-[-100%] opacity-0'}"
    >
      <svg className="flex-shrink-0 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {toastType === 'success' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.314 8.235m2.936-1.504A5.986 5.986 0 005.924 5.095a5.986 5.986 0 00-2.13 4.139a5.972 5.972 0 001.305 7.514l1.003.877"></path>
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
        )}
      </svg>
      <span>{toastMessage}</span>
    </div>
  );
};

// Main Dashboard Component
export default function Dashboard() {
  const state = useInvoiceState();

  const {
    invoiceData,
    isProcessing,
    error,
    showToast,
    toastMessage,
    toastType,
    activeTab,
    editedLineItems,
    isEditing,
    uploadedFileName,
    uploadedFilePreview,
    fileInputRef,
    handleFileChange,
    handleDrop,
    handleDragOver,
    toggleEditing,
    handleLineItemChange,
    addLineItem,
    deleteLineItem,
    saveLineItems,
    exportToExcel,
    copyJSON,
    getGstinStatus,
    getCurrencySymbol,
    setUploadedFileName,
    setUploadedFilePreview,
    setInvoiceData,
    setEditedLineItems,
    setActiveTab,
  } = state;

  return (
    <div className="min-h-[100vh] bg-slate-50 text-slate-800 relative overflow-hidden">
      {/* Animated background - optional, light version */}
      <div className="absolute inset-0 -z-0">
        <div className="relative h-full w-full">
          <svg className="absolute -top-10 left-1/2 -z-0 -translate-x-1/2 w-[30rem] h-[30rem]" fill="none" viewBox="0 0 100 100">
            <path strokeOpacity="0.02" stroke="slate-300" strokeWidth="10" d="M50,50 m-30,0 a30,30 0 1,1 60,0 a30,30 0 1,1 -60,0" />
          </svg>
          <svg className="absolute bottom-10 right-1/2 -z-0 translate-x-1/2 w-[25rem] h-[25rem]" fill="none" viewBox="0 0 100 100">
            <path strokeOpacity="0.01" stroke="slate-400" strokeWidth="8" d="M20,80 Q40,20 60,80 T100,80" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-[100vh] flex-col items-center px-6 py-16">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-slate-600 to-emerald-500 bg-clip-text text-transparent text-3xl md:text-4xl font-bold">
            DocExtract AI Dashboard
          </h1>
          <p className="max-w-xl text-slate-500 text-lg">
            Upload invoices for AI-powered extraction with real-time GST compliance validation
          </p>
        </div>

        {/* Toast Notification */}
        <Toast
          showToast={showToast}
          toastMessage={toastMessage}
          toastType={toastType}
        />

        {/* Error Message */}
        {error && (
          <div className="mb-6 w-full max-w-2xl bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Main Content Split View */}
        {invoiceData ? (
          <div className="w-full max-w-7xl grid gap-8">
            {/* Left Column: Upload Zone & Preview */}
            <div className="relative group bg-slate-50/50 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:border-slate-300/50 p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-slate-500/10">
              <div className="absolute inset-0 -z-0 rounded-2xl bg-gradient-to-br from-slate-50/5 to-slate-50/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>

              {/* Upload Area */}
              {!isProcessing && !uploadedFilePreview ? (
                <FileDropZone
                  onFileChange={handleFileChange}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  fileInputRef={fileInputRef}
                  isProcessing={isProcessing}
                  uploadedFileName={uploadedFileName}
                />
              ) : (
                <>
                  {/* File Preview */}
                  <InvoicePreview
                    uploadedFilePreview={uploadedFilePreview}
                    uploadedFileName={uploadedFileName}
                    isProcessing={isProcessing}
                  />

                  {/* Processing Steps */}
                  {isProcessing && (
                    <div className="space-y-2 text-center">
                      <p className="text-slate-500 font-medium">Processing Invoice...</p>
                      <div className="flex items-center space-x-2 text-slate-400">
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                        <span>Reading document...</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-400">
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                        <span>Analyzing with AI...</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-400">
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                        <span>Extracting line items & totals...</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-col sm:flex-row sm:space-x-3">
                    <button
                      onClick={() => {
                        // Reset upload state
                        setUploadedFileName(null);
                        setUploadedFilePreview(null);
                        setInvoiceData(null);
                        setEditedLineItems([]);
                      }}
                      disabled={!uploadedFilePreview}
                      className={`relative z-20 flex-1 px-4 py-2 ${!uploadedFilePreview ? 'opacity-50 cursor-not-allowed' : 'bg-slate-200/50 hover:bg-slate-300/50 text-slate-500'} rounded-lg transition-all duration-200`}
                    >
                      Remove File
                    </button>
                    <button
                      onClick={toggleEditing}
                      disabled={!uploadedFilePreview || isProcessing}
                      className={`relative z-20 flex-1 px-4 py-2 ${!uploadedFilePreview || isProcessing ? 'opacity-50 cursor-not-allowed' : isEditing ? 'bg-slate-600 text-white font-medium' : 'bg-slate-200/50 hover:bg-slate-300/50 text-slate-500 font-medium'} rounded-lg transition-all duration-200`}
                    >
                      {isEditing ? 'Save Changes' : 'Edit Line Items'}
                    </button>
                    <button
                      onClick={exportToExcel}
                      disabled={!invoiceData || isProcessing}
                      className={`relative z-20 flex-1 px-4 py-2 ${!invoiceData || isProcessing ? 'opacity-50 cursor-not-allowed' : 'bg-slate-600 text-white font-medium hover:bg-slate-700'} rounded-lg transition-all duration-200`}
                    >
                      Export to Excel
                    </button>
                  </div>
                </>
              )}

              {/* Processing State */}
              {isProcessing && !uploadedFilePreview && (
                <div className="relative z-0 flex flex-col items-center justify-center py-12">
                  <div className="relative z-0 flex h-14 w-14 items-center justify-center mb-4 bg-slate-200/50 rounded-lg animate-pulse">
                    <svg className="flex-shrink-0 h-6 w-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path className="animate-spin" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 1118 0z"></path>
                    </svg>
                  </div>
                  <div className="space-y-2 text-center">
                    <p className="text-slate-500 font-medium">Processing Invoice...</p>
                    <div className="flex items-center space-x-2 text-slate-400">
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                      <span>Reading document...</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-400">
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                      <span>Analyzing with AI...</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-400">
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                      <span>Extracting line items & totals...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Results Card */}
            <div className="relative group bg-slate-50/50 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:border-slate-300/50 p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-slate-500/10">
              <div className="absolute inset-0 -z-0 rounded-2xl bg-gradient-to-br from-slate-50/5 to-slate-50/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>

              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-slate-500 font-semibold">Extraction Results</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('summary')}
                    disabled={!invoiceData || isProcessing}
                    className={`relative z-20 px-3 py-1.5 text-sm font-medium rounded-lg ${(!invoiceData || isProcessing) ? 'opacity-50 cursor-not-allowed' : activeTab === 'summary' ? 'bg-slate-600 text-white' : 'bg-slate-200/50 text-slate-500 hover:bg-slate-300/50'} transition-all duration-200`}
                  >
                    Summary
                  </button>
                  <button
                    onClick={() => setActiveTab('lineItems')}
                    disabled={!invoiceData || isProcessing}
                    className={`relative z-20 px-3 py-1.5 text-sm font-medium rounded-lg ${(!invoiceData || isProcessing) ? 'opacity-50 cursor-not-allowed' : activeTab === 'lineItems' ? 'bg-slate-600 text-white' : 'bg-slate-200/50 text-slate-500 hover:bg-slate-300/50'} transition-all duration-200`}
                  >
                    Line Items
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'summary' && (
                <InvoiceSummary invoiceData={invoiceData} getCurrencySymbol={getCurrencySymbol} />
              )}

              {activeTab === 'lineItems' && (
                <LineItemTable
                  invoiceData={invoiceData}
                  editedLineItems={editedLineItems}
                  isEditing={isEditing}
                  handleLineItemChange={handleLineItemChange}
                  addLineItem={addLineItem}
                  deleteLineItem={deleteLineItem}
                  saveLineItems={saveLineItems}
                  getCurrencySymbol={getCurrencySymbol}
                />
              )}
            </div>
          </div>
        ) : (
          /* Empty State - Upload Zone */
          <div className="w-full max-w-4xl">
            <div className="relative group bg-slate-50/50 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:border-slate-300/50 p-12 text-center transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-slate-500/10">
              <div className="absolute inset-0 -z-0 rounded-2xl bg-gradient-to-br from-slate-50/5 to-slate-50/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>
              <div className="relative z-0">
                <div className="flex h-16 w-16 items-center justify-center mb-6 bg-slate-200/10 rounded-lg">
                  <svg className="flex-shrink-0 h-8 w-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4a2 2 0 012-2h2.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01-.293.707V14a2 2 0 01-2 2h-3.172a1 1 0 01-.707-.293L7 11V4z"></path>
                  </svg>
                </div>
                <h2 className="mb-4 text-slate-500 font-semibold">Ready to Extract Invoice Data</h2>
                <p className="max-w-xl text-slate-500 mb-6">
                  Drag & drop an invoice image or PDF below, or click to select a file to begin AI-powered extraction.
                </p>
                <div className="flex flex-col sm:flex-row sm:space-x-3">
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center px-6 py-3 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition-all duration-200"
                  >
                    Select Invoice File
                  </label>
                </div>
                <p className="mt-4 text-slate-400 text-sm">
                  Supported formats: PNG, JPG, PDF • Max size: 10MB
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-slate-400 text-sm">
          <p>
            DocExtract AI uses advanced machine learning to extract structured data from invoices.
            For best results, ensure images are clear and text is legible.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} DocExtract AI. All rights reserved.
          </p>
        </div>

        {/* Processing Overlay */}
        <ProcessingOverlay isProcessing={isProcessing} />
      </div>
    </div>
  );
}