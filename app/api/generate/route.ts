import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a senior full-stack developer. Generate production-ready HTML/CSS/JavaScript code.
          - Complete, runnable HTML file
          - Responsive design
          - Dark theme (black background, white/red text)
          - Tailwind CSS classes
          - No external dependencies
          Return ONLY the HTML code, nothing else. Start with <!DOCTYPE html>`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 3000,
      temperature: 0.7,
    });

    const code = response.choices[0].message.content;

    return NextResponse.json({ code });
  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate code" },
      { status: 500 }
    );
  }
}
