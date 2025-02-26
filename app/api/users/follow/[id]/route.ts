// app/api/users/follow/route.ts
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';


const prisma = new PrismaClient()
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await request.cookies.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unautorized access" }, { status: 404 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    
      const result = await jwtVerify(token, secret);
      const payload = result.payload


      const userid = String(payload.user)

      const followingId =  params.id
      console.log("THIS IS FOLLOWING ID ", followingId);
      console.log("THIS IS USER ID ", userid);

      if (!followingId) {
        return NextResponse.json({ error: 'Missing followerId or followingId' }, { status: 400 });
      }

      const isFollowing = await prisma.user.findFirst({
        where: {
          id: userid!,
          following: {
            some: { id: followingId }
          }
        }

      })
      console.log("THIS IS ISFOLLOWING", isFollowing);




      await prisma.user.update({
        where: { id: userid },
        data: {
          following: isFollowing ? { disconnect: { id: followingId } } : { connect: { id: followingId } },
        },
      });

      console.log("Successfully followed/unfollowed the user");
      

      return NextResponse.json({ isFollowing });
   
  } catch (error) {
    console.log(error);
    
          console.error("Error fetching users:", error);
          return NextResponse.json(
              { error: "Internal Server Error" },
              { status: 500 }
          );
      } finally {
          await prisma.$disconnect();
      }
}