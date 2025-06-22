import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";  
import { db } from "./prisma";
import { compare } from "bcrypt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, 
    updateAge: 60 * 60
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) return null;

        return {
          id: user.id.toString(),
          email: user.email,
          username: user.username,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (token as any)["id"] = user.id.toString(); // always string
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id.toString(); // always string
      }
      return session;
    },
  },
};
