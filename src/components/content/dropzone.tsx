"use client";

import { useEffect } from "react";
import { type DropzoneOptions, useDropzone } from "react-dropzone";
import { useContentArea } from "./area";
import { Container } from "./container";
import { DragCountContext, useDragCountCallbacks } from "./drag-count-context";

type Props = {
	children?: React.ReactNode;
	dragActive?: React.ReactNode;
	onDrop?: DropzoneOptions["onDrop"];
};

export function Dropzone({ children, dragActive, onDrop }: Props) {
	const area = useContentArea();
	const { dragCount, onDragEnter, onDragLeave, onDrop: _onDrop } = useDragCountCallbacks();
	const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
		noClick: true,
		onDragEnter,
		onDragLeave,
		onDrop: (...args) => {
			_onDrop();
			onDrop?.(...args);
		},
	});

	// Lets a button outside this component (e.g. next to the breadcrumb) open the same
	// file-browser dialog, since `noClick` above disables click-to-browse on the dropzone itself.
	useEffect(() => {
		area?.registerFilePicker(open);
		return () => area?.registerFilePicker(null);
	}, [area, open]);

	return (
		<DragCountContext.Provider value={dragCount}>
			<Container {...getRootProps()}>
				<input {...getInputProps()} />

				{isDragActive ? dragActive : children}
			</Container>
		</DragCountContext.Provider>
	);
}
