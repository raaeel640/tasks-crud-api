const express = require('express'); 
const swaggerUi = require('swagger-ui-express');
const openapi = require('./openapi.json');
const app = express();
const port = 3000;



app.use(express.json());
// ---------------------------------------------------------------------------
// Stage 1 — the front door
// ---------------------------------------------------------------------------
app.get('/', (req, res) => {
  res.json({
    name: 'Task API',
    version: '1.0',
    endpoints: ['/tasks', '/stats', '/reset'],
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});


