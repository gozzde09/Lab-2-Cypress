DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS languages;

CREATE TABLE languages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    language_id INT NOT NULL,
    FOREIGN KEY (language_id) REFERENCES languages(id)
);

INSERT INTO languages (name) VALUES
    ('English'),
    ('Russian'),
    ('Greek'),
    ('French'),
    ('German'),
    ('Italian'),
    ('Chinese'),
    ('Japanese'),
    ('Turkish'),
    ('Spanish');

INSERT INTO books (title, author, language_id) VALUES
    ('Pride and Prejudice', 'Jane Austen', 1),  -- English
     ('The Museum of Innocence', 'Orhan Pamuk', 9), -- Turkish
    ('Moby Dick', 'Herman Melville', 1),        -- English
    ('War and Peace', 'Leo Tolstoy', 2),        -- Russian
    ('The Great Gatsby', 'F. Scott Fitzgerald', 1), -- English
    ('To Kill a Mockingbird', 'Harper Lee', 1), -- English
    ('The Odyssey', 'Homer', 3),                -- Greek
    ('Crime and Punishment', 'Fyodor Dostoevsky', 2), -- Russian
    ('Les Misérables', 'Victor Hugo', 4),       -- French
    ('Journey to the Center of the Earth', 'Jules Verne', 4); -- French

-- SQL QUERY:
SELECT b.id, b.title, b.author, b.language_id, l.name AS language
FROM books b
JOIN languages l ON b.language_id = l.id;
