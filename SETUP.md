# Padel & Palms - Development Setup

This project is a React frontend that sends form submissions directly to n8n via webhook.

## Project Structure

```
padel-&-palms_-the-effortless-flow-journey_2/
├── padelandpalms/          # React frontend (Vite)
│   ├── components/
│   │   └── OrderForm.tsx  # Form with n8n webhook integration
│   └── mcp/
│       └── mcp.json        # MCP server configuration (optional)
└── server/                 # Node.js backend (optional - for MCP integration)
    ├── index.js           # Main server file
    └── package.json       # Server dependencies
```

## Running the Application

### Start the Frontend

```bash
cd padelandpalms
npm install    # Only needed first time
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

### Access the Application

Open your browser and go to the URL shown in the terminal (usually `http://localhost:5173`)

## How It Works

1. User fills out the form on the frontend
2. Frontend sends data directly to n8n webhook: `https://build8.app.n8n.cloud/webhook-test/eb767d8b-80e1-4eee-9e1d-442e328d6546`
3. n8n processes the form data and sends it to your Google Sheet
4. Response is returned to the user

## Important: Activate Your n8n Workflow

**Test Mode (for development):**
- The webhook URL with `/webhook-test/` only works in test mode
- Click "Execute workflow" in n8n canvas before each test
- The webhook will only work for one call after clicking execute

**Production Mode (for live site):**
- Activate your workflow in n8n (toggle the "Active" switch)
- n8n will provide a production webhook URL (without `/webhook-test/`)
- Update line 219 in `OrderForm.tsx` with the production URL
- The webhook will work continuously without manual activation

## Testing

Test the webhook directly:
```bash
curl -X POST https://build8.app.n8n.cloud/webhook-test/eb767d8b-80e1-4eee-9e1d-442e328d6546 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "+1234567890",
    "selectedServices": [],
    "totalMonthly": 0,
    "totalOneTime": 0,
    "currency": "USD",
    "submittedAt": "2025-11-30T14:30:00.000Z"
  }'
```

## Troubleshooting

### Frontend won't start
- Make sure you're in the `padelandpalms` directory
- Check if port 5173 is already in use
- Run `npm install` to ensure all dependencies are installed

### Form submission fails
- Check browser console for errors
- Verify the n8n webhook URL is correct in `components/OrderForm.tsx`
- Make sure your n8n workflow is active
- Check n8n execution logs for errors

### CORS issues
- n8n webhooks should handle CORS automatically
- If you see CORS errors, check your n8n workflow settings

## Optional: MCP Backend Server

If you want to use the MCP server approach instead of direct webhooks:

1. Start the backend server:
```bash
cd server
npm install
npm start
```

2. Update `OrderForm.tsx` line 219 to use:
```javascript
const response = await fetch('http://localhost:3001/api/submit-form', {
```

This allows for additional processing before sending to n8n.
