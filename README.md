# Sendr

Sendr is a lightweight API client built with JavaScript and Node.js. It allows developers to create, send, save, and organize HTTP requests through a simple interface.

The project was built to explore how API testing tools work internally, including request construction, authentication, environment variables, collections, request history, and backend proxying.

## Features

- Send GET, POST, PUT, PATCH, and DELETE requests
- Query parameter support
- Custom request headers
- Request body support
- Bearer Token authentication
- Basic authentication
- API Key authentication
- Environment variables using `{{variableName}}` syntax
- Save requests into collections
- Rename and delete saved requests
- Request history
- Response body viewer
- Response headers viewer
- Response status, time, and size metrics
- Backend proxy for outbound API requests
- Request timeout handling
- Local persistence using localStorage

## Tech Stack

### Frontend

- HTML
- CSS
- JavaScript
- ES Modules

### Backend

- Node.js
- Express.js
- Fetch API

## Project Structure

```text
sendr/
│
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
│
├── index.html
├── script.js
├── server.js
├── style.css
├── package.json
└── package-lock.json
```

## Architecture

Sendr uses a modular frontend architecture where each feature owns its related logic and DOM event handling.

`script.js` acts as the application entry point and initializes the individual modules.

All outbound API requests are sent through the Sendr backend proxy.

```text
Browser
   |
   v
Sendr Frontend
   |
   v
Express Proxy Server
   |
   v
Target API
```

The backend validates the request and forwards it to the target API using the Fetch API.

## Environment Variables

Sendr supports environment placeholders using the following syntax:

```text
{{variableName}}
```

Example:

```text
{{baseUrl}}/users
```

An environment can define:

```text
baseUrl = https://api.example.com
token = my-api-token
```

Environment variables can be used in:

- URLs
- Query parameters
- Headers
- Authentication values
- Request bodies

## Authentication

Sendr currently supports:

### Bearer Token

Adds an Authorization header:

```text
Authorization: Bearer <token>
```

### Basic Authentication

Encodes the username and password using Base64.

### API Key

Allows a custom API key header and value.

## Running Locally

Clone the repository:

```bash
git clone https://github.com/piyush5harma/sendr.git
```

Move into the project directory:

```bash
cd sendr
```

Install dependencies:

```bash
npm install
```

Start the backend server:

```bash
npm start
```

The backend runs on:

```text
http://localhost:8080
```

Open `index.html` using a local development server such as VS Code Live Server.

## Data Persistence

Sendr stores the following data in browser localStorage:

- Collections
- Saved requests
- Request history
- Environments

Request history is limited to the latest 50 requests.

## Security Notes

Sendr currently runs as a local development tool.

The backend only accepts HTTP and HTTPS target URLs and applies a request timeout.

Additional SSRF protection and network restrictions would be required before exposing the proxy publicly.

## Future Improvements

- Request cancellation
- Import and export collections
- JSON syntax highlighting
- Response search
- Request duplication
- Collection export
- Automated API tests
- Improved SSRF protection
- Desktop application support

## Author

**Piyush Sharma**

GitHub: piyush5harma

## License

This project is licensed under the MIT License.