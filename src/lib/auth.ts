import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";  
import { db } from "./prisma";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt",
        maxAge: 60 * 60,
        updateAge: 60 * 60
    },
    pages: {
        signIn: '/auth/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
            email: { label: "Email", type: "email", placeholder: "andhika.aryaputra@gmail.com" },
            password: { label: "Password", type: "password" }
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const existingUser = await db.user.findUnique({
                    where: { email: credentials?.email }
                });

                if (!existingUser) {
                    return null;
                }

                const isPasswordValid = await compare(credentials.password, existingUser.password);

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: `${existingUser.id}` ,
                    email: existingUser.email,
                    username: existingUser.username
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    username: user.username
                }
            }
            return token
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    username: token.username
                }
            }
        }
    }
}