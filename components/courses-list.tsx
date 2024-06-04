import { Category, Course } from "@prisma/client"
import { CourseCard } from "./course-card";


type CourseWithProgressWithCategory = Course & {
    progress: number | null;
    category: Category | null;
    chapters: { id: string }[];
}
interface CoursesListProps {
    items: CourseWithProgressWithCategory[]
}

export const CoursesList = ({
    items
}: CoursesListProps) => {
    
    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:gridcols-4 2xl:grid-cols-4 gap-4">
                {items.map((course) => (
                    <CourseCard
                        key={course.id}
                        id={course.id}
                        title={course.title!}
                        imageUrl={course.imageUrl!}
                        price={course.price!}
                        category={course?.category?.name!}
                        progress={course.progress}
                        chaptersLength={course.chapters.length}

                    />
                   
                ))}
                <div>
                    {items.length === 0 && (
                        <div className="text-center text-sm text-muted-foreground mt-10">
                            No courses found
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}