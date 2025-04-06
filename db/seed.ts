import { db, Role, User } from "astro:db";
import { v4 as UUID } from "uuid";
import bcrypt from "bcryptjs";

// https://astro.build/db/seed
export default async function seed() {
  const roles = [
    { id: "admin", name: "Admin" },
    { id: "user", name: "User" },
  ];

  const usuarioPruebaAdmin = {
    id: UUID(),
    name: "Jesus",
    email: "prueba@gmail.com",
    password: bcrypt.hashSync("123456"),
    role: "admin",
  };

  const usuarioPrueba = {
    id: UUID(),
    name: "Juan",
    email: "pruebaQA@gmail.com",
    password: bcrypt.hashSync("123456"),
    role: "user",
  };

  await db.insert(Role).values(roles);
  await db.insert(User).values([usuarioPruebaAdmin, usuarioPrueba]);
}
