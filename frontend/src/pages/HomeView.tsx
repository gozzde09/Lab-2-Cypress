import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { Book } from "../types/interfaces";
import AddBookForm from "../components/AddBookForm";
import EditBookForm from "../components/EditBookForm";

import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

export default function HomeView() {
  const [bookCount, setBookCount] = useState(0);
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // GET- Böcker med språk
  const getBooks = useCallback(async () => {
    try {
      const response = await axios.get<Book[]>("/api/books");
      setBookCount(response.data.length);
      const sortedBooks = response.data.sort(
        (a, b) => (a.id ?? 0) - (b.id ?? 0)
      );
      // Sortera enligt book.id. Default listas ut med language.id
      // ID default 0 så att not undefined
      setBooks(sortedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }, []);

  useEffect(() => {
    getBooks();
  }, [getBooks]);

  // POST - Book
  const handleAddBook = async (newBook: Book) => {
    try {
      await axios.post<Book>("/api/books", newBook, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };
  //PUT -Bok
  const handleUpdateBook = async (id: number, updatedBook: Book) => {
    try {
      await axios.put(`/api/books/${id}`, updatedBook, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      getBooks();
      setEditingBook(null);
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  // DELETE -Book
  const handleDeleteBook = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (confirmed) {
      try {
        await axios.delete(`/api/books/${id}`);
        // getBooks();
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };
  return (
    <>
      <h1 className='mx-auto text-center fst-italic text-white'>
        To-read Book list
      </h1>
      {/* Add Book Form */}
      <AddBookForm onAddBook={handleAddBook} count={bookCount} />

      {/* Book List */}
      <Table className='my-4 p-4 '>
        <thead>
          <tr>
            <th>Nr.</th>
            <th>Book Title</th>
            <th>Author</th>
            <th>Literature</th>
            <th className='text-center'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <React.Fragment key={book.id}>
              <tr>
                <td>{index + 1}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.language_name}</td>
                <td className='text-center'>
                  <Button
                    className='mx-2'
                    variant='outline-warning'
                    onClick={() => setEditingBook(book)}>
                    Edit
                  </Button>
                  <Button
                    className='mx-2'
                    variant='outline-danger '
                    onClick={() =>
                      book.id !== undefined && handleDeleteBook(book.id)
                    }>
                    Delete
                  </Button>
                </td>
              </tr>

              {/* Edit Form in the Row  */}
              {editingBook?.id === book.id && editingBook && (
                <tr>
                  <td colSpan={5}>
                    <EditBookForm
                      book={editingBook}
                      onCancel={() => setEditingBook(null)}
                      onSave={handleUpdateBook}
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </>
  );
}
