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

// -------------------------------------------------------------------------
//  Stage 2 
//--------------------------------------------------------------------------
const MY_TASKS = [
  { id: 1, title: 'Complete CRUD API Assignment', done: false },
  { id: 2, title: 'Crocheting', done: true },
  { id: 3, title: 'Shopping', done: false },
  { id: 4, title: 'Learn CSS', done: true },
];
const tasks = MY_TASKS.map((task) => ({ ...task }));

app.get('/tasks', (req, res) => {
  res.json(result);
});
app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }
  res.json(task);
});
// ---------------------------------------------------------------------------
// Stage 3 — Create
// ---------------------------------------------------------------------------
app.post('/tasks', (req, res) => {

  const { title } = req.body;
  if (title === undefined || title === null || String(title).trim() === '') {
    return res.status(400).json({ error: 'title is required and cannot be empty' });
  }

  const id = tasks.length === 0 ? 1 : Math.max(...tasks.map((t) => t.id)) + 1;
  const task = { id, title: String(title).trim(), done: false };

  tasks.push(task);
  res.status(201).json(task);
});

app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  res.json(task);
});
// ---------------------------------------------------------------------------
// Stage 4 — Update & Delete
// ---------------------------------------------------------------------------
app.put('/tasks/:id', (req, res) => {
 
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  const { title, done } = req.body ?? {};
  const hasTitle = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'title');
  const hasDone = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'done');
  if (!hasTitle && !hasDone) {
    return res.status(400).json({ error: 'request body must include title and/or done' });
  }

  if (hasTitle) {
    if (title === null || String(title).trim() === '') {
      return res.status(400).json({ error: 'title cannot be empty' });
    }
    task.title = String(title).trim();
  }
  

  if (hasDone) {
   
    if (typeof done !== 'boolean') {
      return res.status(400).json({ error: 'done must be a boolean' });
    }
    task.done = done;
    
  }

  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  tasks.splice(index, 1);
  res.status(204).send();
});
