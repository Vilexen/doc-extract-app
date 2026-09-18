export const meta = {
  name: 'invoice-extraction-platform',
  description: 'Build a production-quality micro-SaaS for Chartered Accountants with AI-powered invoice extraction',
  phases: [
    { title: 'Requirements Analysis', detail: 'Analyze and document all requirements for the invoice extraction platform' },
    { title: 'Architecture Design', detail: 'Design the system architecture including frontend, backend, database, and AI/OCR pipeline' },
    { title: 'Database Schema', detail: 'Design the database schema for users, invoices, vendors, items, etc.' },
    { title: 'Backend API', detail: 'Design and implement the backend REST/API endpoints' },
    { title: 'Frontend UI', detail: 'Design and implement the premium UI with fluid animations' },
    { title: 'AI/OCR Pipeline', detail: 'Implement the OCR and AI extraction pipeline' },
    { title: 'Validation & Review', detail: 'Implement accounting validation, duplicate detection, and human review workflow' },
    { title: 'Export & Analytics', detail: 'Implement export functionality and analytics dashboard' },
    { title: 'Testing & Polish', detail: 'Test all functionality and perform final UI polish pass' }
  ]
};

// Phase 1: Requirements Analysis
phase('Requirements Analysis');
const requirements = await agent('Analyze the user requirements for the invoice extraction platform and create a comprehensive requirements document', {
  schema: {
    type: 'object',
    properties: {
      coreConcept: { type: 'string' },
      targetUsers: { type: 'string' },
      coreWorkflow: { type: 'string' },
      invoiceFields: { type: 'array', items: { type: 'string' } },
      humanReview: { type: 'string' },
      accountingValidation: { type: 'string' },
      duplicateDetection: { type: 'string' },
      batchProcessing: { type: 'string' },
      dashboard: { type: 'string' },
      search: { type: 'string' },
      dataTable: { type: 'string' },
      export: { type: 'string' },
      vendorManagement: { type: 'string' },
      analytics: { type: 'string' },
      authentication: { type: 'string' },
      fileSecurity: { type: 'string' },
      aiArchitecture: { type: 'string' },
      costControl: { type: 'string' },
      uiUx: { type: 'string' },
      visualStyle: { type: 'string' },
      landingPage: { type: 'string' },
      fluidAnimationSystem: { type: 'string' },
      scrollAnimations: { type: 'string' },
      uploadAnimation: { type: 'string' },
      dashboardMotion: { type: 'string' },
      invoiceReviewMotion: { type: 'string' },
      reviewQueue: { type: 'string' },
      microInteractions: { type: 'string' },
      pageTransitions: { type: 'string' },
      loadingStates: { type: 'string' },
      emptyStates: { type: 'string' },
      toasts: { type: 'string' },
      commandSearch: { type: 'string' },
      responsiveDesign: { type: 'string' },
      accessibility: { type: 'string' },
      performance: { type: 'string' },
      technicalQuality: { type: 'string' },
      database: { type: 'string' },
      testing: { type: 'string' },
      developmentProcess: { type: 'string' },
      finalUiPolish: { type: 'string' },
      productPrinciple: { type: 'string' }
    },
    required: ['coreConcept', 'targetUsers', 'coreWorkflow']
  }
});

// Phase 2: Architecture Design
phase('Architecture Design');
const architecture = await agent('Based on the requirements, design the system architecture for the invoice extraction platform including frontend, backend, database, AI/OCR components, and file storage', {
  schema: {
    type: 'object',
    properties: {
      frontend: { type: 'string' },
      backend: { type: 'string' },
      database: { type: 'string' },
      aiOcrPipeline: { type: 'string' },
      fileStorage: { type: 'string' },
      authSystem: { type: 'string' },
      apiGateway: { type: 'string' },
      caching: { type: 'string' },
      messageQueue: { type: 'string' },
      monitoring: { type: 'string' },
      deployment: { type: 'string' }
    },
    required: ['frontend', 'backend', 'database', 'aiOcrPipeline']
  }
});

// Phase 3: Database Schema
phase('Database Schema');
const databaseSchema = await agent('Design a comprehensive database schema for the invoice extraction platform covering users, invoices, invoice items, vendors, processing jobs, review events, and exports', {
  schema: {
    type: 'object',
    properties: {
      users: { type: 'string' },
      invoices: { type: 'string' },
      invoiceItems: { type: 'string' },
      vendors: { type: 'string' },
      processingJobs: { type: 'string' },
      reviewEvents: { type: 'string' },
      exports: { type: 'string' },
      indexes: { type: 'string' },
      relationships: { type: 'string' }
    },
    required: ['users', 'invoices', 'invoiceItems', 'vendors']
  }
});

// Phase 4: Backend API
phase('Backend API');
const backendApi = await agent('Design the REST/API endpoints for the invoice extraction platform covering authentication, upload, processing, review, export, vendors, analytics, and vendor management', {
  schema: {
    type: 'object',
    properties: {
      authEndpoints: { type: 'string' },
      uploadEndpoints: { type: 'string' },
      processingEndpoints: { type: 'string' },
      reviewEndpoints: { type: 'string' },
      exportEndpoints: { type: 'string' },
      vendorEndpoints: { type: 'string' },
      analyticsEndpoints: { type: 'string' },
      invoiceEndpoints: { type: 'string' },
      middleware: { type: 'string' },
      errorHandling: { type: 'string' }
    },
    required: ['authEndpoints', 'uploadEndpoints', 'processingEndpoints', 'reviewEndpoints']
  }
});

// Phase 5: Frontend UI
phase('Frontend UI');
const frontendUi = await agent('Design the premium UI for the invoice extraction platform with fluid animations, micro-interactions, responsive design, and accessibility features', {
  schema: {
    type: 'object',
    properties: {
      layout: { type: 'string' },
      components: { type: 'string' },
      animations: { type: 'string' },
      theme: { type: 'string' },
      typography: { type: 'string' },
      icons: { type: 'string' },
      responsiveBreakpoints: { type: 'string' },
      accessibilityFeatures: { type: 'string' },
      stateManagement: { type: 'string' },
      routing: { type: 'string' }
    },
    required: ['layout', 'components', 'animations', 'theme']
  }
});

// Phase 6: AI/OCR Pipeline
phase('AI/OCR Pipeline');
const aiOcrPipeline = await agent('Design the AI/OCR pipeline for invoice processing including OCR engines, AI extraction models, validation steps, and error handling', {
  schema: {
    type: 'object',
    properties: {
      ocrEngines: { type: 'string' },
      aiExtraction: { type: 'string' },
      preprocessing: { type: 'string' },
      postprocessing: { type: 'string' },
      validationSteps: { type: 'string' },
      errorHandling: { type: 'string' },
      confidenceScoring: { type: 'string' },
      fallbackMechanisms: { type: 'string' }
    },
    required: ['ocrEngines', 'aiExtraction', 'preprocessing', 'postprocessing']
  }
});

// Phase 7: Validation & Review
phase('Validation & Review');
const validationReview = await agent('Design the accounting validation, duplicate detection, and human review workflow for the invoice extraction platform', {
  schema: {
    type: 'object',
    properties: {
      accountingValidation: { type: 'string' },
      duplicateDetection: { type: 'string' },
      confidenceSystem: { type: 'string' },
      reviewWorkflow: { type: 'string' },
      editFunctionality: { type: 'string' },
      approvalProcess: { type: 'string' },
      auditTrail: { type: 'string' }
    },
    required: ['accountingValidation', 'duplicateDetection', 'confidenceSystem', 'reviewWorkflow']
  }
});

// Phase 8: Export & Analytics
phase('Export & Analytics');
const exportAnalytics = await agent('Design the export functionality and analytics dashboard for the invoice extraction platform', {
  schema: {
    type: 'object',
    properties: {
      exportFormats: { type: 'string' },
      exportProcess: { type: 'string' },
      analyticsDashboard: { type: 'string' },
      charts: { type: 'string' },
      metrics: { type: 'string' },
      timeFilters: { type: 'string' }
    },
    required: ['exportFormats', 'exportProcess', 'analyticsDashboard']
  }
});

// Phase 9: Testing & Polish
phase('Testing & Polish');
const testingPolish = await agent('Create a comprehensive testing plan and final UI polish pass for the invoice extraction platform', {
  schema: {
    type: 'object',
    properties: {
      testingStrategy: { type: 'string' },
      testCases: { type: 'string' },
      uiPolishChecklist: { type: 'string' },
      performanceBenchmarks: { type: 'string' },
      accessibilityAudit: { type: 'string' },
      securityReview: { type: 'string' }
    },
    required: ['testingStrategy', 'testCases', 'uiPolishChecklist']
  }
});

// Return all results
return {
  requirements: requirements,
  architecture: architecture,
  databaseSchema: databaseSchema,
  backendApi: backendApi,
  frontendUi: frontendUi,
  aiOcrPipeline: aiOcrPipeline,
  validationReview: validationReview,
  exportAnalytics: exportAnalytics,
  testingPolish: testingPolish
};