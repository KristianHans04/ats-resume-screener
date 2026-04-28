export async function analyzeResume(env, jobDescription, resumeText) {
  const prompt = `You are an expert technical recruiter. Analyze the candidate's CV against the Job Description.

Job Description:
${jobDescription}

Candidate CV:
${resumeText}

Output valid JSON with exactly this structure:
{
  "score": <float 0-100>,
  "semantic_gaps": [
    {"skill": "<gap skill>", "similarity": <float 0-1>}
  ],
  "generated_questions": [
    {"id": "q1", "role": "system", "gap": "<gap skill>", "text": "<question>"}
  ]
}
Generate at most 2 questions for the most critical semantic gaps.
Return ONLY valid JSON. No markdown, no code blocks.`;

  return callAI(env, prompt);
}

export async function evaluateAnswers(env, jobDescription, questions, answers, currentScore) {
  const prompt = `You are an expert technical recruiter evaluating a candidate's answers to skill-gap questions.

Job Description:
${jobDescription}

Questions Asked:
${JSON.stringify(questions)}

Candidate's Answers:
${JSON.stringify(answers)}

Current Resume Score: ${currentScore}

Evaluate their competence and adjust the score (0-100).

Output valid JSON with exactly this structure:
{
  "adjusted_score": <float 0-100>
}
Return ONLY valid JSON. No markdown, no code blocks.`;

  return callAI(env, prompt);
}

async function callAI(env, prompt) {
  // Try OpenRouter first, fall back to Google AI
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
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://ats.kristianhans.com',
      'X-Title': 'CSAS Engine',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-exp:free',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('Empty response from OpenRouter');

  return parseAIResponse(text);
}

async function callGoogleAI(apiKey, prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
    throw new Error(`Google AI error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error('Empty response from Google AI');

  return parseAIResponse(text);
}

function parseAIResponse(text) {
  let cleaned = text;
  if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
  else if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
  if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
  cleaned = cleaned.trim();

  return JSON.parse(cleaned);
}
