"use Client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formats";

interface CourseEnrollButtonProps {
    courseId: string;
    price: number;
}

export const CourseEnrollButton = ({
    courseId,
    price
}: CourseEnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            const response = await axios.post(`/api/courses/${courseId}/checkout`);
            
            window.location.assign(response.data.url);
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <Button
            size="sm"
            className="w-full md:w-auto"
            onClick={onClick}
            disabled={isLoading}
        >
            {isLoading ? "Processing..." : `Enroll for ${formatPrice(price)}`}
        </Button>
    );
};
