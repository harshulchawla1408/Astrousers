import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Add Apple and Facebook here similarly
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      const payload = {
        name: user.name,
        email: user.email,
        image: user.image,
        authProvider: account.provider,
      };

      try {
        await axios.post(process.env.NEXTAUTH_BACKEND_URL, payload);
        return true;
      } catch (err) {
        console.error("Auth failed:", err.message);
        return false;
      }
    },
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user }) {
      return token;
    },
  },
});

export { handler as GET, handler as POST };
