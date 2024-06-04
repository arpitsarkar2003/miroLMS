import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";
import { assert } from "console";
import { getProgress } from "./get-progress";

type DashboardCourses = {
    completeCourses: any[];
    courseInProgress: any[];
}

type CourseWithProgressWithCategory = Course & {
    progress: number | null;
    category: Category;
    chapters: Chapter[];
}

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
    try {
        const purchasedCourses = await db.purchase.findMany({
            where: {
                userId: userId,
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true
                            }
                        }
                    }
                }
            }
        });

        const courses = purchasedCourses.map((purchase) => purchase.course) as CourseWithProgressWithCategory[];

        for (let course of courses) {
            const progress = await getProgress(course.id, userId);
            course["progress"] = progress;
        }

    const completeCourses = courses.filter((course) => course.progress === 100);
    const courseInProgress = courses.filter((course) => (course.progress ?? 0) < 100);

    return {
        completeCourses,
        courseInProgress
    }

    } catch (error) {
        console.log("[GET_DASHBOARD_COURSES]", error);
        return {
            completeCourses: [],
            courseInProgress: []
        }
    }
}