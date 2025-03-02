
import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
    try {
        const token = await req.cookies.get('access_token')?.value
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        if(!token) return NextResponse.json({error:"No token provided"})
        const decode = await jwtVerify(token,secret)
        const payload =  (await decode).payload
        const userId = String(payload.user)

        if (!userId) {
            return NextResponse.json({ error: "Session not provided" },{status:401});
        }


        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })


        const { 
            sessionTime,
            activityId,
            notes,
            SessionPhoto
        } = await req.json()
        console.log(activityId);
        

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
                activityId,
                notes,
                SessionPhoto,
                userId
            }
        })

        return NextResponse.json({ newSession },{status:200})
    } catch (error) {
        console.error("Error creating session:", error);
        return NextResponse.json({ error: "Internal server error" },{status:500});
    }

}