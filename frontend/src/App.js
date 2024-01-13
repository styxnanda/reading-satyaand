import React from "react";
import PDFReader from "./components/PDFReader";
import "./App.scss";

function App() {
	const pdfPath = `${process.env.REACT_APP_BACKEND_URL}/pdf/Hermetic%20Eyes.pdf`;

	return (
		<div className="App">
			<div className="PDFContainer">
				<PDFReader pdfPath={pdfPath} />
			</div>
		</div>
	);
}

export default App;
