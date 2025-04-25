"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import SortableImageList from "./SortableImageList";
import { zipImages } from "../utils/zipImages";

interface UploadState {
	progress: number;
	isUploading: boolean;
	isUploaded: boolean;
}

export default function Dropzone({
	images,
	setImages,
}: {
	images: File[];
	setImages: React.Dispatch<React.SetStateAction<File[]>>;
}) {
	const [uploadStates, setUploadStates] = useState<UploadState[]>([]);

	const startFakeUpload = (index: number) => {
		let progress = 0;
		const interval = setInterval(() => {
			progress += Math.floor(Math.random() * 10) + 10;
			if (progress >= 100) {
				progress = 100;
				clearInterval(interval);
				updateUploadState(index, {
					progress,
					isUploading: false,
					isUploaded: true,
				});
			} else {
				updateUploadState(index, {
					progress,
					isUploading: true,
					isUploaded: false,
				});
			}
		}, 300);
	};

	const updateUploadState = (index: number, newState: Partial<UploadState>) => {
		setUploadStates((prev) => {
			const updated = [...prev];
			updated[index] = { ...updated[index], ...newState };
			return updated;
		});
	};

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const newUploadStates = acceptedFiles.map(() => ({
				progress: 0,
				isUploading: true,
				isUploaded: false,
			}));
			const newIndexes = Array.from(
				{ length: acceptedFiles.length },
				(_, i) => images.length + i
			);

			setImages((prev) => [...prev, ...acceptedFiles]);
			setUploadStates((prev) => [...prev, ...newUploadStates]);

			newIndexes.forEach((i) => startFakeUpload(i));
		},
		[images.length, setImages]
	);

	const onRemove = (index: number) => {
		const newImages = [...images];
		newImages.splice(index, 1);
		setImages(newImages);

		const newStates = [...uploadStates];
		newStates.splice(index, 1);
		setUploadStates(newStates);
	};
	const dropzone = useDropzone({
		onDrop,
		accept: { "image/*": [] },
		multiple: true,
	});

	return (
		<div className="space-y-4">
			<div
				{...dropzone.getRootProps()}
				className="border-2 border-dashed p-6 rounded-xl cursor-pointer text-center transition bg-white hover:bg-blue-50"
			>
				<input {...dropzone.getInputProps()} />
				<p className="text-gray-600">Görselleri buraya sürükle ya da tıkla</p>
			</div>

			<SortableImageList
				images={images}
				setImages={setImages}
				uploadStates={uploadStates}
				onRemove={onRemove}
			/>

			{uploadStates.length > 0 && uploadStates.every((s) => s.isUploaded) && (
				<button
					onClick={() => zipImages(images)}
					className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
				>
					Tüm Görselleri Zip Olarak İndir
				</button>
			)}
		</div>
	);
}
