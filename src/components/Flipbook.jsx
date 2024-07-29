import { useState, useCallback, forwardRef, memo } from "react";
import HTMLFlipBook from "react-pageflip";
import LoadingScreen from "./Loading";
import { Document, Page, pdfjs } from "react-pdf";
import pdf from "../data/pdf/Cold-Wheels-August-2024.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url
).toString();


let pdfName = pdf.split("/").pop().replace(".pdf", "").replace(/[-_]/g, ' ');

const Pages = memo(
    forwardRef((props, ref) => (
        <div className="page" ref={ref}>
            {props.children}
        </div>
    ))
);

Pages.displayName = 'Pages';

function FlipBook() {

    const [loading, setLoading] = useState(true);
	const [numPages, setNumPages] = useState(null);
    const [initialMargin, setInitialMargin] = useState("lg:ml-[-40%]");

    const onDocumentLoadSuccess = useCallback(({ numPages }) => {
        setNumPages(numPages);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const handleFlip = (e) => {
        if (e.data === 0) {
            setInitialMargin("lg:ml-[-40%]");
        } else if (e.data === numPages - 1) {
            setInitialMargin("lg:ml-[45%]");
        } else {
            setInitialMargin("lg:ml-[0%]");
        }
    };

	return (
        <section id="magazine" className="h-fit flex flex-col justify-end items-center md:justify-center scroll-mx-2 pb-20 overflow-hidden max-w-screen-xl mx-auto">
            {loading && <LoadingScreen loading={loading} />}
            <div className="text-4xl text-center font-bold">
                <h1>{pdfName}</h1>
            </div>
            <div className={`h-full w-full m-0 lg:px-20 py-10 transition-all ml-0 ${initialMargin} duration-200 overflow-hidden`}>
                <HTMLFlipBook 
                    width={550}
                    height={711}
                    showCover={true} 
                    flippingTime={800} 
                    maxShadowOpacity={0.6} 
                    mobileScrollSupport={true} 
                    autoSize={true}
                    onFlip={handleFlip}>
                        {[...Array(numPages).keys()].map((n) => (
                            <Pages key={n}>
                                <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
                                    <Page
                                        pageNumber={n + 1}
                                        width={550}
                                        renderAnnotationLayer={false} 
                                        renderTextLayer={false}
                                    />
                                </Document>
                            </Pages>
                        ))}
                </HTMLFlipBook>
            </div>
        </section>
	);
}

export default FlipBook;
