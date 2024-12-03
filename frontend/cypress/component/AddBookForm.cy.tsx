import AddBookForm from "../../src/components/AddBookForm";
import { Book } from "../../src/types/interfaces";

beforeEach(() => {
  const handleAddBook = cy.stub().as("handleAddBook");
  cy.mount(<AddBookForm onAddBook={handleAddBook} />);
});

describe("AddBookForm", () => {
  //FORM
  it("renders the form", () => {
    cy.get('input[name="title"]')
      .should("exist")
      .and("have.attr", "placeholder", "Book Title");
    cy.get('input[name="author"]')
      .should("exist")
      .and("have.attr", "placeholder", "Author");
    cy.get('select[name="language_id"]').should("exist");
  });
  //LANGUAGES and DROPDOWN MENU
  it("fetches the languages", () => {
    cy.fixture("languages").then((json) => {
      cy.intercept("GET", "http://localhost/api/languages", json).as(
        "getLanguages"
      );
      expect(json).to.have.length(10);
    });
  });
  it("can select language and verifies it", () => {
    cy.get('select[name="language_id"]')
      .select("English")
      .should("have.value", "1");
    cy.get('select[name="language_id"] option')
      .eq(5)
      .should("have.text", "German");
    cy.get('select[name="language_id"] option')
      .eq(5)
      .should("have.text", "Turkish");
  });

  //Submit
  it("calls the onAddBook prop with the correct data on form submission", () => {
    cy.get('input[name="title"]').type("Test Book");
    cy.get('input[name="author"]').type("John Doe");
    cy.get('select[name="language_id"]').select("English");

    cy.get('button[type="submit"]').click();

    cy.get("@handleAddBook").should("have.been.calledOnceWith", {
      title: "Test Book",
      author: "John Doe",
      language_id: 1,
    });
  });

  //POST
  it("adds a new book and checks if the book count increases at the alert", () => {
    const newBook: Book = {
      title: "New Book",
      author: "John Doe",
      language_id: 1,
    };
    let initialBookCount = 0;
    cy.request("GET", "http://localhost/api/books").then((res) => {
      expect(res.body).to.be.an("array");
      initialBookCount = res.body.length;
    });
    cy.request("POST", "http://localhost/api/books", newBook).then(() => {
      cy.request("GET", "http://localhost/api/books").then((res) => {
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.length.greaterThan(initialBookCount);
      });
    });
    cy.on("window:alert", (alertText) => {
      expect(alertText).to.contain("Book added successfully!");
      expect(alertText).to.contain(
        `${initialBookCount + 1} book(s) to read now!`
      );
    });
  });
});
