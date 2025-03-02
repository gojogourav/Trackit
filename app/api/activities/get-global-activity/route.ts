import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()
export async function GET(req: NextRequest) {
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