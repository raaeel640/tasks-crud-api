
const express = require('express'); 
const swaggerUi = require('swagger-ui-express');
const openapi = require('./openapi.json');
const app = express();
const port = 3000;

app.use(express.json());

const BOOKS = [
 
  { id: 1, title: 'The Kite Runner', available: false },
  { id: 2, title: 'Fourty Rules of Love', available : true },
  { id: 3, title: 'The Art of not overthinking', available: false },
  { id: 4, title:  'East of Eden' ,available:false},
];


const books = BOOKS.map((book) => ({ ...book }));


function resetBooks() {
  
  books.length = 0;

  books.push(...BOOKS.map((book) => ({ ...book}))); 
}

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));


//stage 1
app.get('/', (req, res) => {
  
  res.json({
   
    name: 'Books API',
    version: '1.0',
    endpoints: ['/books', '/stats', '/reset'],
  });
});

app.get('/health', (req, res) => {

  res.json({ status: 'ok' });
});

//stage 2
app.get('/books', (req, res) => {

  let result = books;
 
  if (req.query.available !== undefined) {

    if (req.query.available !== 'true' && req.query.available !== 'false') {
      return res.status(400).json({ error: 'availability status must be true or false' });
    }
    const available = req.query.available === 'true';
    
    result = result.filter((b) => b.available === available);
    
  }

  if (req.query.search !== undefined) {

    const name = String(req.query.search).trim();
   
    if (name=== '') {
      return res.status(400).json({ error: 'search must not be empty' });
    
    }
    const lower = name.toLowerCase();

  
    result = result.filter((b) => b.title.toLowerCase().includes(lower));
}

  res.json(result);

});


app.get('/stats', (req, res) => {

  const available = books.filter((b) => b.available === true).length;

  res.json({

    total: books.length,
  
    available,
    
    open: books.length - available,

  });
});


app.post('/reset', (req, res) => {

  resetBooks();

  res.json(books);
});

//stage 3
app.post('/books', (req, res) => {
 

  const { title } = req.body;

  if (title === undefined || title === null || String(title).trim() === '') {
    return res.status(400).json({ error: 'title is required and cannot be empty' });
  }

  const id = books.length === 0 ? 1 : Math.max(...books.map((b) => b.id)) + 1;
  const book = { id, title: String(title).trim(), available: false};

  books.push(book);
  res.status(201).json(book);
});

app.get('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ error: `Book ${id} not found` });
  }

  res.json(book);
});

//stage 4 update and delete
app.put('/books/:id', (req, res) => {
 
  const id = Number(req.params.id);
  
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ error: `Book ${id} not found` });
  }

  const { title, available } = req.body ?? {};
  const hasTitle = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'title');
  const isAvailable = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'available');
  if (!hasTitle && !isAvailable) {
    return res.status(400).json({ error: 'request body must include title and/or availability status' });
  }

  if (hasTitle) {
    if (title === null || String(title).trim() === '') {
      return res.status(400).json({ error: 'title cannot be empty' });
  
    }
    book.title = String(title).trim();
  }

  if (isAvailable) {
   
    if (typeof available !== 'boolean') {
      return res.status(400).json({ error: 'availability status must be a boolean' });
    }
    book.available = available;
  }

  res.json(book);
});

app.delete('/books/:id', (req, res) => {

  const id = Number(req.params.id);

  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    
    return res.status(404).json({ error: `Book ${id} not found` });
  }

  books.splice(index, 1);
  
  res.status(204).send();

});
app.listen(port, () => {
  console.log(`CRUD API listening on port ${port}`);
});

