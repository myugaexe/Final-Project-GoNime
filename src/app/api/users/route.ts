import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";  
import * as z from "zod";

//Define a input schema for validation
const userSchema = z.object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
    })

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, username, password } = userSchema.parse(body);

        //Check if Email is taken
        const existingUserByEmail = await db.user.findUnique({
            where: { email: email }
        });
        if (existingUserByEmail) {
            return NextResponse.json({ message: "User with this email already exists" }, { status: 409 });
        }

        //Check if Username is taken
        const existingUserByUsername = await db.user.findUnique({
            where: { username: username }
        });
        if (existingUserByUsername) {
            return NextResponse.json({ message: "User with this username already exists" }, { status: 409 });
        }

        //Add data to DB
        const hashedPassword = await hash(password, 10);
        const newUser = await db.user.create({
            data: {
                email: email,
                username: username,
                password: hashedPassword
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: __, ...userWithoutPassword } = newUser;

        return NextResponse.json({user: userWithoutPassword, message: "User created successfully"}, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}