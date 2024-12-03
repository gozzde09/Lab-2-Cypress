import axios from "axios";
import { useState, useEffect } from "react";

import { Book } from "../types/interfaces";
import { Language } from "../types/interfaces";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

interface EditBookFormProps {
  book: Book;
  onSave: (id: number, updatedBook: Book) => void;
  onCancel: () => void;
}

export default function EditBookForm(props: EditBookFormProps) {
  const { book, onSave, onCancel } = props;

  const [languages, setLanguages] = useState<Language[]>([]);
  const [editedBook, setEditedBook] = useState<Book>(book);

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
    setEditedBook((prev) => ({
      ...prev,
      [name]: name === "language_id" ? Number(value) : value,
      // Om namnet är 'language_id', konvertera värdet till ett nummer
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedBook.id !== undefined) {
      onSave(editedBook.id, editedBook);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className='d-flex align-items-center bg-gray'>
      <span className='me-4'>#</span>
      <Form.Group>
        <Form.Control
          type='text'
          name='title'
          value={editedBook.title}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Control
          type='text'
          name='author'
          value={editedBook.author}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Select
          className='mx-0'
          name='language_id'
          value={editedBook.language_id}
          onChange={handleChange}
          required>
          {languages.map((language) => (
            <option key={language.id} value={language.id}>
              {language.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Button className='mx-4  p-1' type='submit' variant='outline-success'>
        Update
      </Button>
      <Button
        className=' me-4 p-1'
        variant='outline-secondary'
        onClick={onCancel}>
        Cancel
      </Button>
    </Form>
  );
}
