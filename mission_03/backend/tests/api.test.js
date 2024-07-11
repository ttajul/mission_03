const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app"); // Assuming your Express app is exported from this file
const request = require("supertest");
const User = require("../src/models/user"); // Adjust the path as needed

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("API Tests", () => {
  describe("POST /api/register", () => {
    it("should create a new user with valid data", async () => {
      const res = await request(app).post("/api/register").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("username", "testuser");
    });

    it("should not create a new user with missing username", async () => {
      const res = await request(app).post("/api/register").send({
        email: "testuser@example.com",
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        "User validation failed: username: Path `username` is required."
      );
    });

    it("should not create a new user with invalid email", async () => {
      const res = await request(app).post("/api/register").send({
        username: "testuser",
        email: "invalidemail",
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        "User validation failed: email: Validator failed for path `email` with value `invalidemail`"
      );
    });
  });

  describe("POST /api/login", () => {
    it("should log in a user with valid credentials", async () => {
      const user = new User({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
      });
      await user.save();

      const res = await request(app).post("/api/login").send({
        email: "testuser@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Login successful");
      expect(res.body.token).toBeDefined();
    });

    it("should not log in a user with incorrect password", async () => {
      const res = await request(app).post("/api/login").send({
        email: "testuser@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid credentials");
    });

    it("should not log in a user with missing password", async () => {
      const res = await request(app).post("/api/login").send({
        email: "testuser@example.com",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Password is required");
    });
  });

  describe("GET /api/user/:id", () => {
    it("should return user data for a valid ID", async () => {
      const testUser = await User.create({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
      });

      const res = await request(app).get(`/api/user/${testUser._id}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe("testuser@example.com");
    });

    it("should return 404 for an invalid ID", async () => {
      const res = await request(app).get("/api/user/invalidID");

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User not found");
    });
  });

  describe("POST /api/ai/generate-question", () => {
    it("should generate and return a mock interview question", async () => {
      const res = await request(app).post("/api/ai/generate-question");

      expect(res.status).toBe(200);
      expect(res.body.question).toBeDefined();
    });

    it("should handle AI errors gracefully", async () => {
      jest.spyOn(aiService, "generateQuestion").mockImplementation(() => {
        throw new Error("AI service error");
      });

      const res = await request(app).post("/api/ai/generate-question");

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Internal server error");
    });
  });
});
