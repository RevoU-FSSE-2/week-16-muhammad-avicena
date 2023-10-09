import request from "supertest";
import app from "../../../app";

describe("Book controller functions", () => {
  it("should return a list of books for getAllBooks", async () => {
    request(app)
      .get("/api/books")
      .expect(200)
      .expect(true)
      .expect("Successfully get all books");
  });

  it("should create a new book for createBook", async () => {
    const requestBody = {
      name: "Test Book",
      author: "Test Author",
    };

    request(app)
      .post("/api/books")
      .send(requestBody)
      .expect("Successfully create book")
      .expect(200);
  });

  it("should update a book for updateBook", async () => {
    const requestBody = {
      name: "Test Update Book",
      author: "Test Update Author",
    };

    const bookId = 123;

    request(app)
      .put(`/api/books/${bookId}`)
      .send(requestBody)
      .expect("Successfully update book")
      .expect(200);
  });

  it("should update a book for deleteBook", async () => {
    const bookId = 123;

    request(app)
      .delete(`/api/books/${bookId}`)
      .expect("Successfully delete book")
      .expect(200);
  });
});
