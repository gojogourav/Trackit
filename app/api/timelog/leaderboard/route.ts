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

        const fetch = async (userId: string) => {
            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            return user
        }
        // const user = await prisma.user.findUnique({


        if (!fetch(userId)) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 500 })
        }



        const timelog = await prisma.timeLog.groupBy({
            by: ['userId'],
            _sum: {
                sessionTime: true,
            },
            orderBy: {
                _sum: {
                    sessionTime: 'desc',
                },
            },

        })

        

        const userIds = timelog.map(entry=>entry.userId)

        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
        });

        const transformedData = timelog.map(entry => ({
            userId: entry.userId,
            _sum: {
                time: entry._sum.sessionTime || 0 // Rename sessionTime to time
            },
            user: users.find(user=>user.id===entry.userId)
        }));


        console.log(transformedData);


        return NextResponse.json([transformedData], { status: 200 })

    } catch (error) {
        console.log("Error creating session:", error);

        return NextResponse.json({ error }, { status: 500 });

    }
}