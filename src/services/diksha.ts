
import { DikshaCourse, DikshaSearchResponse, Unit } from "@/types/curriculum";

// Using a mock API base URL since the real DIKSHA API might not be accessible
// In a production environment, this would be the actual DIKSHA API endpoint
const DIKSHA_BASE_URL = 'https://diksha.gov.in/api';

export const searchDikshaCourses = async (
  board: string = 'CBSE',
  grade: string,
  subject: string
): Promise<DikshaCourse[]> => {
  try {
    console.log(`Searching DIKSHA courses for board: ${board}, grade: ${grade}, subject: ${subject}`);
    
    // In a real implementation, this would make an actual API call
    // Since we might not have access to the real DIKSHA API, we'll simulate a response
    
    // Uncomment the following block for real API implementation
    /*
    const response = await fetch(`${DIKSHA_BASE_URL}/content/v1/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        request: {
          filters: {
            board: [board],
            gradeLevel: [grade],
            subject: [subject],
            contentType: ['Course', 'TextBook', 'LessonPlan'],
          },
          limit: 100,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch DIKSHA content: ${response.status}`);
    }

    const data: DikshaSearchResponse = await response.json();
    return data.result.content;
    */
    
    // For demo purposes, return mock data
    console.log('Returning mock DIKSHA courses');
    return getMockDikshaCourses(board, grade, subject);
  } catch (error) {
    console.error('Error fetching DIKSHA content:', error);
    throw new Error('Failed to fetch DIKSHA content. Please try again later.');
  }
};

export const convertDikshaCourseToUnit = (course: DikshaCourse): Unit => {
  return {
    id: course.identifier,
    name: course.name,
    startDate: new Date(), // Teacher will set these
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Default to 1 month duration
    objectives: course.description || 'Objectives to be defined',
    keyConcepts: `Content Type: ${course.contentType}\nResource Type: ${course.resourceType || 'Not specified'}`,
    resources: [{
      id: course.identifier,
      name: course.name,
      type: 'Link',
      url: `https://diksha.gov.in/play/content/${course.identifier}`
    }],
    lessons: [],
    estimatedTime: '4 weeks'
  };
};

// Mock data for testing purposes
const getMockDikshaCourses = (board: string, grade: string, subject: string): DikshaCourse[] => {
  console.log(`Generating mock data for ${board}, grade ${grade}, subject ${subject}`);
  
  const mockCourses: DikshaCourse[] = [
    {
      identifier: `diksha-${board}-${grade}-${subject}-001`,
      name: `${subject} Fundamentals for Class ${grade}`,
      description: `Core concepts and fundamentals of ${subject} designed for Class ${grade} students following ${board} curriculum.`,
      subject: [subject],
      gradeLevel: [grade],
      resourceType: 'Course',
      mediaType: 'text',
      mimeType: 'application/vnd.ekstep.content-collection',
      contentType: 'Course',
      objectType: 'Content',
      board: [board]
    },
    {
      identifier: `diksha-${board}-${grade}-${subject}-002`,
      name: `Advanced ${subject} for Class ${grade}`,
      description: `Advanced topics in ${subject} for Class ${grade} students who have mastered the fundamentals.`,
      subject: [subject],
      gradeLevel: [grade],
      resourceType: 'TextBook',
      mediaType: 'text',
      mimeType: 'application/vnd.ekstep.content-collection',
      contentType: 'TextBook',
      objectType: 'Content',
      board: [board]
    },
    {
      identifier: `diksha-${board}-${grade}-${subject}-003`,
      name: `${subject} Practice Materials - Class ${grade}`,
      description: `Practice exercises and worksheets for ${subject} Class ${grade} following ${board} curriculum.`,
      subject: [subject],
      gradeLevel: [grade],
      resourceType: 'LessonPlan',
      mediaType: 'text',
      mimeType: 'application/vnd.ekstep.content-collection',
      contentType: 'LessonPlan',
      objectType: 'Content',
      board: [board]
    }
  ];
  
  return mockCourses;
};
