import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose'



const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const accessToken = request.cookies.get("access_token")?.value;

        console.log(accessToken);
        
        if (!accessToken) {
            return NextResponse.json(
                { error: "Unauthorized: No access token provided" },
                { status: 401 }
            );
        }
        console.log("This");
        

        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        let payload;
        // console.log(secret);
        
        try {
            const result = await jose.jwtVerify(accessToken, secret);
             payload = result.payload 

        } catch (error) {
            console.log(error);
            
            return NextResponse.json(
                { error: "Unauthorized: Invalid access token" },
                { status: 401 }
            );
        }
        
        console.log("This is payload userId",payload.user);
        
        const userId =  `${payload.user}`
        console.log("This is payload user in get all api",userId);
        

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized: Invalid token structure" },
                { status: 401 }
            );
        }
        

        const users = await prisma.user.findMany({
            where: { 
                id: { 
                    not: userId
                } 
            },
            
        });

        console.log(users);
        
        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}