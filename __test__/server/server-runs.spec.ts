import request from "supertest";
import app from "../../app";

describe("server checks", function () {
  it("server runs correctly", function () {
    request(app).get("/").expect(200);
  });
});
