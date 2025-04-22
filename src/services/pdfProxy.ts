
/**
 * PDF Proxy Service
 * 
 * This service helps fetch external PDFs that might have CORS restrictions 
 * by using a CORS proxy or direct fetch with appropriate headers
 */

// Use a CORS proxy to avoid CORS issues with external PDFs
const CORS_PROXY = "https://corsproxy.io/?";

/**
 * Fetch PDF from URL using CORS proxy
 * @param url Original PDF URL
 * @returns Blob URL that can be used in the PDF viewer
 */
export const fetchPdfWithProxy = async (url: string): Promise<string> => {
  try {
    console.log(`Attempting to fetch PDF from: ${url}`);
    
    // Use CORS proxy to fetch the PDF
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`, {
      method: "GET",
      headers: {
        "Accept": "application/pdf",
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }
    
    // Get the PDF as blob and create a local URL
    const pdfBlob = await response.blob();
    const pdfBlobUrl = URL.createObjectURL(pdfBlob);
    
    console.log("PDF successfully fetched and converted to blob URL");
    return pdfBlobUrl;
  } catch (error) {
    console.error("Error fetching PDF:", error);
    throw error;
  }
};

// NCERT PDF base URL
export const NCERT_BASE_URL = "https://ncert.nic.in/textbook/pdf/";

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

// You can add more classes and subjects as needed
