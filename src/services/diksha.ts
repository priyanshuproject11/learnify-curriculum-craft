import { DikshaCourse, DikshaSearchResponse, Unit, DikshaFramework, DikshaFrameworkCategory } from "@/types/curriculum";

// Update to use the real DIKSHA API URL
const DIKSHA_BASE_URL = 'https://diksha.gov.in/api';

// Framework API endpoint to get CBSE structure
export const fetchCBSEFramework = async (): Promise<DikshaFramework | null> => {
  try {
    console.log('Fetching CBSE curriculum framework from DIKSHA');
    
    const response = await fetch(`${DIKSHA_BASE_URL}/framework/v1/read/cbse`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch DIKSHA framework: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('DIKSHA Framework data:', data);
    return data.result.framework;
  } catch (error) {
    console.error('Error fetching DIKSHA framework:', error);
    // For resilience, return mock framework data if API fails
    console.log('Using mock CBSE framework data');
    return getMockFrameworkData();
  }
};

// Parse framework data to get grade levels and subjects
export const getGradesAndSubjects = (framework: DikshaFramework | null): {
  grades: { id: string; name: string }[];
  subjects: { id: string; name: string }[];
} => {
  if (!framework || !framework.categories) {
    return { grades: [], subjects: [] };
  }

  // Find grade and subject categories
  const gradeCategory = framework.categories.find(cat => 
    cat.code === 'gradeLevel' || cat.code === 'class'
  );
  const subjectCategory = framework.categories.find(cat => 
    cat.code === 'subject'
  );

  // Extract grades
  const grades = gradeCategory?.terms?.map(term => ({
    id: term.identifier || term.code,
    name: term.name
  })) || [];

  // Extract subjects
  const subjects = subjectCategory?.terms?.map(term => ({
    id: term.identifier || term.code,
    name: term.name
  })) || [];

  return { grades, subjects };
};

export const searchDikshaCourses = async (
  board: string = 'CBSE',
  grade: string,
  subject: string
): Promise<DikshaCourse[]> => {
  try {
    console.log(`Searching DIKSHA courses for board: ${board}, grade: ${grade}, subject: ${subject}`);
    
    // Attempt to make the real API call
    try {
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
      console.log('Real DIKSHA courses fetched:', data.result.content.length);
      return data.result.content;
    } catch (apiError) {
      console.warn('DIKSHA API call failed, falling back to mock data:', apiError);
      throw apiError; // Re-throw to use mock data
    }
  } catch (error) {
    console.error('Error fetching DIKSHA content:', error);
    // For resilience, return mock data if API fails
    console.log('Returning mock DIKSHA courses');
    return getMockDikshaCourses(board, grade, subject);
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

// Mock framework data
const getMockFrameworkData = (): DikshaFramework => {
  return {
    identifier: "cbse",
    code: "cbse",
    name: "CBSE",
    description: "Central Board of Secondary Education",
    categories: [
      {
        identifier: "cbse_gradeLevel",
        code: "gradeLevel",
        name: "Class",
        description: "Grade or Class",
        terms: [
          { identifier: "class1", code: "class1", name: "Class 1" },
          { identifier: "class2", code: "class2", name: "Class 2" },
          { identifier: "class3", code: "class3", name: "Class 3" },
          { identifier: "class4", code: "class4", name: "Class 4" },
          { identifier: "class5", code: "class5", name: "Class 5" },
          { identifier: "class6", code: "class6", name: "Class 6" },
          { identifier: "class7", code: "class7", name: "Class 7" },
          { identifier: "class8", code: "class8", name: "Class 8" },
          { identifier: "class9", code: "class9", name: "Class 9" },
          { identifier: "class10", code: "class10", name: "Class 10" },
          { identifier: "class11", code: "class11", name: "Class 11" },
          { identifier: "class12", code: "class12", name: "Class 12" }
        ]
      },
      {
        identifier: "cbse_subject",
        code: "subject",
        name: "Subject",
        description: "Subject of study",
        terms: [
          { identifier: "mathematics", code: "mathematics", name: "Mathematics" },
          { identifier: "science", code: "science", name: "Science" },
          { identifier: "socialstudies", code: "socialstudies", name: "Social Studies" },
          { identifier: "english", code: "english", name: "English" },
          { identifier: "hindi", code: "hindi", name: "Hindi" },
          { identifier: "physics", code: "physics", name: "Physics" },
          { identifier: "chemistry", code: "chemistry", name: "Chemistry" },
          { identifier: "biology", code: "biology", name: "Biology" },
          { identifier: "history", code: "history", name: "History" },
          { identifier: "geography", code: "geography", name: "Geography" }
        ]
      }
    ]
  };
};
