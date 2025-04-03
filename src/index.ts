import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { cors } from "@elysiajs/cors"
import { UserController } from "./controllers/UserController";

const app = new Elysia()
.use(cors())
.use(jwt({
  name: "jwt",
  secret: "secret",
}))
.get("/", () => "Hello Elysia")
.post("/api/user/signin", UserController.signIn)
// .post("/api/user/signin", UserController.logMessage)
.listen(5000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
