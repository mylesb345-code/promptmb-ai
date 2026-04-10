"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-red-500 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-500">PromptMB AI</h1>
        <div className="flex gap-4">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-gray-400 hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-6">
          Generate Apps in <span className="text-red-500">Seconds</span>
        </h2>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Describe your app idea. AI generates production-ready code. Deploy to GitHub and Vercel instantly.
        </p>

        <div className="flex gap-4 justify-center mb-12">
          {isAuthenticated ? (
            <Link
              href="/dashboard/create"
              className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded text-lg font-semibold"
            >
              🚀 Create Your First App
            </Link>
          ) : (
            <>
              <Link
                href="/auth/signup"
                className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded text-lg font-semibold"
              >
                Get Started Free
              </Link>
              <Link
                href="https://github.com/mylesb345-code/promptmb-ai"
                target="_blank"
                className="border border-red-500 hover:bg-red-500 hover:bg-opacity-10 px-8 py-4 rounded text-lg font-semibold"
              >
                GitHub
              </Link>
            </>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="p-6 border border-red-500 rounded">
            <h3 className="text-2xl font-bold mb-2">🤖 AI-Powered</h3>
            <p className="text-gray-400">GPT-4o-mini generates code</p>
          </div>
          <div className="p-6 border border-red-500 rounded">
            <h3 className="text-2xl font-bold mb-2">📦 1-Click Deploy</h3>
            <p className="text-gray-400">GitHub + Vercel automatic deployment</p>
          </div>
          <div className="p-6 border border-red-500 rounded">
            <h3 className="text-2xl font-bold mb-2">🔐 Secure</h3>
            <p className="text-gray-400">Full control of your code</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-red-500 text-center py-6 text-gray-400 mt-20">
        <p>Built with ❤️ by PromptMB AI</p>
      </footer>
    </div>
  );
}
