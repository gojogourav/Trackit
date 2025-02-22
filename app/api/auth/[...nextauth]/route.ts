import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient()
export const authOptions =  NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          console.log(credentials?.username);
          console.log(credentials?.password);
          
          if (!credentials?.username || !credentials?.password) {
            console.log("Credentials not provided correctly");
            
            return null
          }


          const user = await prisma.user.findFirst({
            where: { 
              OR:[
                {username:credentials.username},
                {email:credentials.username}
              ]
             }
          })

          if (!user) {
            console.log("THERE IS NO USER");
            
            return null
          }

          const verify = await bcrypt.compare(credentials.password, user?.password)
          console.log('THIS  VERIFICATION ',verify);
          
          if (!verify) {
            console.log("VERIFICATION FUCKING FAILED");
            
            return null
          }
          console.log(user.username);
          console.log(user.email);
          console.log(user.name);
          console.log(user.id);
          
          if(!user?.username||!user.email||!user.id) {
            console.log("The user details not available");
            
            return null
          }
          
          return {
            id: user.id.toString(),
            name: user.name||"",
            username: user.username,
            email: user.email
          }
        } catch (error) {
          console.error("Authentication error:", error);
          return null;

        }
      }
    })
  ],
  secret: process.env.NEXT_AUTH_SECRET_KEY,
  callbacks:{
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if(!token.id) throw new Error("no token provided")
      if(session.user){
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    }

  },
  session:{
    strategy:"jwt"
  },
  pages: {
    signIn: "/login",
    error: "/login" // Redirect errors to login page
  }

})

