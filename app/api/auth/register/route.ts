// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { profilePic,name,email,username, password } = await req.json();
  try {
    const userAlreadyExists = await prisma.user.findFirst({ where: {OR:[{username:username},{email:email}]} } );
    if (userAlreadyExists){
       return NextResponse.json({ error: 'User already exists ' }, { status: 401 });
      }
    const hashedPassword = await bcrypt.hash(password,12)

    const user = await prisma.user.create({
      data:{
        email,
        username,
        profilePhoto:profilePic||"",
        name,
        password:hashedPassword
      }
    })

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new jose.SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(secret);

    const response = NextResponse.json({ success: true });
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 2
    });

    return NextResponse.json(response)
  } catch (error) {
    console.log(error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}