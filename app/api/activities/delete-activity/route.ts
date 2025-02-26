import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession()

        const { activityId } = await req.json();
        if (!activityId ) {
            return NextResponse.json({ error: "Missing activityId" },{status:400});
        }

        const isCreator = await prisma.activity.findFirst({
            where: {
                id: activityId,
                userId:session?.user.id
            }
        })


        if (!isCreator) {
            return NextResponse.json({ error: "Cannot delete activity" }, { status: 401 })
        }

        await prisma.timeLog.deleteMany({
            where: { activityId: activityId }
          });
        
        const deletedActivity = await prisma.activity.delete({
            where: { id: activityId }
        })


          

        return NextResponse.json({
            message: "Successfully deleted the activity", activity:deletedActivity,
        }, { status: 200 });

    } catch (error) {
        console.error("Error deleting activity:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
