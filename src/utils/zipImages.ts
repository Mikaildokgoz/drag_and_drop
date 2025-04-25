import JSZip from "jszip";
import { saveAs } from "file-saver";

export async function zipImages(files: File[]) {
	const zip = new JSZip();

	files.forEach((file, index) => {
		zip.file(file.name || `image-${index}.jpg`, file);
	});

	const blob = await zip.generateAsync({ type: "blob" });
	saveAs(blob, "images.zip");
}
