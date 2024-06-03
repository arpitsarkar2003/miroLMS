import { db } from "@/lib/db";

export const getProgress = async (
    courseId: string,
    userId: string
): Promise<number> => {
    try {

        const publishedChapters = await db.chapter.findMany({
            where: {
                courseId,
                isPublished: true
            },
            select: {
                id: true
            }
        });
    
        const publishedChaptersId = publishedChapters.map((chapter) => chapter.id);

        const validCompletedChapters = await db.userProgress.findMany({
            where: {
                userId: userId,
                chapterId: {
                    in: publishedChaptersId
                }
            },
            select: {
                chapterId: true
            }
        });

        console.log(validCompletedChapters);
        

        const progressPercentage = (validCompletedChapters.length / publishedChapters.length) * 100;
    
        return progressPercentage;

    } catch (error) {
        console.error("[GET_PROGRESS] Error fetching progress for course:", courseId, "and user:", userId, error);
        return 0;
    }
}
