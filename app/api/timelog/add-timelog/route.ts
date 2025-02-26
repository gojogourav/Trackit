import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession()
        if (!session) {
            return NextResponse.json({ error: "Session not provided" },{status:401});
        }


        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id
            }
        })


        const { 
            sessionTime,
            timeLogTitle,
            activityId,
            notes,
            SessionPhoto

        } = await req.json()

        if (!activityId) {
            return NextResponse.json({ error: "Please select a activity before submitting" },{status:401})
        }
        const activity = await prisma.activity.findUnique({
            where:{
                id:activityId
            }
        })

        if(!activity){
            return NextResponse.json({ error: "Invalld activity is chosen" },{status:401})

        }


        if (!user) {
            return NextResponse.json({ error: "Failed to authenticate user" })
        }

        const newSession = await prisma.timeLog.create({
            data: {
                sessionTime,
                timeLogTitle,
                activityId,
                notes,
                SessionPhoto,

            }
        })

        return NextResponse.json({ newSession },{status:200})
    } catch (error) {
        console.error("Error creating session:", error);
        return NextResponse.json({ error: "Internal server error" },{status:500});
    }

}