import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const prisma = new PrismaClient()
export default async function isFollowingUser(userId:string){
    
    const token = (await cookies()).get("access_token")?.value
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)

    if(!token) return;
    const {payload} = await jwtVerify(token,secret)


    const isFollowing = await prisma.user.findFirst({
        where: {
          id: payload.user!,
          following: {
            some: { id: userId }
          }
        }

      })

    if(isFollowing){
        return true;
    }else{
        return false;
    }

}