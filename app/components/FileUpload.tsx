"use client";
import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { Loader2 } from "lucide-react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploadProps{
    onSucess: (res: IKUploadResponse) => void;
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video";
}

export default function FileUpload({
    onSucess,
    onProgress,
    fileType = "image"
} : FileUploadProps) {

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onError = (err) => {
        console.log("Error", err);
        setError(err.message);
        setUploading(false);
    };
    
    const handleSuccess = (response: IKUploadResponse) => {
        console.log("Success", response);
        setUploading(false);
        setError(null);
        onSucess(response);
    };
    
    const handleProgress = () => {
        setUploading(true);
        setError(null);
    };
    
    const handleStartUpload = (evt: ProgressEvent) => {
        if (evt.lengthComputable && onProgress) {
            const percentComplete = (evt.loaded / evt.total) * 100;
            onProgress(Math.round(percentComplete));
        }
    };

    const validateFile = (file: File) => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Invalid file type. Please upload a video file");
                return false;
            }

            if (file.size > 100 * 1024 * 1024) {
                setError("File size should be less than 100MB");
                return false;
            }
        } else {
            const validImageTypes = ["image/jpeg", "image/png", "image/webp"];

            if (!validImageTypes.includes(file.type)) {
                setError("Invalid file type. Please upload an image file (jpeg, png, webp");
                return false;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError("File size should be less than 10MB");
                return false;
            }
        }

        return false;
    }

    return (
        <div className="space-y-2">
            <IKUpload
            fileName={fileType === "video" ? "video" : "image"}
            tags={["sample-tag1", "sample-tag2"]}
            customCoordinates={"10,10,10,10"}
            validateFile={validateFile}
            onError={onError}
            onSuccess={handleSuccess}
            onUploadProgress={handleProgress}
            onUploadStart={handleStartUpload}
            accept={fileType === "video" ? "video/*" : "image/*"}
            className="file-input file-input-bordered w-full"
            useUniqueFileName={true}
            folder={fileType === "video" ? "/video" : "/image"}
            />

            {
                uploading && (
                    <div className="flex items-center gap-2 text-sm text-primary">
                        <Loader2 className="animate-spin w-4 h-4" />
                        <span>Uploading...</span>
                    </div>
                )
            },
            {
                error && (
                    <div className="text-sm text-red-500 text-error">{error}</div>
                )
            }
        </div>
    );
}