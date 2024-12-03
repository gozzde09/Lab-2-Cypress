describe("My BookList app", function () {
  beforeEach(() => {
    //GET BOOKS
    cy.fixture("books").then((json) => {
      cy.intercept("GET", "http://localhost/api/books", json).as("getBooks");
    });
    //GET LANGUAGES
    cy.fixture("languages").then((json) => {
      cy.intercept("GET", "http://localhost/api/languages", json).as(
        "getLanguages"
      );
    });
    //VISIT THE PAGE
    cy.visit("http://localhost/");
  });

  //Table-headers
  it("renders table headers correctly", () => {
    cy.get("th").eq(1).should("contain", "Book Title");
    cy.get("th").eq(2).should("contain", "Author");
    cy.get("th").eq(3).should("contain", "Literature");
  });

  //Fetches
  it("fetches the books", () => {
    cy.wait("@getBooks").then((data) => {
      expect(data.response.body).to.be.an("array");
      expect(data.response.body).to.have.length.greaterThan(0);
    });
  });
  it("fetches the languages", () => {
    cy.wait("@getLanguages").then((data) => {
      expect(data.response.body).to.have.length(10); // Equal 10
    });
  });

  //Books
  it("render more than two books", () => {
    cy.get("td").should("have.length.greaterThan", 2);
  });
  it("render two specific books", () => {
    cy.get("td").should("contain", "To Kill a Mockingbird");
    cy.get("td").should("contain", "Moby Dick");
  });

  //Languages
  it("render a specific language", () => {
    cy.get("td").should("contain", "English");
  });
  it("does not render a specific language", () => {
    cy.get("td").should("not.contain", "Swedish");
  });
});
