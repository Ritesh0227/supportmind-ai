# SupportMind AI - REST API Documentation
**Base URL:** `http://localhost:5000/api`

---

## 1. Categories Endpoints

### `GET /api/categories`
Returns all 8 support categories with real-time active article counts.

**Response:**
```json
{
  "categories": [
    {
      "id": "cat-account-mgmt",
      "slug": "account-management",
      "name": "Account Management",
      "description": "Manage your profile, password, security settings, and notifications.",
      "icon": "UserCheck",
      "display_order": 1,
      "articleCount": 3
    }
  ]
}
```

### `GET /api/categories/:slug`
Returns specific category with its approved articles.

---

## 2. Articles Endpoints

### `GET /api/articles`
Lists articles with optional query filters:
- `category_id`: Filter by category UUID
- `status`: `'published'`, `'draft'`, or `'archived'`
- `search`: Keyword search across titles, content, and tags

### `GET /api/articles/:slugOrId`
Returns complete article details and automatically increments the `views_count`.

### `POST /api/articles`
Creates a new article (Admin only).

**Request Body:**
```json
{
  "title": "Configuring SSO SAML 2.0",
  "category_id": "cat-account-mgmt",
  "content": "## SSO Integration\n\nFollow these steps...",
  "excerpt": "How to connect Okta or Azure AD to SupportMind.",
  "keywords": ["sso", "saml", "okta"],
  "tags": ["Enterprise", "Security"],
  "status": "published"
}
```

### `PUT /api/articles/:id`
Updates existing article fields.

### `POST /api/articles/:id/archive`
Toggles publication status between `'published'` and `'archived'`.

### `POST /api/articles/:id/vote`
Records a customer helpfulness vote (`helpful: boolean`).

---

## 3. Conversational AI Chat Endpoint

### `POST /api/chat`
Submits a customer question, retrieves relevant articles, checks confidence gating, and produces a grounded answer.

**Request Body:**
```json
{
  "sessionId": "session-12345",
  "query": "How do I reset my password?",
  "conversationId": "conv-6789",
  "provider": "builtin"
}
```

**Response (Grounded Answer):**
```json
{
  "conversationId": "conv-6789",
  "messageId": "msg-9901",
  "answer": "Based on our verified knowledge base article \"How to Reset Your Account Password\", here are the recommended steps...",
  "sources": [
    {
      "articleId": "art-pwd-reset",
      "title": "How to Reset Your Account Password",
      "slug": "how-to-reset-password",
      "category": "cat-account-mgmt",
      "excerpt": "Follow this step-by-step procedure to reset your forgotten password...",
      "relevanceScore": 14.5
    }
  ],
  "isFallback": false,
  "latencyMs": 18,
  "providerUsed": "SupportMind Built-in Grounded Engine"
}
```

**Response (Safe Fallback for Out-of-Scope Query):**
```json
{
  "conversationId": "conv-6789",
  "messageId": "msg-9902",
  "answer": "I couldn't find a reliable answer in our knowledge base. Please contact our support team for further assistance.",
  "sources": [],
  "isFallback": true,
  "latencyMs": 8,
  "providerUsed": "fallback-guard"
}
```

---

## 4. Feedback Endpoints

### `POST /api/feedback`
Captures user rating and comment.

**Request Body:**
```json
{
  "messageId": "msg-9901",
  "conversationId": "conv-6789",
  "rating": "helpful",
  "comment": "Quick and accurate steps!",
  "userEmail": "customer@example.com"
}
```

### `GET /api/feedback`
Returns all logged customer feedback records for admin review.

---

## 5. Analytics & Dashboard Endpoint

### `GET /api/analytics/dashboard`
Returns live calculated KPIs computed from database records:
- `totalActiveArticles`
- `totalCustomerQuestions`
- `answeredQuestions`
- `unansweredQuestions`
- `helpfulFeedbackCount`
- `notHelpfulFeedbackCount`
- `satisfactionRate`
- `articlesByCategory`
- `questionsOverTime`
- `recentQuestions`
- `unansweredList`

---

## 6. Automated Benchmark Suite Endpoints

### `GET /api/test-suite/questions`
Returns the 10+ standard hackathon test questions.

### `POST /api/test-suite/run`
Executes automated verification against all test questions and returns a structured evaluation report.
