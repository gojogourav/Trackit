import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";

import { NextRequest, NextResponse } from "next/server";


const prisma = new PrismaClient()
export async function GET(req: NextRequest,{params}:{params:{username:string}}) {
    try {
        const token = await req.cookies.get('access_token')?.value
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        if (!token) return NextResponse.json({ error: "No token provided" })
        const decode = await jwtVerify(token, secret)
        const payload = (await decode).payload
        const userId = String(payload.user)

        const username =  await params.username
        console.log("THIS IS USERNAME IN GETUSERTIMELOG",username);
        

        const user2 = await prisma.user.findFirst({
            where:{
                username
            }
        })
        if(!user2?.id){
            return NextResponse.json({error:"404 user not found !!"})
        }

        const isFollowing = await prisma.user.findUnique({
            where: {
                id: userId,
                following:{
                    some:{
                        id:user2.id
                    }
                }
                
            }
        })

        console.log("THIS IS THE ISFOLLOWING IN GETUSERTIMELOGS ",isFollowing);
        

        
        

        if (!isFollowing) {
            console.log("NOT FOLLOWING IS EXECUTED HERE");
            
            return NextResponse.json({timelog:[]},{status:200})
        }

        const timelog = await prisma.timeLog.findMany({
            where: {
                activity: {
                    userId: user2.id
                },
            },
            include:{
                activity:true
            }
        })
        // console.log("THIS IS TIMEELOG", timelog);
        

        return NextResponse.json({ timelog }, { status: 200 })

    } catch (error) {
        console.log("Error creating session:", error);
        return NextResponse.json({ error }, { status: 500 });

    }
}