import express from 'express';
import cors from 'cors';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MCP Client setup
let mcpClient = null;
let isConnecting = false;

async function initializeMCPClient() {
  if (mcpClient || isConnecting) {
    return mcpClient;
  }

  isConnecting = true;

  try {
    console.log('Initializing MCP client...');

    // Spawn the MCP server process using the configuration from mcp.json
    const serverProcess = spawn('npx', [
      '-y',
      'supergateway',
      '--streamableHttp',
      'https://build8.app.n8n.cloud/mcp-server/http',
      '--header',
      'authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYTE1YmM5YS1lOTI4LTQ4MmQtODZlZS02NTBkMjFhYzcxMmUiLCJpc3MiOiJuOG4iLCJhdWQiOiJtY3Atc2VydmVyLWFwaSIsImp0aSI6ImFjZDViM2IwLWNiNDgtNGY3MS05ZDRkLWE3NTIzMzliNjUyMSIsImlhdCI6MTc2NDUzNzQ4OH0.5rSobCUUmPGGKZ9u4eoAdzFqUlpSTzOC3QGczlO8yAQ'
    ], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Create the transport using stdio
    const transport = new StdioClientTransport({
      command: serverProcess,
      stderr: serverProcess.stderr,
      stdout: serverProcess.stdout,
      stdin: serverProcess.stdin
    });

    // Create and connect the MCP client
    const client = new Client({
      name: 'padelandpalms-server',
      version: '1.0.0'
    }, {
      capabilities: {}
    });

    await client.connect(transport);

    mcpClient = client;
    isConnecting = false;

    console.log('MCP client initialized successfully');

    // List available tools
    const tools = await client.listTools();
    console.log('Available MCP tools:', tools);

    return client;
  } catch (error) {
    console.error('Failed to initialize MCP client:', error);
    isConnecting = false;
    throw error;
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mcpConnected: mcpClient !== null
  });
});

// Form submission endpoint
app.post('/api/submit-form', async (req, res) => {
  try {
    console.log('Received form submission:', req.body);

    // Ensure MCP client is initialized
    const client = await initializeMCPClient();

    if (!client) {
      throw new Error('MCP client not initialized');
    }

    // List available tools to see what we can call
    const tools = await client.listTools();
    console.log('Available tools:', JSON.stringify(tools, null, 2));

    // Find the appropriate tool to submit data
    // This will depend on what tools are available from your n8n MCP server
    // You may need to adjust the tool name and parameters based on your n8n workflow

    // Example: Call a tool to submit the form data
    // Replace 'submit_form' with the actual tool name from your n8n MCP server
    const toolName = tools.tools?.[0]?.name || 'submit_form';

    const result = await client.callTool({
      name: toolName,
      arguments: req.body
    });

    console.log('MCP tool result:', result);

    res.json({
      success: true,
      message: 'Form submitted successfully',
      result: result
    });

  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit form',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Form submission endpoint: http://localhost:${PORT}/api/submit-form`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  if (mcpClient) {
    await mcpClient.close();
  }
  process.exit(0);
});
