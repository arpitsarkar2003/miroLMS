import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";

import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { CourseEnrollWrapper } from "./_components/CourseEnrollWrapper";

interface ChapterIdPageProps {
    params: { courseId: string; chaptersId: string };
}

const ChapterIdPage = async ({ params }: ChapterIdPageProps) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/sign-in");
    }

    const {
        chapter,
        course,
        userProgress,
        muxData,
        attachments,
        nextChapter,
        prevChapter,
        purchase,
    } = await getChapter({
        userId,
        courseId: params.courseId,
        chapterId: params.chaptersId,
    });

    if (!chapter || !course) {
        return redirect("/");
    }

    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;

    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner
                    variant="success"
                    label="You have completed this chapter"
                />
            )}
            {isLocked && (
                <Banner
                    variant="warning"
                    label="You need to purchase this course to watch this chapter"
                />
            )}
            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    <VideoPlayer
                        chapterId={params.chaptersId}
                        title={chapter.title ?? "No Title"}
                        courseId={params.courseId}
                        nextChapterId={nextChapter?.id ?? ""}
                        prevChapterId={prevChapter?.id ?? ""}
                        completeOnEnd={completeOnEnd}
                        playbackId={muxData?.playbackId ?? ""}
                        isLocked={isLocked}
                    />
                </div>
                <div>
                    <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                        <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
                        <CourseEnrollWrapper
                            courseId={params.courseId}
                            price={course.price ?? 0}
                            isPurchased={!!purchase}
                            chapterId={params.chaptersId}
                            nextChapterId={nextChapter?.id ?? ""}
                            prevChapterId={prevChapter?.id ?? ""}
                            userProgress={userProgress!}
                        />
                    </div>
                    <Separator />
                    <div>
                        <Preview    
                        value={chapter.description ?? "No Description"}
                         />
                    </div>
                    {!!attachments.length && (
                        <>
                            <Separator />
                            <div className="p-4">
                                {attachments.map((attachment) => (
                                    <a
                                        href={attachment.url ?? undefined}
                                        target="_blank"
                                        key={attachment.id}
                                        className="flex items-center p-3 w-full bg-sky-200 text-sky-700 rounded-md hover:underline"
                                    >
                                        {attachment.name}
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChapterIdPage;
