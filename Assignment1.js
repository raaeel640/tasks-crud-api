const express = require("express");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"]
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
// ---------------------------------------------------------------------------
// Stage 2 — Read: list + single task (with optional filtering/search extras)
// ---------------------------------------------------------------------------
app.get('/tasks', (req, res) => {

  let result = tasks;

  if (req.query.done !== undefined) {

    if (req.query.done !== 'true' && req.query.done !== 'false') {
      return res.status(400).json({ error: 'done must be true or false' });
    }

    const done = req.query.done === 'true';
    result = result.filter((t) => t.done === done);
  }

  if (req.query.search !== undefined) {

    const word = String(req.query.search).trim();

    if (word === '') {
      return res.status(400).json({ error: 'search must not be empty' });
    }

    const lower = word.toLowerCase();

    result = result.filter((t) =>
      t.title.toLowerCase().includes(lower)
    );
  }

  res.json(result);
});

app.get('/stats', (req, res) => {
  // user request py ye chly ga 

  const done = tasks.filter((t) => t.done).length;

  res.json({
    
    total: tasks.length,
   
    done,
    
    open: tasks.length - done,
   

  });
});


app.post('/reset', (req, res) => {
  resetTasks();

  res.json(tasks);
 
});
/ ---------------------------------------------------------------------------
// Stage 3 — Create
// ---------------------------------------------------------------------------
app.post('/tasks', (req, res) => {
  // user ne post request bheji to ye code chly ga

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
    return res.status(400).json({
      error: 'request body must include title and/or done'
    });
  }

  if (hasTitle) {
    if (title === null || String(title).trim() === '') {
      return res.status(400).json({
        error: 'title cannot be empty'
      });
    }

    task.title = String(title).trim();
  }

  if (hasDone) {
    if (typeof done !== 'boolean') {
      return res.status(400).json({
        error: 'done must be a boolean'
      });
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