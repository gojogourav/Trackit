import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";


const prisma = new PrismaClient()
export async function GET(req: NextRequest, { params }: { params: { username: string } }) {

    const username = await params.username
    try {

        const cookie = await req.cookies.get("access_token")?.value
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)

        if (!cookie) return NextResponse.json({ error: "No cookie provided" });
        const result = await jwtVerify(cookie, secret)
        const payload = result.payload


        console.log("THIS IS USERNAME", username);

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    {username},
                    {id:username}
                ]
            },

        })


        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

        return NextResponse.json(user)
    } catch (error: any) {
        console.log(error);

        return NextResponse.json({ error: error.message }, { status: 500 });

    }
}