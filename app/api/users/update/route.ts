// app/api/users/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

import { jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
const prisma =new PrismaClient()

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, username, email,password } = body;

    const token = await request.cookies.get("access_token")?.value
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)

    if(!token) return NextResponse.json({error:"No token provided"})
    const result = await jwtVerify(token,secret)
    const payload = result.payload
    const id:string = String(payload.user)

    if (!id) {
      return NextResponse.json({ error: 'User id is required' }, { status: 400 });
    }
    
    const userbefore = await prisma.user.findFirst({
      where:{id:id!}
    })

    const verificationofPassword = await bcrypt.compare(password,userbefore?.password!)

    if(!verificationofPassword) return NextResponse.json({error:"incorrect password "})


    const updatedUser = await prisma.user.update({
      where: {id:id!} ,
      data: {
        name,
        username,
        email,
      },
    });

    if(!updatedUser){
      return NextResponse.json({error:"User not found"},{status:404})
    }

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
