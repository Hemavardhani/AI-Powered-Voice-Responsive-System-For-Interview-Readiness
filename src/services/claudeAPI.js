const CLAUDE_API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

// Question categories for better flow
const QUESTION_PHASES = {
  HR: "HR and behavioral questions",
  TECHNICAL: "technical and role-specific questions",
  BEHAVIORAL: "situational and problem-solving questions",
};

export const generateQuestion = async (
  role,
  level,
  questionHistory,
  currentPhase = "HR",
) => {
  try {
    // Determine which type of question to ask
    let questionType = QUESTION_PHASES.HR;
    const questionCount = questionHistory.length;

    if (questionCount < 2) {
      questionType = QUESTION_PHASES.HR;
    } else if (questionCount < 7) {
      questionType = QUESTION_PHASES.TECHNICAL;
    } else {
      questionType = QUESTION_PHASES.BEHAVIORAL;
    }

    const response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `You are an expert interviewer conducting a ${level} level interview for a ${role} position.

Interview Progress: Question ${questionCount + 1}
Current Focus: ${questionType}

Previously asked questions:
${questionHistory.length > 0 ? questionHistory.join("\n") : "None yet"}

Generate ONE unique ${questionType} that:
1. Is different from all previous questions
2. Is appropriate for ${level} level candidates
3. Is commonly asked by top companies for ${role} roles
4. Tests real-world skills and experience

Return ONLY the question text, nothing else.`,
          },
        ],
      }),
    });

    const data = await response.json();
    const question = data.content[0].text.trim();

    // Fallback questions if API fails
    if (!question || question.length < 10) {
      return getFallbackQuestion(questionCount, role, level);
    }

    return question;
  } catch (error) {
    console.error("Error generating question:", error);
    return getFallbackQuestion(questionHistory.length, role, level);
  }
};

// Fallback questions in case API fails
const getFallbackQuestion = (count, role, level) => {
  const fallbacks = [
    "Tell me about yourself and your background.",
    "Why are you interested in this role?",
    `What technical skills do you have that make you suitable for a ${role} position?`,
    `Describe a challenging project you worked on. What was your role?`,
    `How do you stay updated with the latest technologies in ${role}?`,
    "Tell me about a time you had to learn something new quickly.",
    "How do you handle tight deadlines and pressure?",
    "Where do you see yourself in 3-5 years?",
    "What are your greatest strengths as a developer?",
    "Do you have any questions for me?",
  ];
  return fallbacks[count % fallbacks.length];
};

export const generateFeedback = async (role, level, qaHistory) => {
  try {
    const conversationText = qaHistory
      .map(
        (qa, idx) =>
          `Question ${idx + 1}: ${qa.question}\nYour Answer: ${qa.answer || "No answer provided"}`,
      )
      .join("\n\n");

    const response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: `You just conducted a ${level} level interview for a ${role} position. 

Here is the complete interview transcript:

${conversationText}

Provide detailed, constructive feedback using this format:

OVERALL PERFORMANCE: [Brief summary in 2-3 sentences]

STRENGTHS:
• [List 3-4 specific things they did well with examples]

AREAS FOR IMPROVEMENT:
• [List 3-4 specific areas they need to work on]

TECHNICAL COMPETENCY: [Rating and explanation]

COMMUNICATION SKILLS: [Rating and explanation]

RECOMMENDATIONS:
• [3-4 actionable steps they can take to improve]

OVERALL RATING: [X/10] - [Brief justification]

Be honest but encouraging. Focus on specific examples from their answers.`,
          },
        ],
      }),
    });

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error("Error generating feedback:", error);
    return `Interview completed for ${role} position (${level} level).\n\nThank you for participating in this mock interview. Due to a technical issue, detailed feedback could not be generated. Please review your answers and try again.`;
  }
};

// Check if candidate should continue or end interview
export const shouldContinueInterview = (qaHistory) => {
  // Minimum 8 questions, maximum 12
  if (qaHistory.length < 8) return true;
  if (qaHistory.length >= 12) return false;

  // Continue if answers are substantial (basic check)
  const recentAnswers = qaHistory.slice(-3);
  const avgLength =
    recentAnswers.reduce((sum, qa) => sum + (qa.answer?.length || 0), 0) / 3;

  // If answers are getting too short, end interview
  if (avgLength < 20) return false;

  return true;
};
