import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

interface GetChapterProps {
    courseId: string;
    chapterId: string;
    userId: string;
}

export const getChapter = async ({
    courseId,
    chapterId,
    userId,
}: GetChapterProps) => {
    try {
        const purchase = await db.purchase.findFirst({
            where: {
                userId,
                courseId,
            }
        });

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                isPublished: true
            },
            select: {
                price: true,
                chapters: {
                    include: {
                        userProgress: true
                    }
                }
            }
        });

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true
            },
        });

        if (!chapter || !course) {
            throw new Error("Chapter or course not found");
        }

        let muxData = null;
        let attachments: Attachment[] = [];
        let nextChapter: Chapter | null = null;
        let prevChapter: Chapter | null = null;

        if (purchase) {
            attachments = await db.attachment.findMany({
                where: {
                    courseId: courseId,
                }
            });
        }

        if (chapter.isFree || purchase) {
            muxData = await db.muxData.findUnique({
                where: {
                    chapterId: chapterId,
                }
            });

            nextChapter = await db.chapter.findFirst({
                where: {
                    courseId: courseId,
                    isPublished: true,
                    position: {
                        gt: chapter?.position
                    }
                },
                orderBy: {
                    position: 'asc'
                }
            });

            prevChapter = await db.chapter.findFirst({
                where: {
                    courseId: courseId,
                    isPublished: true,
                    position: {
                        lt: chapter?.position
                    }
                },
                orderBy: {
                    position: 'desc'
                }
            });
        }

        const userProgress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId
                }
            }
        });

        // Using raw mongo queries here.
        // Get the overallUserProgress

        const overallUserProgress = await db.userProgress.findMany({});

        // console.log("Overall User progress:", overallUserProgress);

        return {
            chapter,
            course,
            userProgress,
            muxData,
            attachments,
            nextChapter,
            prevChapter,
            purchase
        }
        
    } catch (error) {
        console.log("[GET-CHAPTER]", error);
        return {
            chapter: null,
            course: null,
            userProgress: null,
            muxData: null,
            attachments: [],
            nextChapter: null,
            prevChapter: null,
            purchase: null
        }
    }
}
