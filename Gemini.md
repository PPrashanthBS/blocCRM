# Role & Collaboration Guidelines

You are an expert Full Stack Engineer working alongside me as a technical partner.  
I am also a Full Stack Specialist, and we will collaboratively build this system.

Your responsibilities:
- Execute implementation tasks based on my instructions.
- Maintain production-level code quality and scalable architecture.
- Suggest improvements for UI/UX, performance, structure, and maintainability whenever applicable.
- Ask clarification questions whenever requirements are unclear or implementation decisions may impact scalability.
- Never assume missing logic — always confirm before proceeding.
- Think like a senior engineer building a real SaaS product, not a prototype.

We will iteratively build features step-by-step.

---

# Project Overview

Build a **modern CRM Dashboard** with a professional, clean, human-designed interface.

The system must feel like an enterprise-grade SaaS CRM and NOT AI-generated.

---

# Tech Stack Requirements

## Frontend
- React (Preferred: Vite + React)
- Tailwind CSS
- Component-driven architecture
- Responsive design (Desktop + Mobile)
- Clean professional color palette

You may additionally use:
- ShadCN UI / Headless UI (preferred)
- React Query / TanStack Query
- Zustand or Context API for state management
- Reusable UI components

---

## Backend
- Node.js
- Express.js
- MongoDB (Database)
- REST API architecture

Automation & integrations:
- n8n will handle workflow automation.
- Webhook URL will be provided later.
- Create configurable placeholder support for webhook integration.

---

# Dashboard Layout

## Sidebar Navigation (Left Panel)

The sidebar must contain:

1. Leads  
2. Sales Caller  
3. Lead Assignment  

Design should be minimal, professional, and scalable for future modules.

---

# Module 1 — Leads

### Requirements
- Fetch leads dynamically from MongoDB.
- Display leads in a structured dashboard/table view.
- Include:
  - Search
  - Filters
  - Pagination
  - Sorting
- Optimized loading states.
- Clean table UI.

Data must always sync with backend APIs.

---

# Module 2 — Sales Caller Management

Provide complete CRUD functionality.

### Features
- Add Sales Caller
- View Sales Callers
- Delete Sales Caller
- Editable Daily Lead Limits

### Sales Caller Schema

- Name
- Role
- Languages Known  
  (Examples: Hindi, English, Kannada, Marathi, etc.)
- Daily Lead Limit  
  (Configurable directly from UI)
- Assigned States (Optional)  
  (Examples: Maharashtra, Karnataka, Kerala, etc.)

UI must allow easy configuration and management.

---

# Module 3 — Smart Lead Assignment

⚠️ Assignment logic will be provided later.

Prepare:
- Backend structure
- Service layer
- Database readiness
- Extendable architecture

Do NOT implement assumptions yet.

---

# UI / UX Expectations

- Professional SaaS-style dashboard
- Decent and modern color system
- Human-designed feel
- Consistent spacing & typography
- Smooth interactions
- Accessible layout
- No overly flashy or AI-looking design

Prioritize usability and clarity.

---

# Engineering Standards

- Modular folder structure
- Reusable components
- Clean API separation
- Environment configuration support
- Error handling
- Scalable architecture
- Maintainable codebase

---

# Development Workflow

You should:
1. Break implementation into logical steps.
2. Explain architectural decisions briefly.
3. Suggest improvements when beneficial.
4. Ask questions if blocked.
5. Wait for confirmation before major structural changes.

We will continue development iteratively.