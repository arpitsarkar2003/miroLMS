import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
    course: Course;
};

const groupByCourse = (purchases: PurchaseWithCourse[]): Record<string, number> => {
    const grouped: { [courseTitle: string]: number } = {};

    purchases.forEach((purchase) => {
        const courseTitle = purchase.course.title;
        if (courseTitle) {
            grouped[courseTitle] = (grouped[courseTitle] || 0) + (purchase.course.price ?? 0);
        }
    });

    return grouped;
};

export const getAnalytics = async (userId: string): Promise<{
    data: { name: string, total: number }[],
    totalRevenue: number,
    totalSales: number
}> => {
    try {
        const purchases = await db.purchase.findMany({
            where: {
                userId: userId
            },
            include: {
                course: true
            }
        });

        const groupedEarnings = groupByCourse(purchases);

        const data = Object.entries(groupedEarnings).map(([courseTitle, total]) => ({
            name: courseTitle,
            total: total
        }));
        
        const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
        const totalSales = purchases.length;

        // console.log(data, totalRevenue, totalSales);

        return {
            data,
            totalRevenue,
            totalSales
        };
    } catch (error) {
        console.error("[GET_ANALYTICS]", error);
        return {
            data: [],
            totalRevenue: 0,
            totalSales: 0,
        };
    }
};
