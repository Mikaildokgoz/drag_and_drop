"use client";

import Dropzone from "../components/Dropzone";
import { useState } from "react";

export default function Home() {
	const [images, setImages] = useState<File[]>([]);

	return (
		<main className="min-h-screen bg-gray-200 p-4">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-2xl font-bold mb-4 text-gray-800">Resim Yükleme</h1>
				<Dropzone images={images} setImages={setImages} />
			</div>
		</main>
	);
}
