import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { base64Data, mimeType } = await req.json();

    if (!base64Data) {
      return NextResponse.json(
        { error: "Image base64 data is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key missing in environment variables." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are an expert financial document AI parser designed for Indian small businesses and accountants.
      Examine this invoice/receipt image carefully and extract all information into structured JSON.

      Extraction Guidelines:
      - Date: Extract and convert all dates strictly into DD/MM/YYYY format.
      - Currency: Identify the currency code (e.g., "INR", "USD", "EUR"). Default to "INR" if ambiguous.
      - Tax Breakdown: Extract CGST, SGST, and IGST separately if present. If only a flat tax/VAT is shown, put the total in taxAmount and set CGST/SGST/IGST to 0.
      - Line Items: Extract description, quantity, unit price, and total line price. Return pure numbers for amounts.

      STRICT REQUIREMENT: Return ONLY a raw JSON object (no markdown, no \`\`\`json wrappers) matching this schema:
      {
        "vendorName": "string",
        "gstin": "string",
        "invoiceNumber": "string",
        "invoiceDate": "DD/MM/YYYY",
        "currency": "string",
        "subtotal": 0,
        "cgst": 0,
        "sgst": 0,
        "igst": 0,
        "taxAmount": 0,
        "totalAmount": 0,
        "lineItems": [
          {
            "description": "string",
            "quantity": 0,
            "price": 0,
            "total": 0
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: mimeType || "image/png", data: base64Data } },
            { text: prompt },
          ],
        },
      ],
    });

    const textResponse = response.text || "";
    const cleanJson = textResponse.replace(/```json|```/g, "").trim();
    const invoiceData = JSON.parse(cleanJson);

    return NextResponse.json({ success: true, data: invoiceData });
  } catch (error: any) {
    console.error("Gemini Extraction Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process document with AI." },
      { status: 500 }
    );
  }
}