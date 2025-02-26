import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


const prisma = new PrismaClient()
export async function GET(req: NextRequest) {
    try {
       const session = await getServerSession();

        if (!process.env.JWT_ACCESS_SECRET) {
            console.error("JWT_ACCESS_SECRET is not defined in the environment.");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }


        const user = await prisma.user.findUnique({
            where: {
                id: session?.user.id
            }
        })

        if (!user) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 500 })
        }

        const {username } = await req.json();

        const RequestedUser = await prisma.user.findFirst({
            where:{
                username
            }
        })

        if(!RequestedUser){
            return NextResponse.json({error:"User not found"},{status:404})
        }
        const timelog = await prisma.timeLog.findMany({
            where: {
                activity:{
                    userId:session?.user.id
                }
            },
            include:{activity:true}
        })

        return NextResponse.json({ timelog }, { status: 200 })

    } catch (error) {
        console.log("Error creating session:", error);
        return NextResponse.json({ error }, { status: 500 });

    }
}