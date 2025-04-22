
const DIKSHA_BASE_URL = 'https://diksha.gov.in/api';

export const searchDikshaCourses = async (
  board: string = 'CBSE',
  grade: string,
  subject: string
): Promise<DikshaCourse[]> => {
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
      throw new Error('Failed to fetch DIKSHA content');
    }

    const data: DikshaSearchResponse = await response.json();
    return data.result.content;
  } catch (error) {
    console.error('Error fetching DIKSHA content:', error);
    return [];
  }
}

export const convertDikshaCourseToUnit = (course: DikshaCourse): Unit => {
  return {
    id: course.identifier,
    name: course.name,
    startDate: new Date(), // Teacher will set these
    endDate: new Date(),
    objectives: course.description || 'Objectives to be defined',
    keyConcepts: `Content Type: ${course.contentType}\nResource Type: ${course.resourceType}`,
    resources: [{
      id: course.identifier,
      name: course.name,
      type: 'Link',
      url: `https://diksha.gov.in/play/content/${course.identifier}`
    }],
    lessons: [],
    estimatedTime: '2 weeks'
  };
};

