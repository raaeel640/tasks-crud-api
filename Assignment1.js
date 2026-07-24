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