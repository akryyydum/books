import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Typography, Modal, Box } from "@mui/material";
import "./styles.css";

const API_URL = "http://localhost:3000/books";

const AddBooks = () => {
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({
        bookid: "",
        title: "",
        author: "",
        publisher: "",
        publicationDate: "",
        condition: "", // "new" or "used"
        price: ""
    });
    const [open, setOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch(API_URL);
            if (response.ok) {
                const data = await response.json();
                setBooks(data);
            } else {
                console.error("Failed to fetch books");
            }
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBook({ ...newBook, [name]: value });
    };

    const handleAddBook = async () => {
        if (!newBook.title || !newBook.author || !newBook.publisher || !newBook.publicationDate || !newBook.condition || !newBook.price) {
            setError("All fields are required");
            return;
        }
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBook),
            });
            if (response.ok) {
                setNewBook({ title: "", author: "", publisher: "", publicationDate: "", condition: "", price: "" }); // Clear input fields
                fetchBooks();
                setError(null);
                setOpen(false); // Close modal
            } else {
                console.error("Error adding book");
            }
        } catch (error) {
            console.error("Error adding book:", error);
        }
    };

    const handleEditBook = async () => {
        if (selectedBook) {
            try {
                const response = await fetch(`${API_URL}/${selectedBook.bookid}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newBook), // Send updated book details
                });
                if (response.ok) {
                    setNewBook({ title: "", author: "", publisher: "", publicationDate: "", condition: "", price: "" }); // Clear input fields
                    fetchBooks();
                    setEditMode(false);
                    setOpen(false); // Close modal
                } else {
                    console.error("Error updating book");
                }
            } catch (error) {
                console.error("Error updating book:", error);
            }
        }
    };

    const handleDeleteBook = async (bookId) => {
        try {
            const response = await fetch(`${API_URL}/${bookId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchBooks();
            } else {
                console.error("Error deleting book");
            }
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    const handleOpenModal = (book) => {
        setSelectedBook(book);
        setNewBook({
            bookid: book.bookid,
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            publicationDate: book.publicationDate,
            condition: book.condition,
            price: book.price
        }); // Set the existing values for editing
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setSelectedBook(null);
        setEditMode(false);
    };

    const handleEditClick = (book) => {
        setEditMode(true);
        handleOpenModal(book);
    };

    return (
        <div className="add-books-container">
            <div className="title-um">
                <Typography variant="h4" gutterBottom>Add Books</Typography>
                <Button variant="contained" color="primary" onClick={() => setOpen(true)} className="add-user-button-um">
                    Add Books
                </Button>
            </div>
            <TableContainer component={Paper} className="table-container-um">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Book ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Publisher</TableCell>
                            <TableCell>Publication Date</TableCell>
                            <TableCell>Condition</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.map((book) => (
                            <TableRow key={book.bookid}>
                                <TableCell>{book.bookid}</TableCell>
                                <TableCell>{book.title}</TableCell>
                                <TableCell>{book.author}</TableCell>
                                <TableCell>{book.publisher}</TableCell>
                                <TableCell>{book.publicationDate}</TableCell>
                                <TableCell>{book.condition}</TableCell>
                                <TableCell>{book.price}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => handleEditClick(book)} className="edit-button-um">
                                        Edit
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={() => handleDeleteBook(book.bookid)} className="delete-button-um">
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal open={open} onClose={handleCloseModal} className="modal-um">
                <Box className="modal-box-um">
                    <Typography variant="h6" gutterBottom>{editMode ? "Edit Book" : "Add Book"}</Typography>
                    <TextField
                        label="Title"
                        name="title"
                        value={newBook.title}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Author"
                        name="author"
                        value={newBook.author}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Publisher"
                        name="publisher"
                        value={newBook.publisher}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Publication Date"
                        name="publicationDate"
                        value={newBook.publicationDate}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Condition (New/Used)"
                        name="condition"
                        value={newBook.condition}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Price"
                        name="price"
                        value={newBook.price}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        type="number"
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    <Button variant="contained" color="primary" onClick={editMode ? handleEditBook : handleAddBook} className="submit-button-um">
                        {editMode ? "Update Book" : "Add Book"}
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleCloseModal} className="cancel-button-um">
                        Cancel
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default AddBooks;
