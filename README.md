# 🚀 blocCRM Setup Guide

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Node.js (Latest LTS version)
- MongoDB (Local installation or MongoDB Atlas connection string)
- n8n (Desktop version or running via Docker)

---

## 🎨 Frontend Setup

### Navigate to the client directory

    cd client

### Install dependencies

    npm install

### Configure Environment Variables

Create a file named `.env` inside the client directory and add:

    VITE_API_URL=http://localhost:5000/api

### Start the development server

    npm run dev

---

## 🖥️ Backend Setup

### Navigate to the server directory

    cd server

### Install dependencies

    npm install

### Configure Environment Variables

Create a file named `.env` inside the server directory and add:

    PORT=5000
    MONGO_URI=mongodb://localhost:27017/leads_db

### Start the backend server

    npm run dev

---

## 🔗 n8n Workflow Integration

### 1. Prepare the Workflow File

Ensure you have the workflow JSON file (e.g., `workflow.json`) located in your project root or downloaded locally.

---

### 2. Import into n8n

1. Open your n8n instance.
2. Click on the Workflow menu (top-left corner).
3. Select **Import from File...**
4. Upload your workflow JSON file.

---

### 3. Configure Nodes

- Open the imported workflow.
- Update MongoDB or API nodes with your local credentials or environment configurations.
- Click Save.
- Set the workflow status to Active.

---

✅ Your blocCRM application should now be fully configured and running locally.

---

## 🏗️ System Design Architecture

Below is the high-level system design of the blocCRM platform:

![blocCRM System Design](./public/System_design(CRM).png)
