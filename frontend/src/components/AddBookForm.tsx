import axios from "axios";
import { useState, useEffect } from "react";

import { Language } from "../types/interfaces";
import { Book } from "../types/interfaces";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

interface AddBookFormProps {
  onAddBook: (book: Book) => void;
  count?: number;
}

export default function AddBookForm({ onAddBook, count }: AddBookFormProps) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [newBook, setNewBook] = useState<Book>({
    title: "",
    author: "",
    language_id: 0,
  });

  //GET -Språk
  useEffect(() => {
    const getLanguages = async () => {
      try {
        const response = await axios.get<Language[]>("/api/languages");
        setLanguages(response.data);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };
    getLanguages();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({
      ...prev,
      [name]: name === "language_id" ? Number(value) : value,
      // Om namnet är 'language_id', konvertera värdet till ett nummer
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAddBook(newBook);
    alert(
      "Book added successfully! You have " + count + " book(s) to read now!"
    );
    setNewBook({
      title: "",
      author: "",
      language_id: 0,
    }); // Reset form
  };

  return (
    <Form onSubmit={handleSubmit} className='d-flex align-items-center'>
      <Form.Group>
        <Form.Control
          className='m-2'
          type='text'
          name='title'
          placeholder='Book Title'
          value={newBook.title}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Control
          className='m-2'
          type='text'
          name='author'
          placeholder='Author'
          value={newBook.author}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Select
          className='m-2 form-select'
          name='language_id'
          value={newBook.language_id}
          onChange={handleChange}
          required>
          <option value=''>Select Language</option>
          {languages.map((language) => (
            <option key={language.id} value={language.id}>
              {language.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Button className='mx-4 p-1' variant='success' type='submit'>
        Add
      </Button>
    </Form>
  );
}
