import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
    try {
      
        const session = await getServerSession()
        
        const user = await prisma.user.findUnique({
            where: {
                id: session?.user.id
            }
        })

        const { 
            description,
            activityTitle,
            Activityphoto, 
            isPrivate
        } = await req.json()

        if(!activityTitle){
    return NextResponse.json({error:"Please activity must have some title"},{status:401})
        }

        if (!user ) {
            return NextResponse
            .json({ error: "Failed to authenticate user" },{status:402})
        }

        const newActivity = await prisma.activity.create({
            data: {
                userId:session?.user.id||"",
                description,
                activityTitle:activityTitle,
                private:isPrivate,
                Activityphoto
            }
        })


        return NextResponse.json({ newActivity },{status:200})
    } catch (error) {
        console.log("Error creating session:", error);
        
        return NextResponse.json({ error },{status:500});
    }

}