// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';

const prisma = new PrismaClient();
export async function POST(req: Request) {
  const { identifier, password } = await req.json();
    
  try {
    console.log("THIS IS THE IDENTIFIER IN SERVER ",identifier);
    
    const user = await prisma.user.findFirst({ where: {OR:[{username:identifier},{email:identifier}]} } );
    console.log(user);
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return NextResponse.json({ error: 'Invalid credentials' }, { status: 403 });
    console.log(validPassword);
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new jose.SignJWT({ user: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2y')
      .sign(secret);

    const response = NextResponse.json({ success: true });
    response.cookies.set('access_token', token, {
      sameSite: 'strict',
      maxAge: 60 * 60 * 24*365*2
    });

console.log(response);

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}