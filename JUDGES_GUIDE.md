# Sendr — Judge Testing & Evaluation Guide

This guide is intended to help hackathon judges quickly install, run, test, and evaluate Sendr.

---

## 1. Quick Installation Guide

### Prerequisites

Before running Sendr, make sure the following are installed:

- Node.js
- npm
- A modern web browser

### Clone the Repository

Ideally create a new folder then open the new folder in vs code, open terminal then run the this command:-

git clone https://github.com/piyush5harma/sendr.git


<img width="1454" height="940" alt="Screenshot 2026-07-15 171357" src="https://github.com/user-attachments/assets/1cd2a4f4-c4ff-4c08-8bc9-a92a084ec105" />


Move into the sendr folder by running this command in terminal:- 

cd sendr


<img width="941" height="271" alt="Screenshot 2026-07-15 171424" src="https://github.com/user-attachments/assets/dfe32b07-1076-4ddf-8478-5c52a69f1665" />

### Install Dependencies

npm install


<img width="572" height="234" alt="Screenshot 2026-07-15 171455" src="https://github.com/user-attachments/assets/d3a53a95-8860-4e17-8a90-9c11f2daa0f5" />


### Start the Backend Server

node server.js


<img width="687" height="261" alt="Screenshot 2026-07-15 171523" src="https://github.com/user-attachments/assets/a7bc307e-8478-4970-81cb-f2b051f0c614" />

The backend proxy will run on:

http://localhost:8080

### Start the Frontend

Open the project using VS Code and run `index.html` with Live Server.


<img width="1874" height="849" alt="Screenshot 2026-07-15 171629" src="https://github.com/user-attachments/assets/6c0da31e-2c4d-4d7b-b212-a9a3d124ba4c" />

The application will usually open at:

http://127.0.0.1:5500

> Important: Keep the backend server running while testing API requests.

---

## 2. Quick Test

To verify that Sendr is working correctly:

1. Select the `GET` request method.
2. Enter:

https://postman-echo.com/get?test=sendr

3. Click **Send**.


<img width="1875" height="844" alt="Screenshot 2026-07-15 172832" src="https://github.com/user-attachments/assets/e8fba9ac-d27d-4bb4-8ef6-8de54dd665c5" />

The response panel should display:

- HTTP status
- Response time
- Response size
- Response body
- Response headers

---

## 3. Main Features

Sendr supports:

- GET, POST, PUT, PATCH, and DELETE requests
- Query parameters
- Custom request headers
- JSON request bodies
- Basic authentication
- Bearer token authentication
- Request collections
- Request history
- Environment variables
- Dynamic variable resolution
- Response body inspection
- Response header inspection
- Response status, time, and size metrics
- Backend proxy-based request execution

---

## 4. Testing Environment Variables

Sendr supports dynamic placeholders using:

{{variableName}}

### Example

Create an environment named:

test

Add the following variable:

baseUrl = https://postman-echo.com

Select the `test` environment.

Enter the following request URL:

{{baseUrl}}/get?test=sendr

Click **Send**.

Sendr dynamically resolves the variable before executing the request.

---

## 5. Creative Features — Bonus Evaluation

The project goes beyond a basic API request sender by implementing workflow-oriented API testing features.

### Environment Variable System

Users can create multiple environments and define reusable variables.

Variables can be used in:

- Request URLs
- Query parameters
- Headers
- Authentication values
- Request bodies

Example:

{{baseUrl}}/users

Variables are dynamically resolved before the request is sent.

### Request Collections

Requests can be saved into named collections and loaded again for reuse.

This allows users to organize related API requests.

### Request History

Executed requests are automatically stored in request history.

Selecting a previous request restores its configuration for reuse.

### Authentication Support

Sendr provides dedicated support for:

- Basic Authentication
- Bearer Token Authentication

Authentication configuration is converted into the appropriate request headers.

### Backend Proxy Architecture

API requests are sent through a Node.js backend proxy.

This separates request execution from the browser interface and avoids directly coupling the frontend with external APIs.

---

## 6. Code Quality — Bonus Evaluation

Sendr follows a modular JavaScript architecture.

Feature-specific logic is separated into the `features` directory.

Project structure:

sendr/
├── features/
│   ├── auth.js
│   ├── collections.js
│   ├── environments.js
│   ├── history.js
│   ├── params.js
│   ├── requestLoader.js
│   ├── sendRequest.js
│   ├── state.js
│   └── tabs.js
├── index.html
├── script.js
├── server.js
├── style.css
├── package.json
└── README.md

Each module has a focused responsibility.

Examples:

- `auth.js` handles authentication configuration.
- `environments.js` manages environment variables and variable resolution.
- `history.js` manages request history.
- `collections.js` manages saved request collections.
- `sendRequest.js` coordinates request creation and execution.
- `requestLoader.js` restores saved request configurations.

This structure reduces tightly coupled code and improves maintainability.

---

## 7. Documentation — Bonus Evaluation

The repository contains documentation covering:

- Project overview
- Features
- Technologies used
- Installation
- Application workflow
- Project architecture
- Folder structure
- Testing instructions

This judge guide additionally provides direct feature verification steps.

---

## 8. Code Comments — Bonus Evaluation

Comments are intentionally used only where additional context is useful.

They document logic such as:

- Environment variable resolution
- Request processing
- JSON validation
- Authentication handling
- Request history behavior

Comments that simply repeat obvious JavaScript statements are intentionally avoided.

---

## 9. Suggested Judge Testing Flow

For a quick evaluation, the following workflow is recommended:

1. Send a basic GET request.
2. Add query parameters and resend the request.
3. Test a POST request with a JSON body.
4. Configure Bearer Token authentication.
5. Create and use an environment variable.
6. Save a request inside a collection.
7. Load the saved request.
8. Open a request from history.
9. Inspect response headers and response metrics.

This flow demonstrates the primary functionality and the bonus-oriented features of Sendr.

---

## 10. Technology Stack

Frontend:

- HTML5
- CSS3
- Vanilla JavaScript
- ES Modules

Backend:

- Node.js
- Express.js

Storage:

- Browser LocalStorage

Version Control:

- Git
- GitHub

---

## Final Note

Sendr was designed as a lightweight API testing client focused on reusable request workflows, modular architecture, and a clean developer experience.

The project intentionally goes beyond basic API request execution by implementing environments, collections, authentication, history, and reusable request configuration.
