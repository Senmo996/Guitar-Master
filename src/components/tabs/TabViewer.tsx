import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface TabViewerProps {
  fileUrl: string;
  fileType: 'pdf' | 'image';
}

export const TabViewer: React.FC<TabViewerProps> = ({ fileUrl, fileType }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  if (fileType === 'image') {
    return (
      <div className="max-w-full overflow-auto">
        <img src={fileUrl} alt="Guitar Tab" className="max-w-full h-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-full">
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        className="max-w-full"
      >
        <Page 
          pageNumber={pageNumber} 
          renderTextLayer={false}
          renderAnnotationLayer={false}
          className="max-w-full"
        />
      </Document>
      {numPages && numPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-400"
          >
            Previous
          </button>
          <p className="text-sm text-gray-600">
            Page {pageNumber} of {numPages}
          </p>
          <button
            onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
            disabled={pageNumber >= numPages}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};