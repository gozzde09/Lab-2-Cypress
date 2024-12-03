import cors from "cors";
import * as dotenv from "dotenv";
import { Client } from "pg";
import express, { Request, Response } from "express";
import path from "path";

import { Language } from "./types/interfaces";
import { Book } from "./types/interfaces";

const app = express();
app.use(express.json());
app.use(cors());
require("dotenv").config();

if (!process.env.PGURI) {
  throw new Error("PGURI environment variable not defined");
}
const client = new Client({
  connectionString: process.env.PGURI,
});
client.connect();

// GET - languages
app.get("/api/languages", async (_req: Request, res: Response) => {
  try {
    const { rows } = await client.query<Language>(
      `SELECT id, name FROM languages`
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json(error + "Error fetching languages");
  }
});

// GET - Hämta alla böcker med språk
app.get("/api/books", async (_req: Request, res: Response) => {
  try {
    const { rows } = await client.query<Book>(
      `SELECT books.id,
         books.title,
         books.author,
         books.language_id,
         languages.name AS language_name
      FROM books
      JOIN languages ON books.language_id = languages.id;`
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json(error + "Error fetching books");
  }
});

// POST - Lägg till en ny bok
app.post("/api/books", async (req: Request, res: Response) => {
  const { title, author, language_id }: Book = req.body;

  if (!title || !author || !language_id) {
    res.status(400).json({ message: "All fields are required" });
  }
  try {
    const { rows } = await client.query<Book>(
      `INSERT INTO books (title, author, language_id) VALUES ($1, $2, $3) RETURNING *`,
      [title, author, language_id]
    );
    res.status(201).send(rows[0]);
  } catch (error) {
    res.status(500).json(error + "Error adding books");
  }
});

// PUT - Uppdatera en boken
app.put(
  "/api/books/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const { title, author, language_id }: Book = req.body;

    if (!title || !author || !language_id) {
      res.status(400).json({ message: "All fields are required" });
    }
    try {
      const { rows } = await client.query<Book>(
        "UPDATE books SET title = $1, author = $2, language_id = $3 WHERE id = $4 RETURNING *",
        [title, author, language_id, id]
      );
      res.status(200).send(rows[0]);
    } catch (error) {
      res.status(500).json(error + "Error updating the book");
    }
  }
);

// DELETE - Ta bort en bok
app.delete(
  "/api/books/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    try {
      await client.query(`DELETE FROM books WHERE id = $1 RETURNING *`, [id]);
      res.status(204).send();
    } catch (error) {
      res.status(500).json(error + "Error deleting the book");
    }
  }
);

// Serve frontend files
app.use(express.static(path.join(path.resolve(), "dist")));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server kör på http://localhost:${port}`);
});
