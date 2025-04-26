import NextAuth, { type AuthOptions } from "next-auth"; // <-- importamos el tipo AuthOptions
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../prisma/lib/prisma"; // <-- importamos el prisma
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = { // <-- le decimos que esto es de tipo AuthOptions
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) return null;

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // ahora ya no tira error
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id as string;
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
};

export const { auth } = NextAuth(authOptions);
