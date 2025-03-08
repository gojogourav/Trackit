// app/api/ai/advice/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY!);
const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
    const token = await req.cookies.get('access_token')?.value
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    if (!token) return NextResponse.json({ error: "No token provided" })
    const decode = await jwtVerify(token, secret)
    const payload = (await decode).payload
    const userId = String(payload.user)

    // Get user data
    const userData = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            timeLog: {
                orderBy: { createdAt: "desc" },
                take: 10, // Last 10 sessions.
                include: {
                    activity: true
                }
            }

        }
    });

    // Prepare AI prompt
    const prompt = `
    Analyze this user's productivity data and give specific improvement suggestions:
    
    User: ${userData?.name}
    Total Focus Hours: ${userData?.timeLog.reduce((acc, log) => acc + (log.sessionTime / 3600), 0)} hrs
    Last Sessions:
    ${userData?.timeLog.map(log =>
        `- ${log.activity.activityTitle}: ${log.sessionTime / 3600}hrs on ${log.createdAt.toDateString()}`
    ).join('\n')}

    Compare with previous performance and answer:
    1. When are they most productive? use **Most productive time** as title
    2. Which activity needs more focus? use **Most focused Activity** as title
    3. Recommend daily goals based on patterns, use **Reccomded daily goal**  as title
    4. Give one actionable tip **Actionable tip** as title
    5. Create a 24-hour "Productivity Time Machine" schedule based on my best historical sessions:
    Structure it like:
**🕗 8AM-10AM** ☑️Deep Work (Your 90th percentile focus time!) 
**🕛 12PM-1PM** ☑️Learning (When you retain info best)

    
    Keep response under 80 words. Don't use numbers after each point. Don't use ":" and 
   
  `;

    // Get AI response
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const text = await result.response.text();

        console.log("THIS IS THE GEMINI THOUGHTS ON YOU NIGGA");
        console.log(text);

        return NextResponse.json({ advice: text });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "AI analysis failed" },
            { status: 500 }
        );
    }
}