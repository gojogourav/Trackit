import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";


const prisma = new PrismaClient()
export async function GET(req:NextRequest) {
    
    try{
        
        const cookie = await req.cookies.get("access_token")?.value
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)

        if(!cookie) return NextResponse.json({error:"No cookie provided"});
        const result = await jwtVerify(cookie,secret)
        const payload= result.payload
        const userId = String(payload.user)


        const user = await prisma.user.findUnique({
            where:{
                id:userId
            },
        })


        if(!user) return NextResponse.json({error:"User not found"},{status:404})
        
        return NextResponse.json(user)
    }catch(error:any){
        console.log(error);
        
        return NextResponse.json({ error: error.message }, { status: 500 });

    }
}