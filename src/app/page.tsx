import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[100vh] bg-gradient-to-b from-slate-950 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 -z-0">
        <div className="relative h-full w-full">
          <svg className="absolute -top-10 left-1/2 -z-0 -translate-x-1/2 w-[30rem] h-[30rem]" fill="none" viewBox="0 0 100 100">
            <path strokeOpacity="0.05" stroke="indigo-400" strokeWidth="20" d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
          </svg>
          <svg className="absolute bottom-10 right-1/2 -z-0 translate-x-1/2 w-[25rem] h-[25rem]" fill="none" viewBox="0 0 100 100">
            <path strokeOpacity="0.05" stroke="slate-400" strokeWidth="15" d="M30,30 L70,70 M70,30 L30,70" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-[100vh] flex-col items-center justify-center px-6 py-24 md:py-32">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="mb-6 bg-gradient-to-r from-indigo-400 to-slate-400 bg-clip-text text-transparent text-4xl md:text-5xl font-bold leading-tight">
            DocExtract AI
          </h1>
          <p className="max-w-2xl text-slate-300 text-lg md:text-xl">
            Transform your invoice processing with AI-powered GST compliance automation. Extract, validate, and export financial data in seconds.
          </p>
        </div>

        {/* Features */}
        <div className="grid gap-8 mb-16 md:grid-cols-3">
          {/* Feature 1: AI Extraction */}
          <div className="relative group bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 hover:border-indigo-500/50 p-8 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-indigo-500/10">
            <div className="absolute inset-0 -z-0 rounded-2xl bg-gradient-to-br from-indigo-900/5 to-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-0 flex h-12 w-12 items-center justify-center mb-4 bg-indigo-500/10 rounded-lg">
              <svg className="flex-shrink-0 h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a2 2 0 110-4m0 0a2 2 0 100-4m-2 4h-2a2 2 0 00-2 2v2a2 2 0 002 2h2zm0 0v2a2 2 0 100 4m0-6a2 2 0 110-4m0 0a2 2 0 100-4m-2 4h-2a2 2 0 00-2 2v2a2 2 0 002 2h2z"></path>
              </svg>
            </div>
            <h3 className="mb-3 text-indigo-300 font-semibold">AI-Powered Extraction</h3>
            <p className="text-slate-400">
              Advanced AI understands invoice structures across formats, extracting vendor details, GSTIN, line items, and tax breakdowns with exceptional accuracy.
            </p>
          </div>

          {/* Feature 2: GST Compliance */}
          <div className="relative group bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 hover:border-indigo-500/50 p-8 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-indigo-500/10">
            <div className="absolute inset-0 -z-0 rounded-2xl bg-gradient-to-br from-indigo-900/5 to-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-0 flex h-12 w-12 items-center justify-center mb-4 bg-indigo-500/10 rounded-lg">
              <svg className="flex-shrink-0 h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c4.41 0 8-3.59 8-8s-3.59-8-8-8-8 3.59-8 8 3.59 8 8 8z"></path>
              </svg>
            </div>
            <h3 className="mb-3 text-indigo-300 font-semibold">GST Compliance Ready</h3>
            <p className="text-slate-400">
              Automatically validates GSTIN formats, separates CGST/SGST/IGST components, and ensures your exports meet Indian tax authority requirements.
            </p>
          </div>

          {/* Feature 3: Seamless Export */}
          <div className="relative group bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 hover:border-indigo-500/50 p-8 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-indigo-500/10">
            <div className="absolute inset-0 -z-0 rounded-2xl bg-gradient-to-br from-indigo-900/5 to-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-0 flex h-12 w-12 items-center justify-center mb-4 bg-indigo-500/10 rounded-lg">
              <svg className="flex-shrink-0 h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="mb-3 text-indigo-300 font-semibold">One-Click Export</h3>
            <p className="text-slate-400">
              Generate GST-ready Excel files instantly with properly formatted data, ready for import into your accounting software or tax filing systems.
            </p>
          </div>
        </div>

        {/* Pricing */}
        <div className="w-full max-w-4xl mb-16">
          <h2 className="mb-8 text-center text-3xl md:text-4xl font-bold">
            Simple, Transparent Pricing
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Free Plan */}
            <div className="relative group bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 hover:border-indigo-500/50 p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-indigo-500/10">
              <div className="absolute inset-0 -z-0 rounded-2xl bg-gradient-to-br from-indigo-900/5 to-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-0 flex items-center mb-4">
                <div className="flex h-8 w-8 items-center justify-center bg-indigo-500/20 rounded-lg mr-3">
                  <svg className="flex-shrink-0 h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.314 8.235m2.936-1.504A5.986 5.986 0 005.924 5.095a5.986 5.986 0 00-2.13 4.139a5.972 5.972 0 001.305 7.514l1.003.877"></path>
                  </svg>
                </div>
                <h3 className="text-indigo-300 font-semibold">Free</h3>
              </div>
              <p className="mb-4 text-slate-400">
                Perfect for trying out DocExtract AI with basic features.
              </p>
              <ul className="space-y-3 text-slate-400">
                <li className="flex items-center">
                  <svg className="mr-2 flex-shrink-0 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Up to 10 invoices/month</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 flex-shrink-0 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Basic extraction (vendor, date, total)</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 flex-shrink-0 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>CSV export only</span>
                </li>
              </ul>
              <Link href="/dashboard" className="mt-6 inline-block w-full text-center px-4 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200">
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="relative group bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-indigo-500/50 hover:border-indigo-500/100 p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-indigo-500/20">
              <div className="absolute inset-0 -z-0 rounded-2xl bg-gradient-to-br from-indigo-900/5 to-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-0 flex items-center mb-4">
                <div className="flex h-8 w-8 items-center justify-center bg-indigo-500/20 rounded-lg mr-3">
                  <svg className="flex-shrink-0 h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22c1.105 0 2-.895 2-2V6c0-1.105-.895-2-2-2s-2 .895-2 2v14c0 1.105.895 2 2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-white font-semibold">Pro</h3>
                <p className="mt-1 text-xs text-indigo-200">Most Popular</p>
              </div>
              <p className="mb-4 text-slate-400">
                Full-featured plan for businesses that rely on accurate invoice processing.
              </p>
              <ul className="space-y-3 text-slate-400">
                <li className="flex items-center">
                  <svg className="mr-2 flex-shrink-0 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Unlimited invoices</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 flex-shrink-0 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Full GST extraction (line items, taxes, etc.)</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 flex-shrink-0 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Excel & CSV export</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 flex-shrink-0 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 flex-shrink-0 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>API access</span>
                </li>
              </ul>
              <Link href="/dashboard" className="mt-6 inline-block w-full text-center px-4 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200">
                Get Pro - ₹1,499/mo
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="relative group bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 hover:border-indigo-500/50 p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-indigo-500/10">
              <div className="absolute inset-0 -z-0 rounded-2xl bg-gradient-to-br from-indigo-900/5 to-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-0 flex items-center mb-4">
                <div className="flex h-8 w-8 items-center justify-center bg-indigo-500/20 rounded-lg mr-3">
                  <svg className="flex-shrink-0 h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M5 18l2-2V7"></path>
                  </svg>
                </div>
                <h3 className="text-indigo-300 font-semibold">Enterprise</h3>
              </div>
              <p className="mb-4 text-slate-400">
                Custom solutions for high-volume businesses with dedicated support and SLAs.
              </p>
              <ul className="space-y-3 text-slate-400">
                <li className="flex items-center">
                  <svg className="mr-2 flex-shrink-0 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Custom invoice limits</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 flex-shrink-0 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 flex-shrink-0 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 flex-shrink-0 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>On-premise deployment</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 flex-shrink-0 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>SLA-guaranteed uptime</span>
                </li>
              </ul>
              <button className="mt-6 inline-block w-full text-center px-4 py-3 border border-indigo-500/50 text-indigo-300 hover:bg-indigo-900/50 transition-all duration-200 rounded-lg">
                Contact Sales
              </button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link href="/dashboard" className="inline-block bg-gradient-to-r from-indigo-600 to-indigo-400 text-white font-semibold px-8 py-4 rounded-lg text-lg hover:from-indigo-500 hover:to-indigo-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Start Extracting Invoices Now
          </Link>
          <p className="mt-8 text-slate-500 text-sm">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </div>

      {/* Floating action button for mobile */}
      <div className="absolute bottom-6 right-6 z-20">
        <Link href="/dashboard" className="flex h-12 w-12 items-center justify-center bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105">
          <svg className="flex-shrink-0 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
}