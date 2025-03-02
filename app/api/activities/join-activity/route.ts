import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    // Only allow POST req
    

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
        if (!activityId) {
            return NextResponse.json({ error: "Missing activityId" },{status:400});
        }

        const activity = await prisma.activity.findUnique({
            where: { id: activityId },
        });
        
        if (!activity) {
            return NextResponse.json({ error: "Activity not found" },{status:404});
        }

        // Check if the activity is private
        if (activity.private) {
            return NextResponse.json({ error: "This activity is private. You cannot join it." },{status:403});
        }



        // Add the user to the activity's members list using Prisma's connect
        const isJoinedActivity = await prisma.activity.findFirst({
            where:{
                id:activityId,
                members:{
                    some:{id:userId}
                }
            }
        })
        
        const updatedActivity = await prisma.activity.update({
            where: { id: activityId },
           data:isJoinedActivity?{members:{disconnect:{id:userId}}}:{members:{connect:{id:userId}}}
        });

        return NextResponse.json(isJoinedActivity?{
            message: "Successfully exited the activity",
            activity: updatedActivity,
        }:{message: "Successfully joined the activity",
            activity: updatedActivity},{status:200});
    } catch (error) {
        console.error("Error joining activity:", error);
        return NextResponse.json({ error: "Internal server error" },{status:500});
    }
}
