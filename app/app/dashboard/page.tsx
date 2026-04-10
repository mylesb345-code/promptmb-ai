"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  prompt: string;
  github_url: string;
  vercel_url: string;
  created_at: string;
  status: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth/login");
        return;
      }

      setUser(session.user);
      
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        setProjects(data || []);
      }
      setLoading(false);
    };

    getUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-red-500">PromptMB AI</h1>
          <p className="text-gray-400 mt-2">Welcome, {user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <Link
        href="/dashboard/create"
        className="inline-block bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-semibold mb-8"
      >
        + Create New Project
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <p className="text-gray-400 col-span-full">
            No projects yet. Create one to get started!
          </p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-900 border border-red-500 p-6 rounded hover:border-red-400 transition"
            >
              <h3 className="text-xl font-bold mb-2">{project.name}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {project.prompt}
              </p>

              <div className="flex items-center justify-between">
                <span
                  className={`text-sm px-3 py-1 rounded ${
                    project.status === "live"
                      ? "bg-green-600"
                      : project.status === "generating"
                      ? "bg-yellow-600"
                      : project.status === "deploying"
                      ? "bg-blue-600"
                      : "bg-red-600"
                  }`}
                >
                  {project.status.toUpperCase()}
                </span>

                {project.vercel_url && (
                  <a
                    href={project.vercel_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    → Visit
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
