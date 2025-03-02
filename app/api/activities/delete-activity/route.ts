import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { jwtVerify } from "jose";

const prisma = new PrismaClient();

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

        const { activityId } = await req.json();
        if (!activityId ) {
            return NextResponse.json({ error: "Missing activityId" },{status:400});
        }

        const isCreator = await prisma.activity.findFirst({
            where: {
                id: activityId,
                userId:userId
            }
        })


        if (!isCreator) {
            return NextResponse.json({ error: "Cannot delete activity" }, { status: 401 })
        }

        await prisma.timeLog.deleteMany({
            where: { activityId: activityId }
          });
        
        const deletedActivity = await prisma.activity.delete({
            where: { id: activityId }
        })


          

        return NextResponse.json({
            message: "Successfully deleted the activity", activity:deletedActivity,
        }, { status: 200 });

    } catch (error) {
        console.error("Error deleting activity:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
