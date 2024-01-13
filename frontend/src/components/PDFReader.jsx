import React, { useState } from "react";
import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf";
import styles from "./PDFReader.module.scss";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFReader = ({ pdfPath }) => {
	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);
	const chapters = [
		{ name: "Chapter 1 - Island of Souls", startPage: 2 },
		{ name: "Chapter 2 - Hourglass", startPage: 35 },
		{ name: "Chapter 3 - Epilogue", startPage: 58 },
	];

	const isMobileDevice = () => {
		return window.innerWidth < 768;
	};

	const onDocumentLoadSuccess = ({ numPages }) => {
		console.log(`PDF loaded successfully. Number of pages: ${numPages}`);
		setNumPages(numPages);
	};

	const handlePageChange = (event) => {
		let selectedPage = parseInt(event.target.value, 10);

		if (selectedPage % 2 === 0) {
			selectedPage = Math.max(selectedPage - 1, 1);
		}

		setPageNumber(selectedPage);
	};

	const getCurrentPairStartPage = () => {
		// Check if the current page is the start of a chapter
		const isChapterStart = chapters.some(
			(chapter) => chapter.startPage === pageNumber
		);

		// If the current page is the start of a chapter, return it as is
		if (isChapterStart) {
			return pageNumber;
		}

		// Otherwise, return the nearest preceding odd page number
		return pageNumber % 2 === 0 ? pageNumber - 1 : pageNumber;
	};

	const getCurrentChapterStartPage = () => {
		for (let i = 0; i < chapters.length; i++) {
			const startPage = chapters[i].startPage;
			const nextPageStart =
				i + 1 < chapters.length
					? chapters[i + 1].startPage
					: numPages + 1;
			if (pageNumber >= startPage && pageNumber < nextPageStart) {
				return startPage;
			}
		}
		return 1; // Default to the first page if no chapter found
	};

	const goToNextPage = () => {
		const increment = isMobileDevice() ? 1 : 2;
		let nextPage = pageNumber + increment;
		nextPage = Math.min(nextPage, numPages);
		console.log(increment);
		setPageNumber(nextPage);
	};

	const goToPreviousPage = () => {
		const decrement = isMobileDevice() ? 1 : 2;
		let prevPage = pageNumber - decrement;
		prevPage = Math.max(prevPage, 1);
		console.log(decrement);
		setPageNumber(prevPage);
	};

	const handlePageClick = (e) => {
		// Get the rectangle of the PDF container
		const rect = e.currentTarget.getBoundingClientRect();

		// Calculate the click's X position relative to the PDF container
		const clickXRelativeToPdfContainer = e.clientX - rect.left;

		// Check if the click is on the left or right half of the PDF container
		if (clickXRelativeToPdfContainer < rect.width / 2 && pageNumber > 1) {
			goToPreviousPage();
		} else if (
			clickXRelativeToPdfContainer >= rect.width / 2 &&
			pageNumber < numPages
		) {
			goToNextPage();
		}
	};

	const isLastPageSingle = pageNumber === numPages && numPages % 2 !== 0;

	return (
		<div className={styles.pdfReaderContainer}>
			<Document
				className={`${styles.pdfDocument} ${
					isLastPageSingle ? styles.lastPageSingle : ""
				}`}
				file={pdfPath}
				onLoadSuccess={onDocumentLoadSuccess}
				onClick={handlePageClick}
			>
				<Page
					pageNumber={pageNumber}
					renderAnnotationLayer={false}
					renderTextLayer={false}
				/>
				{!isMobileDevice() && pageNumber < numPages && (
					<Page
						pageNumber={pageNumber + 1}
						renderAnnotationLayer={false}
						renderTextLayer={false}
					/>
				)}
			</Document>

			<div className={styles.navigation}>
				<button onClick={goToPreviousPage} disabled={pageNumber <= 1}>
					Previous
				</button>
				<select
					onChange={handlePageChange}
					value={getCurrentChapterStartPage()}
				>
					{chapters.map((chapter, index) => (
						<option key={index} value={chapter.startPage}>
							{chapter.name}
						</option>
					))}
				</select>

				<select
					onChange={handlePageChange}
					value={getCurrentPairStartPage()}
				>
					{Array.from({ length: Math.ceil(numPages / 2) }, (_, i) => {
						const pageStart = 2 * i + 1;
						const pageEnd = Math.min(pageStart + 1, numPages);
						return (
							<option key={pageStart} value={pageStart}>
								Page {pageStart} / {pageEnd}
							</option>
						);
					})}
				</select>
				<button
					onClick={goToNextPage}
					disabled={pageNumber >= numPages}
				>
					Next
				</button>
			</div>

			<div className={styles.pageInfo}>
				Page {pageNumber} -{" "}
				{numPages - pageNumber ? pageNumber + 1 : pageNumber} of{" "}
				{numPages}
			</div>
		</div>
	);
};

export default PDFReader;
