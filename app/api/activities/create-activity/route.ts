
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
            description,
            activityTitle,
            Activityphoto, 
        } = await req.json()
        
        console.log(activityTitle);
        

        if(!activityTitle){
    return NextResponse.json({error:"Please activity must have some title"},{status:401})
        }

        if (!user ) {
            return NextResponse
            .json({ error: "Failed to authenticate user" },{status:402})
        }

        const newActivity = await prisma.activity.create({
            data: {
                userId:userId,
                description,
                activityTitle:activityTitle,
                Activityphoto,
                members:{connect:[{id:userId}]}
            }
        })


        return NextResponse.json({ newActivity },{status:200})
    } catch (error) {
        console.log("Error creating activity:", error);
        
        return NextResponse.json({ error },{status:500});
    }

}