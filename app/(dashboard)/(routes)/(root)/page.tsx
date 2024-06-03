import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";
import { auth } from "@clerk/nextjs";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import { InfoCard } from "./_components/InfoCard";

export default async function Dashboard() {

    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const {
        completeCourses,
        courseInProgress
    } = await getDashboardCourses(userId);
    return (
        <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard
                    icon={Clock}
                    label="In Progress"
                    numberOfItems={courseInProgress.length}
                />
                <InfoCard
                    icon={CheckCircle}
                    label="Completed"
                    numberOfItems={completeCourses.length}
                    variant="success"
                />
            </div>
            <CoursesList
                items={[...courseInProgress, ...completeCourses]}
            />
        </div>
    );
}