"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
    chapterId: string;
    courseId: string;
    nextChapterId?: string;
    prevChapterId: string;
    isCompleted?: boolean;
}

export const CourseProgressButton = ({ chapterId, courseId, nextChapterId, prevChapterId, isCompleted}: CourseProgressButtonProps) => {

    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);


    const onClick = async () => {

        
        try {
            setIsLoading(true);

            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: !isCompleted,
            });

            if (!isCompleted && !nextChapterId) {
                confetti.onOpen();
            }

            if (!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }

            toast.success("Progress updated successfully");
            router.refresh();
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    
    

    const Icon = isCompleted ? XCircle : CheckCircle;

    return (
       <Button 
        type="button"
        variant={isCompleted ? "outline" : "sucesss"}
        className="w-full md:w-auto"
        onClick={onClick}
        disabled={isLoading}
       >
            {isCompleted ? `Not Completed` : `Mark as Completed`}
            <Icon className="w-4 h-4 ml-2"/>
       </Button>
    );
}