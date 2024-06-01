import Error from "@/app/error";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";
import CourseSidebarItem from "./course-sidebar-Item";

interface CourseSidebarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[];
    };
    progressCount: number;
}

export const CourseSidebar = async({
    course,
    progressCount
}: CourseSidebarProps) => {

    const {userId} = auth();

    if (!userId) {
        return redirect("/sign-in");
    }

    const purchase = await db.purchase.findFirst({
        // where: {
        //    userId_courseId: {
        //        userId,
        //        courseId: course.id,
        //    }
        // }
        where: {
            userId,
            courseId: course.id
        }
    });


    return (
        <div className="h-full md:border-r flex flex-col overflow-y-auto shadow-sm">
            <div className="p-8 flex flex-col border-b">
                 <h1 className="font-semibold">{course.title}</h1>
                {/* check purchase and add progress */}
            </div>
           <div className="flex flex-col w-full">

                {course.chapters.map((chapter, index) => (
                    <CourseSidebarItem 
                        key={chapter.id}
                        id={chapter.id}
                        label={chapter.title!}
                        isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                        courseId={course.id}
                        isLocked={!chapter.isFree && !purchase}
                    />
                ))}
           </div>
        </div>
    );
}