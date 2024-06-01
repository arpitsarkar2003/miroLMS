"use client";

import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";

interface VideoPlayerProps {
    playbackId: string;
    courseId: string;
    chapterId: string;
    nextChapterId: string;
    prevChapterId: string;
    isLocked: boolean;
    completeOnEnd: boolean;
    title: string;
}

export const VideoPlayer = ({
    playbackId,
    courseId,
    chapterId,
    nextChapterId,
    prevChapterId,
    isLocked,
    completeOnEnd,
    title,
}: VideoPlayerProps) => {
    const [isReady, setIsReady] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleCanPlay = () => {
        setIsReady(true);
        setHasError(false);
    };

    const handleError = (error: any) => {
        console.error("Media error:", error);
        setHasError(true);
    };

    return (
        <div className="relative aspect-video">
            {!isReady && !isLocked && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                </div>
            )}
            {isLocked ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                    <Lock className="w-8 h-8" />
                    <p>This chapter is locked</p>
                </div>
            ) : hasError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                    <p>There was an error loading the video. Please try again later.</p>
                </div>
            ) : (
                <MuxPlayer
                    title={title}
                    className={cn(!isReady && "hidden")}
                    onCanPlay={handleCanPlay}
                    onError={handleError}
                    onEnded={() => {}}
                    autoPlay
                    playbackId={playbackId}
                />
            )}
        </div>
    );
};
