import Mux from '@mux/mux-node';
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const mux = new Mux({
  tokenId: process.env['MUX_TOKEN_ID'],
  tokenSecret: process.env['MUX_TOKEN_SECRET'],
});

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } } ) {
    try {
        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            }
        });

        if(!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownChapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            }
        });

        if(!ownChapter) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(ownChapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            });
            
            if(existingMuxData && existingMuxData.assetId) {
                await mux.video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                });
            }
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId
            }
        });

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true
            }
        });
        
        if(publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId
                },
                data: {
                    isPublished: false
                }
            });
        }

        return NextResponse.json(deletedChapter);


    } catch (error) {
        console.log("[CHAPTER_ID_DELETE]",error);
        return new NextResponse("Internal Errorrrrrrrrrrrrrrrr", { status: 500 });
    }
  }

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    // Validate authentication
    if (!userId) {
      return new NextResponse("Unauthorized: User not authenticated", { status: 401 });
    }

    // Parse and validate request body
    const { isPublished, ...values } = await req.json();

    if (!params.courseId || !params.chapterId) {
      return new NextResponse("Bad Request: Missing course or chapter ID", { status: 400 });
    }

    // Validate ownership of the course
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized: User does not own this course", { status: 401 });
    }

    // Ensure the chapter belongs to the course
    const ownChapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!ownChapter) {
      return new NextResponse("Unauthorized: Chapter does not belong to this course", { status: 401 });
    }

    // Update the chapter
    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
      },
      data: {
        ...values,
      },
    });

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId
        }
      });

      if (existingMuxData && existingMuxData.assetId) {
        await mux.video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id
          }
        });
      }

      const asset = await mux.video.assets.create({
        playback_policy: ['public'],
        input: values.videoUrl,
        test: false,
      });

      await db.muxData.create({
        data: {
          assetId: asset.id,
          chapterId: params.chapterId,
          playbackId: asset.playback_ids?.[0]?.id,
        }
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Server Erroreeeeeeeeeeeeeeeee", { status: 500 });
  }
}
