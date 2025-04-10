const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/books', (req, res) => {
  fs.readFile('books.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');
    res.json(JSON.parse(data));
  });
});

app.post('/books', (req, res) => {
  const newBook = req.body;
  
  fs.readFile('books.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');
    
    const books = JSON.parse(data);
    newBook.bookid = books.length + 1;
    books.push(newBook);
    
    fs.writeFile('books.json', JSON.stringify(books, null, 2), 'utf8', (err) => {
      if (err) return res.status(500).send('Error saving book');
      res.status(201).send(newBook);
    });
  });
});

app.put('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const updatedBook = req.body;
  
  fs.readFile('books.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');
    
    const books = JSON.parse(data);
    const index = books.findIndex((book) => book.bookid === bookId);
    
    if (index === -1) return res.status(404).send('Book not found');
    
    books[index] = { ...books[index], ...updatedBook };
    
    fs.writeFile('books.json', JSON.stringify(books, null, 2), 'utf8', (err) => {
      if (err) return res.status(500).send('Error updating book');
      res.status(200).send(books[index]);
    });
  });
});

// Delete a book
app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  
  fs.readFile('books.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');
    
    const books = JSON.parse(data);
    const updatedBooks = books.filter((book) => book.bookid !== bookId);
    
    if (updatedBooks.length === books.length) return res.status(404).send('Book not found');
    
    fs.writeFile('books.json', JSON.stringify(updatedBooks, null, 2), 'utf8', (err) => {
      if (err) return res.status(500).send('Error deleting book');
      res.status(200).send('Book deleted');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
