"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProject() {
  const [prompt, setPrompt] = useState("");
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const generateAndDeploy = async () => {
    if (!prompt || !projectName) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const generateRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!generateRes.ok) throw new Error("Failed to generate code");

      const { code } = await generateRes.json();

      const deployRes = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, prompt, code }),
      });

      if (!deployRes.ok) throw new Error("Failed to deploy");

      const { vercelUrl } = await deployRes.json();

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);

      alert(`🚀 Your app is live at: ${vercelUrl}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-red-500 mb-8">
          Create New Project
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="my-awesome-app"
              className="w-full px-4 py-3 bg-gray-900 border border-red-500 rounded text-white placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Describe Your App
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Build me a todo list app with dark mode..."
              rows={6}
              className="w-full px-4 py-3 bg-gray-900 border border-red-500 rounded text-white placeholder-gray-500 resize-none"
            />
          </div>

          {error && <p className="text-red-400">{error}</p>}

          <button
            onClick={generateAndDeploy}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 py-3 rounded font-semibold text-lg"
          >
            {loading ? "🚀 Deploying..." : "🚀 Generate & Deploy (1-Click)"}
          </button>

          <p className="text-gray-400 text-sm">
            ✨ This will generate your code, push it to GitHub, and deploy it
            live on Vercel automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
