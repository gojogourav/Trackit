import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


const prisma = new PrismaClient()
export async function GET(req:NextRequest,{params}:{params:{id:string}}) {
    try{

        const user = await prisma.user.findUnique({
            where:{
                id:params.id
            }
        })

        if(!user) return NextResponse.json({error:"User not found"},{status:404})
        
        return NextResponse.json(user)
    }catch(error:any){
        return NextResponse.json({ error: error.message }, { status: 500 });

    }
}