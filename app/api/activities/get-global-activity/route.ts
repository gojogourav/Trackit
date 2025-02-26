import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()
export async function GET(req: NextRequest) {
    try {
        const session  = await getServerSession()

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
                private:false
            },
            include:{timelogs:true}
        })

        return NextResponse.json({ activities }, { status: 200 })

    } catch (error) {
        console.log("Error creating session:", error);

        return NextResponse.json({ error }, { status: 500 });

    }
}