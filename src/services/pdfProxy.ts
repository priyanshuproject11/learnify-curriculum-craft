/**
 * PDF Proxy Service
 * 
 * This service helps fetch external PDFs that might have CORS restrictions 
 * by using multiple proxy strategies and fallback mechanisms
 */

// Available CORS proxies (will try in order until one works)
const CORS_PROXIES = [
  "https://corsproxy.io/?",
  "https://api.allorigins.win/raw?url=",
  "https://cors-anywhere.herokuapp.com/",
];

/**
 * Try multiple fetch strategies to get a PDF
 * @param url Original PDF URL
 * @returns Blob URL that can be used in the PDF viewer
 */
export const fetchPdfWithProxy = async (url: string): Promise<string> => {
  console.log(`Attempting to fetch PDF from: ${url}`);
  
  // Strategy 1: Try direct fetch first (may work for some URLs)
  try {
    const directResponse = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/pdf",
      },
      mode: "no-cors", // Try with no-cors first
    });
    
    if (directResponse.type !== 'opaque') {
      const blob = await directResponse.blob();
      const blobUrl = URL.createObjectURL(blob);
      console.log("PDF successfully fetched directly");
      return blobUrl;
    }
  } catch (error) {
    console.log("Direct fetch failed, trying proxies...");
  }
  
  // Strategy 2: Try each proxy in order
  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
      console.log(`Trying proxy: ${proxy}`);
      
      const response = await fetch(proxyUrl, {
        method: "GET",
        headers: {
          "Accept": "application/pdf",
        },
      });
      
      if (response.ok) {
        const pdfBlob = await response.blob();
        const pdfBlobUrl = URL.createObjectURL(pdfBlob);
        console.log(`PDF successfully fetched via proxy: ${proxy}`);
        return pdfBlobUrl;
      }
    } catch (error) {
      console.log(`Proxy ${proxy} failed, trying next...`);
    }
  }
  
  // Strategy 3: Server-side proxy simulation for demonstration
  // In a real app, this would call your backend endpoint
  try {
    // For demo purposes, we'll use a public PDF viewing service
    // This simulates what a backend proxy would do
    const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    console.log("All proxies failed, returning Google Docs viewer URL");
    
    // In a real implementation, this would return a blob from your own server
    // For now, we'll return the Google Docs viewer URL which can display PDFs
    return googleDocsViewerUrl;
  } catch (error) {
    console.error("All PDF fetching strategies failed:", error);
    throw new Error("Failed to fetch PDF after trying multiple strategies");
  }
};

// NCERT PDF base URL
export const NCERT_BASE_URL = "https://ncert.nic.in/textbook/pdf/";

// Backup URLs for when NCERT direct links fail
export const NCERT_BACKUP_URL = "https://eunectic-data-pdf.s3.ap-south-1.amazonaws.com/"

// Map of properly working NCERT PDFs
export const NCERT_WORKING_PDFS = {
  "Class 10": {
    "Mathematics": [
      {
        title: "Chapter 1: Real Numbers",
        url: `${NCERT_BASE_URL}jemh101.pdf`,
        pages: 18
      },
      {
        title: "Chapter 2: Polynomials",
        url: `${NCERT_BASE_URL}jemh102.pdf`,
        pages: 14
      },
      {
        title: "Chapter 3: Pair of Linear Equations in Two Variables",
        url: `${NCERT_BASE_URL}jemh103.pdf`,
        pages: 24
      }
    ],
    "Science": [
      {
        title: "Chapter 1: Chemical Reactions and Equations",
        url: `${NCERT_BASE_URL}jesc101.pdf`,
        pages: 16
      },
      {
        title: "Chapter 2: Acids, Bases and Salts",
        url: `${NCERT_BASE_URL}jesc102.pdf`,
        pages: 18
      }
    ]
  },
  "Class 9": {
    "Mathematics": [
      {
        title: "Chapter 1: Number Systems",
        url: `${NCERT_BASE_URL}iemh101.pdf`,
        pages: 20
      },
      {
        title: "Chapter 2: Polynomials",
        url: `${NCERT_BASE_URL}iemh102.pdf`,
        pages: 16
      }
    ],
    "Science": [
      {
        title: "Chapter 1: Matter in Our Surroundings",
        url: `${NCERT_BASE_URL}iesc101.pdf`,
        pages: 14
      },
      {
        title: "Chapter 2: Is Matter Around Us Pure",
        url: `${NCERT_BASE_URL}iesc102.pdf`,
        pages: 16
      }
    ]
  }
};

// Alternative method to get PDF URL with fallbacks
export const getReliablePdfUrl = (pdfUrl: string): string => {
  // If it's an NCERT URL, provide alternatives
  if (pdfUrl.includes(NCERT_BASE_URL)) {
    const pdfFilename = pdfUrl.split('/').pop();
    if (pdfFilename) {
      // Try a different source for the same PDF
      return `${NCERT_BACKUP_URL}${pdfFilename}`;
    }
  }
  
  // Return original URL if no alternative available
  return pdfUrl;
};
