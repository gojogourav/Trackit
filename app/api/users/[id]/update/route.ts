// app/api/users/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { useSession } from 'next-auth/react';
const prisma =new PrismaClient()

export async function PUT(request: NextRequest,response:NextResponse) {
  try {
    const {data:session} = useSession();
    

    const body = await request.json();
    const { name, username, email, profilePhoto } = body;
    const id = session?.user.id
    if (!id) {
      return NextResponse.json({ error: 'User id is required' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        username,
        email,
        profilePhoto,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
