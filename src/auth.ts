import { compareSync } from "bcrypt-ts-edge";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/db";
import { cookies } from "next/headers";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  //adapter: PrismaAdapter(prisma),
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        if (user && user.password) {
          const isMatch = await compareSync(
            credentials.password as string,
            user.password
          );

          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      // session.user.id = token.sub;
      // session.user.role = token.role;
      // if (trigger === "update") {
      //   session.user.name = user.name;
      //   session.user.role = token.role;
      // }
      // return session;

      // Fetch latest user data from the database
      const dbUser = await prisma.user.findUnique({
        where: { id: token.sub },
        select: { id: true, role: true, name: true, email: true },
      });

      if (dbUser) {
        session.user.id = dbUser.id;
        session.user.role = dbUser.role;
        session.user.name = dbUser.name;
        session.user.email = dbUser.email;
      }

      return session;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ user, token, trigger }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;

        if (trigger === "signIn" || trigger === "signUp") {
          const cookiesObject = await cookies();
          const configId = cookiesObject.get("configId")?.value;
          if (configId) {
            const tempConfig = await prisma.tempConfig.findFirst({
              where: {
                id: configId,
              },
            });

            if (tempConfig) {
              await prisma.user.update({
                where: {
                  id: user.id,
                },
                data: {
                  config: {
                    create: {
                      image: tempConfig.image,
                      shirtColor: tempConfig.shirtColor,
                      shirtSize: tempConfig.shirtSize,
                    },
                  },
                },
              });

              // del
              await prisma.tempConfig.deleteMany({
                where: {
                  id: tempConfig.id,
                },
              });
            }
          }
        }
      }

      return token;
    },
  },
});
