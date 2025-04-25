/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { showNotification } from "../utils/notification";

interface Props {
	file: File;
	onRemove: () => void;
	progress?: number;
	isUploading?: boolean;
	isUploaded?: boolean;
}

export default function ImagePreview({
	file,
	onRemove,
	progress = 0,
	isUploading = false,
	isUploaded = false,
}: Props) {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	useEffect(() => {
		const objectUrl = URL.createObjectURL(file);
		setPreviewUrl(objectUrl);

		return () => URL.revokeObjectURL(objectUrl);
	}, [file]);

	useEffect(() => {
		if (isUploaded) {
			showNotification("Resim Yükleme Başarılı!");
		}
	}, [isUploaded]);

	if (!previewUrl) return null;

	return (
		<div className="relative rounded-xl overflow-hidden border shadow-sm group bg-white">
			<img
				src={previewUrl}
				alt={file.name}
				className="object-cover w-full h-32 rounded-lg"
			/>
			{isUploaded && (
				<div className="absolute top-2 right-2 z-10">
					<button
						className="text-white bg-red-500 p-1 rounded-full"
						onClick={(e) => {
							e.stopPropagation();
							onRemove();
						}}
						onMouseDown={(e) => {
							e.stopPropagation();
							onRemove();
						}}
					>
						<X size={16} />
					</button>
				</div>
			)}

			{isUploading && (
				<div className="absolute bottom-2 left-0 w-full bg-gray-200 h-1">
					<div
						className="bg-blue-500 h-1"
						style={{ width: `${progress}%` }}
					></div>
				</div>
			)}

			{isUploaded && (
				<div className="absolute bottom-2 left-0 w-full text-center text-green-600">
					<Check size={20} />
				</div>
			)}
		</div>
	);
}
