export async function analyzeResume(env, jobDescription, resumeText) {
  // Truncate inputs to stay within free-tier model context limits (~4k tokens budget)
  const truncatedJob = jobDescription.slice(0, 3000);
  const truncatedResume = resumeText.slice(0, 6000);

  const prompt = `You are an expert technical recruiter AI. Your task is to analyze a candidate's uploaded document against a Job Description and classify it.

Job Description:
${truncatedJob}

Candidate's Uploaded Document:
${truncatedResume}

STEP 1 - CLASSIFY the uploaded document into one of these 4 categories:
1. "STRONG" - The document is a CV/resume that is a strong match for the role
2. "UNDEREXPLAINED" - The document is a CV/resume relevant to the role but has gaps or undersold experience
3. "REJECTED_WRONG_ROLE" - The document is a CV/resume but completely irrelevant to this role (e.g. a cooking CV for a software dev role)
4. "REJECTED_NOT_CV" - The document is NOT a CV/resume at all (e.g. SQL injection attempt, marriage certificate, random text, or any non-CV document)

STEP 2 - Based on classification:
- For STRONG or UNDEREXPLAINED: Generate exactly 3 targeted questions that address gaps between the job requirements and the candidate's CV. These questions should help the candidate strengthen their application. Look for:
  * Skills listed in requirements but missing or underexplained in the CV
  * Projects or experience that seem undersold and could be elaborated on
  * Claimed skills with no supporting evidence (e.g. "PHP" listed but no PHP projects)
  * Give a score from 0-100 reflecting how well the CV matches the role
- For REJECTED_WRONG_ROLE: Provide a clear rejection reason. Score = 0. No questions.
- For REJECTED_NOT_CV: Provide a clear rejection reason asking them to upload an actual CV. Score = 0. No questions.

Output valid JSON with exactly this structure:
{
  "classification": "STRONG" | "UNDEREXPLAINED" | "REJECTED_WRONG_ROLE" | "REJECTED_NOT_CV",
  "score": <number 0-100>,
  "rejection_reason": "<string explaining rejection, or null if not rejected>",
  "semantic_gaps": [
    {"skill": "<gap skill/requirement>", "similarity": <float 0-1 how close the candidate is to meeting it>}
  ],
  "generated_questions": [
    {"id": "q1", "role": "system", "gap": "<targeted gap/skill>", "text": "<specific question for the candidate>"},
    {"id": "q2", "role": "system", "gap": "<targeted gap/skill>", "text": "<specific question for the candidate>"},
    {"id": "q3", "role": "system", "gap": "<targeted gap/skill>", "text": "<specific question for the candidate>"}
  ]
}

For rejected classifications, semantic_gaps and generated_questions should be empty arrays.
Return ONLY valid JSON. No markdown, no code blocks, no explanation.`;

  const raw = await callAI(env, prompt);
  return validateAnalysisResponse(raw);
}

export async function evaluateAnswers(env, jobDescription, questions, answers, currentScore) {
  const prompt = `You are an expert technical recruiter evaluating a candidate's answers to skill-gap questions.

Job Description:
${jobDescription}

Questions Asked:
${JSON.stringify(questions)}

Candidate's Answers:
${JSON.stringify(answers)}

Current Resume Score: ${currentScore}/100

Evaluate how well the candidate answered each question. Consider:
- Did they demonstrate real knowledge/experience?
- Did they provide specific examples or just vague claims?
- Did their answers address the identified gaps?

Based on the quality of answers, adjust the overall score (0-100).
If answers are strong and fill the gaps, increase the score.
If answers are weak or evasive, decrease or maintain the score.

Output valid JSON with exactly this structure:
{
  "adjusted_score": <number 0-100>,
  "answer_evaluations": [
    {"question_id": "<id>", "quality": <number 0-100>, "feedback": "<brief assessment>"}
  ]
}
Return ONLY valid JSON. No markdown, no code blocks.`;

  const raw = await callAI(env, prompt);
  return validateEvaluationResponse(raw, currentScore);
}

async function callAI(env, prompt) {
  // OpenRouter free first (user preference), Google AI as fallback
  const providers = [];

  if (env.OPENROUTER_API_KEY) {
    providers.push(() => callOpenRouter(env.OPENROUTER_API_KEY, prompt));
  }
  if (env.GOOGLE_AI_API_KEY) {
    providers.push(() => callGoogleAI(env.GOOGLE_AI_API_KEY, prompt));
  }

  if (providers.length === 0) {
    throw new Error('No AI API key configured. Set OPENROUTER_API_KEY or GOOGLE_AI_API_KEY.');
  }
  console.log(`[AI] callAI | openrouter=${!!env.OPENROUTER_API_KEY} | google=${!!env.GOOGLE_AI_API_KEY}`);

  for (const provider of providers) {
    try {
      return await provider();
    } catch (err) {
      console.error('AI provider failed, trying next:', err.message);
    }
  }

  throw new Error('All AI providers failed');
}

async function callOpenRouter(apiKey, prompt) {
  // openrouter/free auto-selects the best available free model
  const models = ['openrouter/free'];

  for (const model of models) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ats.kristianhans.com',
          'X-Title': 'CSAS Engine',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error(`OpenRouter model ${model} failed: ${response.status} - ${err}`);
        continue;
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content?.trim();
      if (!text) {
        console.error(`Empty response from OpenRouter model ${model}`);
        continue;
      }

      console.log(`[AI] OpenRouter success with model=${model}`);
      return parseAIResponse(text);
    } catch (err) {
      console.error(`OpenRouter model ${model} threw:`, err.message);
    }
  }

  throw new Error('All OpenRouter models failed');
}

async function callGoogleAI(apiKey, prompt) {
  const attempts = [
    { model: 'gemini-2.5-flash', version: 'v1' },
    { model: 'gemini-2.5-pro', version: 'v1' },
    { model: 'gemini-2.0-flash', version: 'v1' },
  ];

  for (const { model, version } of attempts) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3 },
          }),
        }
      );

      if (!response.ok) {
        const err = await response.text();
        console.error(`Google AI ${version}/${model} failed: ${response.status} - ${err}`);
        continue;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!text) {
        console.error(`Empty response from Google AI ${version}/${model}`);
        continue;
      }

      console.log(`[AI] Google success with ${version}/${model}`);
      return parseAIResponse(text);
    } catch (err) {
      console.error(`Google AI ${version}/${model} threw:`, err.message);
    }
  }

  throw new Error('All Google AI models failed');
}

function parseAIResponse(text) {
  let cleaned = text;
  if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
  else if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
  if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
  cleaned = cleaned.trim();

  return JSON.parse(cleaned);
}

const VALID_CLASSIFICATIONS = ['STRONG', 'UNDEREXPLAINED', 'REJECTED_WRONG_ROLE', 'REJECTED_NOT_CV'];

function validateAnalysisResponse(raw) {
  const classification = VALID_CLASSIFICATIONS.includes(raw.classification)
    ? raw.classification
    : 'UNDEREXPLAINED';

  const isRejected = classification === 'REJECTED_WRONG_ROLE' || classification === 'REJECTED_NOT_CV';

  const score = typeof raw.score === 'number'
    ? Math.max(0, Math.min(100, raw.score))
    : isRejected ? 0 : 50;

  const rejection_reason = isRejected
    ? (raw.rejection_reason || 'Application did not meet requirements.')
    : null;

  let semantic_gaps = [];
  if (Array.isArray(raw.semantic_gaps)) {
    semantic_gaps = raw.semantic_gaps.map(g => ({
      skill: g.skill || g.name || 'Unknown',
      similarity: typeof g.similarity === 'number' ? Math.max(0, Math.min(1, g.similarity)) : 0,
    }));
  }

  let generated_questions = [];
  if (!isRejected && Array.isArray(raw.generated_questions)) {
    generated_questions = raw.generated_questions
      .filter(q => q && q.text)
      .slice(0, 3)
      .map((q, i) => ({
        id: q.id || `q${i + 1}`,
        role: 'system',
        gap: q.gap || `Requirement ${i + 1}`,
        text: q.text,
      }));
  }

  return {
    classification,
    score,
    rejection_reason,
    semantic_gaps,
    generated_questions,
  };
}

function validateEvaluationResponse(raw, currentScore) {
  const adjusted_score = typeof raw.adjusted_score === 'number'
    ? Math.max(0, Math.min(100, raw.adjusted_score))
    : currentScore;

  let answer_evaluations = [];
  if (Array.isArray(raw.answer_evaluations)) {
    answer_evaluations = raw.answer_evaluations.map(e => ({
      question_id: e.question_id || '',
      quality: typeof e.quality === 'number' ? Math.max(0, Math.min(100, e.quality)) : 0,
      feedback: e.feedback || '',
    }));
  }

  return { adjusted_score, answer_evaluations };
}
