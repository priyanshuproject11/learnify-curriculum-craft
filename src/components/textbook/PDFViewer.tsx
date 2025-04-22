
import React, { useState, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { fetchPdfWithProxy } from "@/services/pdfProxy";

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
  onClose?: () => void;
}

const PDFViewer = ({ url, onClose }: PDFViewerProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [pdfError, setPdfError] = useState<boolean>(false);

  // Function to load the PDF through the proxy
  const loadPdfWithProxy = useCallback(async () => {
    if (!url) return;
    
    setPdfLoading(true);
    setPdfError(false);
    
    try {
      // Try to fetch the PDF through our proxy
      const proxiedUrl = await fetchPdfWithProxy(url);
      setPdfUrl(proxiedUrl);
      console.log("Successfully loaded PDF through proxy");
    } catch (error) {
      console.error("Failed to load PDF with proxy:", error);
      setPdfError(true);
      toast.error("Failed to load PDF. Please try the external viewer.");
    } finally {
      setPdfLoading(false);
    }
  }, [url]);

  // Load the PDF when the component mounts or URL changes
  useEffect(() => {
    loadPdfWithProxy();
    
    // Cleanup function to revoke blob URL when component unmounts
    return () => {
      if (pdfUrl && pdfUrl.startsWith("blob:")) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [url, loadPdfWithProxy]);

  // Function to handle document load success
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPdfLoading(false);
    setPdfError(false);
    console.log(`PDF loaded successfully with ${numPages} pages`);
  }

  // Function to handle document load error
  function onDocumentLoadError(error: Error) {
    console.error("Error loading PDF:", error);
    setPdfLoading(false);
    setPdfError(true);
    toast.error("Unable to load PDF. Try using the external viewer.");
  }

  // Functions to navigate between pages
  const goToPrevPage = () => {
    setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages || 1));
  };

  // Functions to zoom in and out
  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 2.5));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  };

  // Function to retry loading the PDF
  const handleRetry = () => {
    loadPdfWithProxy();
  };

  // Function to open PDF in external viewer
  const openExternalViewer = () => {
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col items-center">
      {pdfLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading PDF...</span>
        </div>
      )}
      
      {pdfError ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 font-medium mb-2">Failed to load PDF</p>
          <div className="flex gap-2">
            <Button 
              onClick={handleRetry}
              variant="outline"
              className="mb-2"
            >
              Retry Loading
            </Button>
            <Button 
              onClick={openExternalViewer}
              className="mb-2"
            >
              Open in New Tab
            </Button>
          </div>
          <p className="text-sm text-gray-500 max-w-md text-center mt-2">
            The PDF couldn't be loaded directly due to cross-origin restrictions.
            You can try again or open it in a new tab instead.
          </p>
        </div>
      ) : (
        <>
          <div className="border rounded mb-4 p-2 w-full">
            {pdfUrl && (
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={<Loader2 className="h-8 w-8 animate-spin text-primary mx-auto my-8" />}
                className="flex justify-center"
                options={{
                  cMapUrl: 'https://unpkg.com/pdfjs-dist@2.16.105/cmaps/',
                  cMapPacked: true,
                }}
              >
                <Page 
                  pageNumber={pageNumber} 
                  scale={scale}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </Document>
            )}
          </div>
          
          {numPages && (
            <div className="flex items-center justify-between w-full">
              <div className="space-x-2">
                <Button
                  onClick={zoomOut}
                  disabled={scale <= 0.5}
                  variant="outline"
                  size="sm"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  onClick={zoomIn}
                  disabled={scale >= 2.5}
                  variant="outline"
                  size="sm"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex space-x-2 items-center">
                <Button
                  onClick={goToPrevPage}
                  disabled={pageNumber <= 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <p className="text-sm">
                  Page {pageNumber} of {numPages}
                </p>
                <Button
                  onClick={goToNextPage}
                  disabled={pageNumber >= numPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PDFViewer;
