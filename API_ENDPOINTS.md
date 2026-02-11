# API Endpoints Called from Frontend

Base URL (default): `https://api-staging.myjurist.io/api/v1`  
Legal Research history (one call): `https://api.myjurist.io/api/v1`

---

## GET

| Endpoint | Source |
|----------|--------|
| `/auth/me` | dashboardApi.ts |
| `/dashboard/stats` | dashboardApi.ts |
| `/models/available` | dashboardApi.ts |
| `/legal-research/history?limit=5` (and with search params) | legalResearchApi.ts, legal-research/page.tsx (different base) |
| `/pdf/{encodedPath}` | legalResearchApi.ts |
| `/legal-research/pdf/{encodedPath}` | legalResearchApi.ts |
| `/chats?skip={skip}&limit={limit}&active_only=true` | document-analysis/page.tsx |
| `/chats/{chatId}/sessions?skip={skip}&limit={limit}&active_only=true` | document-analysis/page.tsx |
| `/chats/{chatId}/sessions/{sessionId}/messages?skip=0&limit=100` | document-analysis/page.tsx |
| `/chats/{chatId}/documents` | document-analysis/page.tsx |
| `/chats/{chatId}/documents/{documentId}/download` | document-analysis/page.tsx |
| `/chats/{chatId}/sessions/{sessionId}/documents` | document-analysis/page.tsx |
| `/drafting/contract/{contractId}/{format}` | smartDraftingApi.ts |
| `/drafting/contract/{contractId}/docx` | smartDraftingApi.ts |
| `/document-categorization/history?page={page}&limit={limit}` | documentCategorizationApi.ts |
| `/document-categorization/result/{requestId}` | documentCategorizationApi.ts |
| `/organizations?page={page}&per_page={per_page}` | organizationApi.ts |
| `/organizations/{organizationId}` | organizationApi.ts |
| `/organizations/{organizationId}/users?page={page}&per_page={per_page}` | organizationApi.ts |
| `/users/{userId}` (single user fetch) | organizationApi.ts (GET by id for details) |
| `/timeline/{timelineId}` | timelineApi.ts |
| `/timeline/enhanced/{timelineId}` | timelineApi.ts |
| `/timeline/list?page={page}&page_size={pageSize}` | timelineApi.ts |
| `/timeline/{timelineId}/documents` | timelineApi.ts |
| `/timeline/{timelineId}/documents/{documentId}/download` | timelineApi.ts |
| `/documents/{documentId}/download` | timelineApi.ts |
| `/documents/{documentId}/url` | timelineApi.ts |
| `/enhanced-contracts/categories` | enhancedContractApi.ts |
| `/enhanced-contracts/templates?category={category}` | enhancedContractApi.ts |
| `/enhanced-contracts/templates/all` | enhancedContractApi.ts |
| `/enhanced-contracts/templates/{templateId}` | enhancedContractApi.ts |
| `/enhanced-contracts/search?query={query}` | enhancedContractApi.ts |
| `/enhanced-contracts/drafts?page={page}&page_size={pageSize}` | enhancedContractApi.ts |
| `/enhanced-contracts/drafts/{contractId}` | enhancedContractApi.ts |
| `/reports/patent/my-reports?limit={limit}&offset={offset}` | patent-analysis/page.tsx |
| `/reports/patent/report/{reportId}/pdf` | patent-analysis/page.tsx |
| `/reports/patent/report/{reportId}` | patent-analysis/page.tsx |

---

## POST

| Endpoint | Source |
|----------|--------|
| `/auth/refresh` | AuthProvider.tsx |
| `/auth/enhanced/login` | AuthProvider.tsx |
| `/auth/register/send-otp` | AuthProvider.tsx |
| `/auth/register/verify-otp` | AuthProvider.tsx |
| `/auth/register` | AuthProvider.tsx |
| `/auth/password-reset` | AuthProvider.tsx |
| `/auth/password-reset/confirm` | AuthProvider.tsx |
| `/auth/logout` | AuthProvider.tsx |
| `/drafting` | smartDraftingApi.ts |
| `/contact/submit` | contactApi.ts |
| `/legal-research/enhanced-search` | legalResearchApi.ts |
| `/legal-research/document` | legalResearchApi.ts |
| `/legal-research/document/pdf` | legalResearchApi.ts |
| `/chats` | document-analysis/page.tsx |
| `/chats/{chatId}/sessions/` | document-analysis/page.tsx |
| `/chat` | document-analysis/page.tsx |
| `/chats/{chatId}/documents` (file upload) | document-analysis/page.tsx |
| `/chats/{chatId}/sessions/{sessionId}/messages` | document-analysis/page.tsx |
| `/document-categorization/categorize` | documentCategorizationApi.ts |
| `/organizations` | organizationApi.ts |
| `/users` | organizationApi.ts |
| `/regulatory-compliance/suggestions` | regulatoryComplianceApi.ts |
| `/regulatory-compliance/query` | regulatoryComplianceApi.ts |
| `/timeline/generate/upload` | timelineApi.ts |
| `/agentic-rag/search` | agenticRagApi.ts |
| `/enhanced-contracts/validate` | enhancedContractApi.ts |
| `/enhanced-contracts/draft` | enhancedContractApi.ts |
| `/patents/search` | patent-analysis/page.tsx |
| `/patents/analysis/exclusions/detailed` | patent-analysis/page.tsx |
| `/patents/analysis/disclosure/detailed` | patent-analysis/page.tsx |
| `/patents/analysis/novelty/detailed` | patent-analysis/page.tsx |
| `/reports/patent/comprehensive` | patent-analysis/page.tsx |

---

## Other methods (reference)

- **PUT:** `/models/preferences`, `/drafting/contract/{contractId}`, `/organizations/{id}`, `/users/{userId}`, `/chats/{chatId}/sessions/{sessionId}/documents/{docId}`
- **DELETE:** `/organizations/{id}`, `/users/{userId}`, `/chats/.../documents/{id}`, `/timeline/{id}`, `/documents/{id}`, `/enhanced-contracts/drafts/{id}`
