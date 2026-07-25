const express = require('express'); 
const swaggerUi = require('swagger-ui-express');
const openapi = require('./openapi.json');
const app = express();
const port = 3000;
app.use(express.json());

// ---------------------------------------------------------------------------
// Stage 0 — start the server
// ---------------------------------------------------------------------------
app.listen(port, () => {
  console.log(`CRUD API listening on port ${port}`);
});
