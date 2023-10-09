import request from "supertest";
import app from "../../../app";

describe("Home route checks", () => {
  it("should return home page with Hello World!", function () {
    request(app).get("/").expect(200).expect("Hello world!");
  });
});
