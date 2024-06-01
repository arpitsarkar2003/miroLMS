import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });   
        }

        const Course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        });

        if(!Course) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // const hasPublishedChapter = Course.chapters.some((chapter) => chapter.isPublished);

        // if(hasPublishedChapter) {
        //     return new NextResponse("Not Found", { status: 401 });
        // }

        if(!Course.title || !Course.description || !Course.imageUrl) {
            return new NextResponse("Missing Required Fields", { status: 401 });
        };

        const publishedCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId,
            },
            data: {
                isPublished: true
            }
        });

        return NextResponse.json(publishedCourse);


    } catch (error) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
}