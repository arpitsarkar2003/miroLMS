"use client";

import { CourseProgressButton } from "./CourseProgressButton";
import { CourseEnrollButton } from "./course-ernroll-button";


interface CourseEnrollWrapperProps {
    courseId: string;
    price: number;
    isPurchased: boolean;
    chapterId: string;
    nextChapterId?: string; // Optional prop
    prevChapterId?: string; // Optional prop
    userProgress?: { isCompleted: boolean }; // Optional prop
}

export const CourseEnrollWrapper = ({
    courseId,
    price,
    isPurchased,
    chapterId,
    nextChapterId,
    prevChapterId,
    userProgress,
}: CourseEnrollWrapperProps) => {
    return (
        <>
            {isPurchased ? (
                <CourseProgressButton
                    chapterId={chapterId}
                    courseId={courseId}
                    nextChapterId={nextChapterId ?? ""}
                    prevChapterId={prevChapterId ?? ""}
                    iscompleted={userProgress?.isCompleted!}
                />
            ) : (
                <CourseEnrollButton courseId={courseId} price={price} />
            )}
        </>
    );
};
