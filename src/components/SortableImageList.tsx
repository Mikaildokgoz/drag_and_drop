"use client";
import type { DragEndEvent } from "@dnd-kit/core";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	useSortable,
	sortableKeyboardCoordinates,
	rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import ImagePreview from "./ImagePreview";
import { useState } from "react";

interface Props {
	images: File[];
	setImages: (files: File[]) => void;
	uploadStates?: {
		progress: number;
		isUploading: boolean;
		isUploaded: boolean;
	}[];
	onRemove: (index: number) => void;
}

function SortableItem({
	file,
	index,
	onRemove,
	uploadState,
	isDragging,
}: {
	file: File;
	index: number;
	onRemove: () => void;
	uploadState?: { progress: number; isUploading: boolean; isUploaded: boolean };
	isDragging: boolean;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({
			id: index,
		});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className={isDragging ? "border-dashed border-4 border-blue-500" : ""}
		>
			<ImagePreview
				file={file}
				onRemove={onRemove}
				progress={uploadState?.progress}
				isUploading={uploadState?.isUploading}
				isUploaded={uploadState?.isUploaded}
			/>
		</div>
	);
}

export default function SortableImageList({
	images,
	setImages,
	uploadStates,
	onRemove,
}: Props) {
	const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			const oldIndex = active.id as number;
			const newIndex = over.id as number;
			const newImages = arrayMove(images, oldIndex, newIndex);
			setImages(newImages);
		}
		setDraggingIndex(null); // Dragging işlemi bittiğinde index'i sıfırla
	};

	const handleDragStart = (event: DragEndEvent) => {
		setDraggingIndex(event.active.id as number); // Sürüklenen öğe index'ini al
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
			onDragStart={handleDragStart}
		>
			<SortableContext
				items={images.map((_, index) => index)}
				strategy={rectSortingStrategy}
			>
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
					{images.map((file, index) => (
						<SortableItem
							key={index}
							index={index}
							file={file}
							uploadState={uploadStates?.[index]}
							onRemove={() => onRemove(index)}
							isDragging={draggingIndex === index} // Eğer sürüklenen öğe bu ise, görünümü değiştir
						/>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
}
