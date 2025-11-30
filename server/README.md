# Padel & Palms Backend Server

This backend server handles form submissions from the Padel & Palms website and forwards them to the n8n MCP server.

## Setup

1. Install dependencies:
```bash
npm install
```

## Running the Server

### Development mode (with auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will run on `http://localhost:3001`

## Endpoints

- `GET /health` - Health check endpoint to verify server and MCP connection status
- `POST /api/submit-form` - Form submission endpoint

## Environment

The server connects to the n8n MCP server using the configuration from `../padelandpalms/mcp/mcp.json`

## How it Works

1. The frontend form sends data to `POST /api/submit-form`
2. The backend initializes an MCP client connection to the n8n server
3. The form data is sent to the appropriate n8n tool via the MCP protocol
4. The response is returned to the frontend

## Testing

Test the health endpoint:
```bash
curl http://localhost:3001/health
```

Test form submission:
```bash
curl -X POST http://localhost:3001/api/submit-form \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "+1234567890",
    "selectedServices": []
  }'
```
