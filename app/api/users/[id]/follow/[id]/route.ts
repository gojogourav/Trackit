// app/api/users/follow/route.ts
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { useSession } from 'next-auth/react';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()
export async function POST(request: NextRequest) {
  // Follow a user

    
  try {
    const {data:session} = useSession();

    const userid:string = session?.user.id||"";

    const body = await request.json();
    const {  followingId } = body;

    if ( !followingId) {
      return NextResponse.json({ error: 'Missing followerId or followingId' }, { status: 400 });
    }

    // Add following relation (using the self-relation defined in your schema)
    const isFollowing = await prisma.user.findFirst({
        where:{
            id:userid!,
            following:{
                some:{id:followingId}
            }
        }
    })
    
    await prisma.user.update({
      where: {id:userid! },
      data: {
        following:isFollowing?{ disconnect: { id: followingId } }: { connect: { id: followingId } },
      },
    });

    return NextResponse.json({ message: 'Followed successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

