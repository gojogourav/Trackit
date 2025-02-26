import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


const prisma = new PrismaClient()
export async function GET(req: NextRequest) {
    try {

        const session = await getSession()
        const user = await prisma.user.findUnique({
            where: {
                id: session?.user.id
            }
        })

        if (!user) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 500 })
        }

        const { timelogId } = await req.json();



        const timelog = await prisma.timeLog.findFirst({
            where: {
                id: timelogId
            },
            include: { activity: true }
        })

        return NextResponse.json({ timelog }, { status: 200 })

    } catch (error) {
        console.log("Error creating session:", error);

        return NextResponse.json({ error }, { status: 500 });

    }
}