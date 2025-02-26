import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient()
export async function GET(req: NextRequest) {
    try {
        
        const session = await getServerSession();

        const user = await prisma.user.findUnique({
            where: {
                id: session?.user.id
            }
        })

        if (!user) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 500 })
        }

        const activities = await prisma.activity.findMany({
            where: {
                userId: session?.user.id
            }
        })

        return NextResponse.json({ activities }, { status: 200 })

    } catch (error) {
        console.log("Error creating session:", error);

        return NextResponse.json({ error }, { status: 500 });

    }
}