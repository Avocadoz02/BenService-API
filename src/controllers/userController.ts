import { PrismaClient } from "@prisma/client";
 
 const prisma = new PrismaClient();
 
 export const UserController = {
     signIn: async ({ body, jwt }: {
         body: {
             username: string;
             password: string
         }; jwt: any
     }) => {
         try {
             const user = await prisma.user.findUnique({
                 select: {
                     id: true,
                     username: true,
                     level: true
                 },
                 where: {
                     username: body.username,
                     password: body.password,
                     status: "active"
                 }
             })
 
             if (!user) {
                 return { message: "Invalid username or password" }
             }
 
             const token = await jwt.sign(user);
 
             return { user, token };
         } catch (error) {
             return error;
         }
     },
     
 };

//  export const UserController = {
//     logMessage: (c: any) => {
//         console.log("asdasd");
//         return "asdasd"; // ✅ Elysia ใช้ return แทน res.send()
//     }
// };