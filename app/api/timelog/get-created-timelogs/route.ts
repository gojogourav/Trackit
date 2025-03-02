import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";

import { NextRequest, NextResponse } from "next/server";


const prisma = new PrismaClient()
export async function GET(req: NextRequest) {
    try {
        const token = await req.cookies.get('access_token')?.value
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        if (!token) return NextResponse.json({ error: "No token provided" })
        const decode = await jwtVerify(token, secret)
        const payload = (await decode).payload
        const userId = String(payload.user)


        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 500 })
        }

        // const { username } = await req.json();

        const RequestedUser = await prisma.user.findFirst({
            where: {
                id:userId
            }
        })

        if (!RequestedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }
        const timelog = await prisma.timeLog.findMany({
            where: {
                activity: {
                    userId: userId
                }
            },
            include: { activity: true }
        })

        return NextResponse.json({ timelog }, { status: 200 })

    } catch (error) {
        console.log("Error creating session:", error);
        return NextResponse.json({ error }, { status: 500 });

    }
}