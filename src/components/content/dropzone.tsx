"use client";

import { type DropzoneOptions, useDropzone } from "react-dropzone";
import { Container } from "./container";
import { DragCountContext, useDragCountCallbacks } from "./drag-count-context";

type Props = {
	children?: React.ReactNode;
	dragActive?: React.ReactNode;
	onDrop?: DropzoneOptions["onDrop"];
};

export function Dropzone({ children, dragActive, onDrop }: Props) {
	const { dragCount, onDragEnter, onDragLeave, onDrop: _onDrop } = useDragCountCallbacks();
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		noClick: true,
		onDragEnter,
		onDragLeave,
		onDrop: (...args) => {
			_onDrop();
			onDrop?.(...args);
		},
	});

	return (
		<DragCountContext.Provider value={dragCount}>
			<Container {...getRootProps()}>
				<input {...getInputProps()} />

				{isDragActive ? dragActive : children}
			</Container>
		</DragCountContext.Provider>
	);
}
