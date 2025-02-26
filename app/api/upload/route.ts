import { v2 as cloudinary, UploadStream } from 'cloudinary'
import { mkdir } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path';
import IncomingForm from 'formidable/Formidable';
import { Readable } from 'stream';
import { error } from 'console';
import { PrismaClient } from '@prisma/client'


cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

interface UplaodRequest {
    RequestType: "profilePhoto" | "session"
}

interface CloudinaryResult{
    public_id:string
}

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File;
        const uploadType = formData.get('type') as 'profile' | 'session';
        const relatedId = formData.get('id') as string

        if (!file || !uploadType || !relatedId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }


        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file Type only jpeg,png,webp are allowed" },
                { status: 400 }
            )
        }

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: "file size exceed the 5MB limit" },
                { status: 400 }
            )
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const redable = Readable.from(buffer);

        const uploadOptions = {
            folder: `${uploadType}_uploads/${relatedId}`,
            transformation: uploadType === 'profile' ?
                [{ width: 500, height: 500, crop: 'fill', gravity: 'face' }] :
                [],
            resource_type: 'auto' as const

        }

        const result = await new Promise<CloudinaryResult>((resolve, reject) => {
            const uplaodStream = cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as CloudinaryResult)
                }   
            )
            uplaodStream.end(buffer)
        }
    )

    const IMAGE_URL = cloudinary.url(result.public_id,{secure:true})

        if (uploadType === 'profile') {
            const user = await prisma.user.findUnique({
                where: { id: relatedId },
            })

            if(!user) return NextResponse.json({error:"User not found"})

            if (user?.profilePhoto) {
                await cloudinary.uploader.destroy(user.profilePhoto)
            }
            const updatedUser = await prisma.user.update({
                where: { id: relatedId },
                data: {
                    profilePhoto: IMAGE_URL,
                }
            })
            return NextResponse.json({success:true},{url:updatedUser.profilePhoto})

        }else if(uploadType==='session'){
            const user = await prisma.user.findUnique({
                where:{id:relatedId}
            })

            if(!user) return NextResponse.json({error:"User not found"})
            
            const updatedtimelog = await prisma.timeLog.update({
                where:{id:relatedId},
                data:{SessionPhoto:IMAGE_URL}
            })

            return NextResponse.json({success:true},{url:updatedtimelog.SessionPhoto||""})
        }


    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Upload failed' },
            { status: 500 }
        );

    }finally {
        await prisma.$disconnect();
    }

}