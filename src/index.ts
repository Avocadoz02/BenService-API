import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { cors } from "@elysiajs/cors"
import { UserController } from "./controllers/userController";
import { DeviceController } from "./controllers/DeviceController";
import { DepartmentController } from "./controllers/DepartmentController";
import { SectionController } from "./controllers/SectionController";
import { RepairRecordController } from "./controllers/RepairRecordController";

const app = new Elysia()
.use(cors())
.use(jwt({
  name: "jwt",
  secret: "secret",
}))
.get("/", () => "Hello Elysia")
.post("/api/user/signin", UserController.signIn)
.put("/api/user/update", UserController.update)
.get("/api/user/list", UserController.list)
.post("/api/user/create", UserController.create)
.put("/api/user/updateUser/:id", UserController.updateUser)
.delete("/api/user/remove/:id", UserController.remove)

//
// Repair Record
//
.get("/api/repairRecord/list", RepairRecordController.list)
.post("/api/repairRecord/create", RepairRecordController.create)
.put("/api/repairRecord/update/:id", RepairRecordController.update)
.delete("/api/repairRecord/remove/:id", RepairRecordController.remove)

// 
// Department and Section
//
.get("/api/department/list", DepartmentController.list)
.get("/api/section/listByDepartment/:departmentId", SectionController.listByDepartment)

// 
// Device
// 
.post("/api/device/create", DeviceController.create)
.get("/api/device/list", DeviceController.list)
.put("/api/device/update/:id", DeviceController.update)
.delete("/api/device/remove/:id", DeviceController.remove)

//
// Listen
//
.listen(5000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
