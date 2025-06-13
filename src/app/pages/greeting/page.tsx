import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/";
import Link from "next/link";

export default async function GreetingPage() {
  const session = await getServerSession(authOptions);

  if (session?.user){
    return (
      <main className="min-h-screen flex items-center justify-center bg-blue-600">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm space-y-4 text-center">
        <h2 className="text-2xl font-bold text-blue-700">Welcome {session?.user.username}!</h2>
        <p className="text-gray-600">You have successfully signed in.</p>
      </div>
    </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-blue-600">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm space-y-4 text-center">
        <h2 className="text-2xl font-bold text-blue-700">
          <Link
            href="/auth/login"
            className="bg-white text-blue-700 font-semibold py-3 px-6 rounded-xl shadow hover:bg-blue-50 transition"
          >
            Go to Login
          </Link>
        </h2>
      </div>
    </main>
  );
}
