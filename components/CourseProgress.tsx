import { cn } from "@/lib/utils";
import { Progress } from "./ui/progress";

interface CourseProgressProps {
    value: number;
    variant?: "success" | "default";
    size?: "sm" | "default";
}

const colorByVariant = {
    success: "text-emerald-500",
    default: "text-sky-500",
};

const sizeByVariant = {
    sm: "text-xs",
    default: "text-sm",
};

export const CourseProgress = ({ value, variant = "default", size = "default" }: CourseProgressProps) => {
    // console.log("Value in CourseProgress:", value);

    return (
        <div>
            <Progress 
                className="h-2"
                value={value}
                variant={variant}
            />
            <p
                className={cn(
                    "font-medium mt-2 text-sky-700",
                    sizeByVariant[size],
                    colorByVariant[variant]
                )}      
            >
                {Math.round(value)}% completed
            </p>
        </div>
    );
};
