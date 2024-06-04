import { db } from "@/lib/db";

export const getProgress = async (
    courseID: string,
    userID: string
): Promise<number> => {
    try {
        const publishedChapters = await db.chapter.findMany({
            // where: {
            //     courseId,
            //     isPublished: true
            // },
            // select: {
            //     id: true
            // }
            where: {
                courseId: courseID,
                isPublished: true,
            }
        });

        // console.log("publishedChapters", publishedChapters);
    
        const publishedChaptersId = publishedChapters.map((chapter) => chapter.id);

        // console.log("publishedChaptersId", publishedChaptersId);

        const validCompletedChapters = await db.userProgress.findMany({
            where: {
                userId: userID,
                chapterId: {
                    in: publishedChaptersId
                },
                isCompleted: true
            }
            // select: {
            //     chapterId: true
            // }
        });

        // console.log("validCompletedChapters", validCompletedChapters);
        

        if (publishedChapters.length > 0) {
            return (validCompletedChapters.length / publishedChapters.length) * 100;
        }

        return 0;

    } catch (error) {
        console.error("[GET_PROGRESS] Error fetching progress for course:", courseID, "and user:", userID, error);
        return 0;
    }
}
