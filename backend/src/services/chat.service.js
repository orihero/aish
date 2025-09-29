import axios from "axios";
import { Chat } from "../models/chat.model.js";
import { Application } from "../models/application.model.js";
import { Vacancy } from "../models/vacancy.model.js";
import { Resume } from "../models/resume.model.js";
import { Logger } from "../utils/logger.js";
import {
  SCREENING_SYSTEM_PROMPT,
  SCREENING_INITIAL_PROMPT,
  SCREENING_FALLBACK_MESSAGE,
  SCREENING_MISMATCH_MESSAGE,
  SCREENING_COMPLETION_MESSAGE,
  SCREENING_PARTIAL_RESPONSE_PROMPT,
  EVALUATION_SYSTEM_PROMPT,
  EVALUATION_USER_PROMPT,
  EVALUATION_ERROR_FALLBACK
} from "../prompts/index.js";

// Helper function to check if candidate background matches the position
function checkCandidateMatch(vacancy, resume) {
  try {
    const vacancyTitle = vacancy.title.toLowerCase();
    const vacancyDescription = vacancy.description.toLowerCase();
    const resumeSkills = resume.parsedData?.skills?.map(s => s.name.toLowerCase()) || [];
    const resumeExperience = resume.parsedData?.work || [];
    const currentRole = resume.parsedData?.basics?.label?.toLowerCase() || '';
    
    // Define position categories and their typical skills
    const positionCategories = {
      'backend': ['javascript', 'node.js', 'python', 'java', 'c#', 'php', 'ruby', 'go', 'rust', 'database', 'api', 'server'],
      'frontend': ['javascript', 'react', 'vue', 'angular', 'html', 'css', 'typescript', 'ui', 'ux', 'design'],
      'fullstack': ['javascript', 'react', 'node.js', 'python', 'full stack', 'fullstack', 'mern', 'mean'],
      'mobile': ['react native', 'flutter', 'ios', 'android', 'swift', 'kotlin', 'mobile'],
      'devops': ['docker', 'kubernetes', 'aws', 'azure', 'ci/cd', 'jenkins', 'terraform', 'linux'],
      'data': ['python', 'sql', 'machine learning', 'ai', 'data science', 'analytics', 'pandas', 'numpy'],
      'design': ['photoshop', 'illustrator', 'figma', 'sketch', 'ui', 'ux', 'graphic design', 'web design'],
      'marketing': ['seo', 'sem', 'social media', 'content', 'analytics', 'google ads', 'facebook ads'],
      'project': ['project management', 'agile', 'scrum', 'jira', 'trello', 'pm', 'product management'],
      'video': ['video editing', 'premiere', 'after effects', 'final cut', 'video production', 'motion graphics']
    };
    
    // Check if vacancy title/description contains position category keywords
    let vacancyCategory = null;
    for (const [category, keywords] of Object.entries(positionCategories)) {
      if (keywords.some(keyword => vacancyTitle.includes(keyword) || vacancyDescription.includes(keyword))) {
        vacancyCategory = category;
        break;
      }
    }
    
    // If we can't determine vacancy category, assume it's a match (let AI decide)
    if (!vacancyCategory) {
      return { isMatch: true, reason: 'Unable to determine position category' };
    }
    
    // Check if candidate has relevant skills for the position
    const hasRelevantSkills = positionCategories[vacancyCategory].some(skill => 
      resumeSkills.some(resumeSkill => resumeSkill.includes(skill)) ||
      currentRole.includes(skill)
    );
    
    // Check for obvious mismatches
    const obviousMismatches = {
      'backend': ['video editing', 'graphic design', 'marketing', 'social media'],
      'frontend': ['video editing', 'machine learning', 'data science', 'devops'],
      'mobile': ['backend', 'database', 'server', 'api development'],
      'devops': ['video editing', 'graphic design', 'ui design', 'frontend'],
      'data': ['video editing', 'graphic design', 'ui design', 'frontend'],
      'design': ['backend', 'database', 'server', 'api', 'programming'],
      'marketing': ['backend', 'database', 'server', 'api', 'programming'],
      'project': ['video editing', 'graphic design', 'programming', 'development'],
      'video': ['backend', 'database', 'server', 'api', 'programming', 'development']
    };
    
    const hasObviousMismatch = obviousMismatches[vacancyCategory]?.some(mismatchSkill =>
      resumeSkills.some(resumeSkill => resumeSkill.includes(mismatchSkill)) ||
      currentRole.includes(mismatchSkill)
    );
    
    if (hasObviousMismatch) {
      return { 
        isMatch: false, 
        reason: `Candidate has ${vacancyCategory} skills but applying for ${vacancyCategory} position` 
      };
    }
    
    // If no obvious mismatch and has some relevant skills, consider it a match
    return { 
      isMatch: hasRelevantSkills, 
      reason: hasRelevantSkills ? 'Candidate has relevant skills' : 'Candidate lacks relevant skills' 
    };
    
  } catch (error) {
    Logger.error("❌ Error checking candidate match", error);
    // If there's an error, assume it's a match and let AI decide
    return { isMatch: true, reason: 'Error in match checking, defaulting to match' };
  }
}

export async function startScreeningChat(application, vacancy, resume) {
  try {
    Logger.info("💬 Starting screening chat", {
      applicationId: application._id,
      vacancyId: vacancy._id,
      candidateId: application.user,
      vacancyTitle: vacancy.title,
    });

    // Get the latest application data with evaluation results
    const latestApplication = await Application.findById(application._id);
    
    // Check if candidate matches the position
    const matchResult = checkCandidateMatch(vacancy, resume);
    
    // Check evaluation score for AI rejection
    const evaluationScore = latestApplication?.totalEvaluationScore || 0;
    const isLowScore = evaluationScore < 30; // Reject if score is below 30
    
    Logger.info("🔍 Candidate match and evaluation check", {
      applicationId: application._id,
      isMatch: matchResult.isMatch,
      reason: matchResult.reason,
      evaluationScore: evaluationScore,
      isLowScore: isLowScore,
      vacancyTitle: vacancy.title,
      candidateSkills: resume.parsedData?.skills?.map(s => s.name) || []
    });

    // Create initial chat
    const chat = new Chat({
      application: application._id,
      vacancy: vacancy._id,
      candidate: application.user,
      messages: [
        {
          role: "system",
          content: SCREENING_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: SCREENING_INITIAL_PROMPT(vacancy, resume),
        },
      ],
    });

    // If there's a mismatch or low evaluation score, handle AI rejection
    if (!matchResult.isMatch || isLowScore) {
      const rejectionReason = !matchResult.isMatch ? matchResult.reason : `Low evaluation score: ${evaluationScore}/100`;
      
      Logger.info("❌ Candidate rejection detected", {
        applicationId: application._id,
        reason: rejectionReason,
        isMatch: matchResult.isMatch,
        isLowScore: isLowScore,
        evaluationScore: evaluationScore
      });

      // Add rejection message to chat
      chat.messages.push({
        role: "assistant",
        content: SCREENING_MISMATCH_MESSAGE,
      });

      // Set chat status to ai-rejected
      chat.status = "ai-rejected";
      
      // Update application status to ai-rejected
      await Application.findByIdAndUpdate(application._id, {
        status: "ai-rejected",
        updatedAt: new Date()
      });

      // Save chat
      await chat.save();

      Logger.success("🎯 AI rejection completed", {
        chatId: chat._id,
        applicationId: application._id,
        status: "ai-rejected",
        reason: rejectionReason
      });

      return chat;
    }

    Logger.debug("📝 Created initial chat messages", {
      messageCount: chat.messages.length,
      vacancyTitle: vacancy.title,
      resumeDataKeys: Object.keys(resume.parsedData || {}),
    });

    // Get AI's initial response
    Logger.info("🤖 Calling AI API for initial response", {
      model:
        process.env.OPENROUTER_CHAT_MODEL || "meta-llama/llama-4-maverick:free",
      messageCount: chat.messages,
      temperature: parseFloat(process.env.OPENROUTER_CHAT_TEMPERATURE || "0.7"),
    });

    const response = await axios.post(
      process.env.OPENROUTER_API_URL ||
        "https://openrouter.ai/api/v1/chat/completions",
      {
        model:
          process.env.OPENROUTER_CHAT_MODEL ||
          "meta-llama/llama-4-maverick:free",
        messages: chat.messages,
        temperature: parseFloat(
          process.env.OPENROUTER_CHAT_TEMPERATURE || "0.7"
        ),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.SITE_URL,
          "X-Title": "Job Application Chat",
        },
      }
    );

    console.log(JSON.stringify(response.data.choices[0].message, null, 2));

    const aiResponse = response.data.choices[0].message.content;

    Logger.success("✅ AI response received", {
      responseLength: aiResponse ? aiResponse.length : 0,
      usage: response.data.usage,
    });

    // Only add AI's response if it has content
    if (aiResponse && aiResponse.trim()) {
      chat.messages.push({
        role: "assistant",
        content: aiResponse,
      });
    } else {
      Logger.warning("⚠️ AI response is empty, adding fallback message", {
        chatId: chat._id,
        responseLength: aiResponse ? aiResponse.length : 0,
      });

      // Add a fallback message if AI response is empty
      chat.messages.push({
        role: "assistant",
        content: SCREENING_FALLBACK_MESSAGE,
      });
    }

    Logger.debug("💾 Saving chat to database", { chatId: chat._id });
    await chat.save();

    Logger.success("🎉 Screening chat started successfully", {
      chatId: chat._id,
      totalMessages: chat.messages.length,
    });

    return chat;
  } catch (error) {
    Logger.error("❌ Error starting screening chat", error);
    throw error;
  }
}

export async function continueChat(chatId, message) {
  try {
    Logger.info("💬 Continuing chat", {
      chatId,
      messageLength: message.length,
    });

    const chat = await Chat.findById(chatId);
    if (!chat) {
      Logger.error("❌ Chat not found", { chatId });
      throw new Error("Chat not found");
    }

    // Check if chat is already ai-rejected or ai-reviewed - don't allow further responses
    if (chat.status === "ai-rejected" || chat.status === "ai-reviewed") {
      Logger.info("🚫 Chat is completed (ai-rejected/ai-reviewed), not processing further messages", {
        chatId,
        status: chat.status
      });
      
      // Just add the user message but don't generate AI response
      chat.messages.push({
        role: "user",
        content: message,
      });
      
      await chat.save();
      return chat;
    }

    Logger.debug("📝 Adding user message to chat", {
      chatId,
      currentMessageCount: chat.messages.length,
      userMessageLength: message.length,
    });

    // Add user message
    chat.messages.push({
      role: "user",
      content: message,
    });

    // Get AI response
    Logger.info("🤖 Getting AI response for chat continuation", {
      chatId,
      totalMessages: chat.messages.length,
      model:
        process.env.OPENROUTER_CHAT_MODEL || "meta-llama/llama-4-maverick:free",
    });

    const response = await axios.post(
      process.env.OPENROUTER_API_URL ||
        "https://openrouter.ai/api/v1/chat/completions",
      {
        model:
          process.env.OPENROUTER_CHAT_MODEL ||
          "meta-llama/llama-4-maverick:free",
        messages: chat.messages,
        temperature: parseFloat(
          process.env.OPENROUTER_CHAT_TEMPERATURE || "0.7"
        ),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.SITE_URL,
          "X-Title": "Job Application Chat",
        },
      }
    );

    console.log(JSON.stringify(response.data, null, 2));

    const aiResponse = response.data.choices[0].message.content;

    Logger.success("✅ AI response received for chat continuation", {
      chatId,
      responseLength: aiResponse ? aiResponse.length : 0,
      usage: response.data.usage,
    });

    // Only add AI response if it has content
    if (aiResponse && aiResponse.trim()) {
      const aiMessage = {
        role: "assistant",
        content: aiResponse,
      };
      chat.messages.push(aiMessage);
    } else {
      Logger.warning(
        "⚠️ AI response is empty during chat continuation, adding fallback message",
        {
          chatId,
          responseLength: aiResponse ? aiResponse.length : 0,
        }
      );

      // Add a fallback message if AI response is empty
      const aiMessage = {
        role: "assistant",
        content:
          "I apologize, but I didn't receive a proper response. Could you please rephrase your question?",
      };
      chat.messages.push(aiMessage);
    }

    // Check if screening should end based on new logic
    await checkScreeningCompletion(chat);

    Logger.debug("💾 Saving updated chat to database", { chatId });
    await chat.save();

    Logger.success("🎉 Chat continued successfully", {
      chatId,
      totalMessages: chat.messages.length,
    });

    return chat;
  } catch (error) {
    Logger.error("❌ Error continuing chat", error);
    throw error;
  }
}

// Helper function to check if screening is complete and handle next steps
async function checkScreeningCompletion(chat) {
  try {
    const userMessages = chat.messages.filter(msg => msg.role === 'user');
    const assistantMessages = chat.messages.filter(msg => msg.role === 'assistant');
    
    // Skip if this is the first message (AI asking questions)
    if (userMessages.length === 0) {
      return;
    }
    
    Logger.info("🔍 Checking screening completion", {
      chatId: chat._id,
      userMessages: userMessages.length,
      assistantMessages: assistantMessages.length
    });

    // If we have 2+ user responses, it's time to evaluate completion
    if (userMessages.length >= 2) {
      Logger.info("🏁 Maximum exchanges reached, completing screening", {
        chatId: chat._id,
        totalMessages: chat.messages.length,
      });
      
      // Add completion message and evaluate
      chat.messages.push({
        role: "assistant",
        content: SCREENING_COMPLETION_MESSAGE
      });
      
      await evaluateCandidate(chat);
      return;
    }

    // If this is the first user response, check if it's complete
    if (userMessages.length === 1) {
      const lastUserMessage = userMessages[userMessages.length - 1].content;
      
      // Simple heuristic: if the response is very short (< 200 chars) or doesn't contain numbers (question indicators)
      // it's likely incomplete
      const isLikelyIncomplete = lastUserMessage.length < 200 || 
                                 !lastUserMessage.match(/\d+[.)]/g) || // No numbered responses
                                 lastUserMessage.split('\n').length < 3; // Too few lines
      
      if (isLikelyIncomplete) {
        Logger.info("📝 Response appears incomplete, asking for missing information", {
          chatId: chat._id,
          responseLength: lastUserMessage.length
        });
        
        // Ask for missing information
        chat.messages.push({
          role: "assistant",
          content: "Thank you for your response! It looks like you may have missed some of the screening questions. Please make sure to answer all the numbered questions I asked earlier so we can complete your screening process."
        });
      } else {
        Logger.info("✅ Response appears complete, finishing screening", {
          chatId: chat._id,
          responseLength: lastUserMessage.length
        });
        
        // Response seems complete, finish screening
        chat.messages.push({
          role: "assistant",
          content: SCREENING_COMPLETION_MESSAGE
        });
        
        await evaluateCandidate(chat);
      }
    }
  } catch (error) {
    Logger.error("❌ Error checking screening completion", error);
  }
}

// Helper function to extract evaluation data from text/markdown response
function extractEvaluationFromText(text) {
  try {
    // Look for score patterns like "Score: 15/100", "15/100", "Score: 15"
    const scoreMatch = text.match(/(?:score|evaluation)?\s*:?\s*(\d+)(?:\/100)?/i);
    let score = 0;
    
    if (scoreMatch) {
      score = parseInt(scoreMatch[1]);
      // Ensure score is within valid range
      score = Math.max(0, Math.min(100, score));
    }
    
    // Use the entire text as feedback, but clean it up a bit
    let feedback = text;
    
    // Remove excessive formatting and clean up
    feedback = feedback
      .replace(/#{1,6}\s*/g, '') // Remove markdown headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
      .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
      .trim();
    
    return {
      score: score,
      feedback: feedback
    };
  } catch (error) {
    Logger.error("❌ Error extracting evaluation from text", error);
    return EVALUATION_ERROR_FALLBACK;
  }
}

async function evaluateCandidateImmediately(application, vacancy, resume) {
  try {
    Logger.info("📊 Starting immediate candidate evaluation", {
      applicationId: application._id,
      vacancyId: vacancy._id,
      resumeId: resume._id,
      model: process.env.OPENROUTER_EVAL_MODEL || "meta-llama/llama-4-maverick:free",
    });

    const response = await axios.post(
      process.env.OPENROUTER_API_URL ||
        "https://openrouter.ai/api/v1/chat/completions",
      {
        model:
          process.env.OPENROUTER_EVAL_MODEL ||
          "meta-llama/llama-4-maverick:free",
        messages: [
          {
            role: "system",
            content: EVALUATION_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: EVALUATION_USER_PROMPT([], vacancy, resume), // Empty chat messages for immediate evaluation
          },
        ],
        temperature: parseFloat(
          process.env.OPENROUTER_EVAL_TEMPERATURE || "0.3"
        ),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.SITE_URL,
          "X-Title": "Immediate Candidate Evaluation",
        },
      }
    );

    Logger.debug("🔍 Full AI response received for immediate evaluation", {
      applicationId: application._id,
      response: JSON.stringify(response.data, null, 2)
    });

    const evaluationResponse = response.data.choices[0].message.content;

    Logger.success("✅ Immediate evaluation response received", {
      applicationId: application._id,
      responseLength: evaluationResponse ? evaluationResponse.length : 0,
      usage: response.data.usage,
    });

    if (!evaluationResponse || !evaluationResponse.trim()) {
      Logger.error("❌ Immediate evaluation response is empty", { applicationId: application._id });
      throw new Error("AI evaluation returned empty response");
    }

    let evaluation;
    try {
      // Try to parse as JSON first
      evaluation = JSON.parse(evaluationResponse);
    } catch (jsonError) {
      Logger.warn("⚠️ Response is not valid JSON, attempting to extract data", {
        applicationId: application._id,
        responsePreview: evaluationResponse.substring(0, 200)
      });
      
      // Fallback: try to extract score and feedback from markdown/text response
      evaluation = extractEvaluationFromText(evaluationResponse);
    }

    // Validate the new evaluation structure
    if (!evaluation || !evaluation.evaluations || !Array.isArray(evaluation.evaluations)) {
      Logger.error("❌ Invalid evaluation format", { 
        applicationId: application._id, 
        evaluation: evaluation 
      });
      throw new Error("AI evaluation returned invalid format");
    }

    // Calculate total evaluation score from all evaluations
    // Handle scores that might be incorrectly formatted (e.g., 38/10 instead of 3.8/10)
    const totalScore = evaluation.evaluations.reduce((sum, evaluationItem) => {
      let score = evaluationItem.totalScore || 0;
      const scoreBase = evaluationItem.scoreBase || 10;
      
      // If score is greater than scoreBase, it's likely incorrectly formatted
      // Convert it to the proper scale (e.g., 38/10 becomes 3.8/10)
      if (score > scoreBase) {
        score = score / 10;
      }
      
      // Convert to percentage (e.g., 3.8/10 = 38%)
      const percentage = (score / scoreBase) * 100;
      return sum + percentage;
    }, 0) / evaluation.evaluations.length;

    Logger.info("📊 Updating application with immediate evaluation results", {
      applicationId: application._id,
      totalScore: Math.round(totalScore),
      evaluationCount: evaluation.evaluations.length,
      hasSummary: !!evaluation.evaluationSummary,
    });

    // Update application with detailed evaluations
    await Application.findByIdAndUpdate(application._id, {
      evaluations: evaluation.evaluations,
      evaluationSummary: evaluation.evaluationSummary || "",
      totalEvaluationScore: Math.round(totalScore),
      updatedAt: new Date()
    });

    Logger.success("🎉 Immediate candidate evaluation completed", {
      applicationId: application._id,
      finalScore: Math.round(totalScore),
      evaluationCategories: evaluation.evaluations.map(e => e.name),
    });
  } catch (error) {
    Logger.error("❌ Error in immediate candidate evaluation", error);
    throw error;
  }
}

async function evaluateCandidate(chat) {
  try {
    Logger.info("📊 Starting comprehensive candidate evaluation", {
      chatId: chat._id,
      messageCount: chat.messages.length,
      model:
        process.env.OPENROUTER_EVAL_MODEL || "meta-llama/llama-4-maverick:free",
    });

    // Get vacancy and resume data for comprehensive evaluation
    const vacancy = await Vacancy.findById(chat.vacancy);
    const resume = await Resume.findById(chat.resume);

    if (!vacancy || !resume) {
      Logger.error("❌ Missing vacancy or resume data for evaluation", {
        chatId: chat._id,
        vacancyId: chat.vacancy,
        resumeId: chat.resume
      });
      throw new Error("Missing vacancy or resume data for evaluation");
    }

    const response = await axios.post(
      process.env.OPENROUTER_API_URL ||
        "https://openrouter.ai/api/v1/chat/completions",
      {
        model:
          process.env.OPENROUTER_EVAL_MODEL ||
          "meta-llama/llama-4-maverick:free",
        messages: [
          {
            role: "system",
            content: EVALUATION_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: EVALUATION_USER_PROMPT(chat.messages, vacancy, resume),
          },
        ],
        temperature: parseFloat(
          process.env.OPENROUTER_EVAL_TEMPERATURE || "0.3"
        ),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.SITE_URL,
          "X-Title": "Candidate Evaluation",
        },
      }
    );

    Logger.debug("🔍 Full AI response received", {
      chatId: chat._id,
      response: JSON.stringify(response.data, null, 2)
    });

    const evaluationResponse = response.data.choices[0].message.content;

    Logger.success("✅ Evaluation response received", {
      chatId: chat._id,
      responseLength: evaluationResponse ? evaluationResponse.length : 0,
      usage: response.data.usage,
    });

    if (!evaluationResponse || !evaluationResponse.trim()) {
      Logger.error("❌ Evaluation response is empty", { chatId: chat._id });
      throw new Error("AI evaluation returned empty response");
    }

    let evaluation;
    try {
      // Try to parse as JSON first
      evaluation = JSON.parse(evaluationResponse);
    } catch (jsonError) {
      Logger.warn("⚠️ Response is not valid JSON, attempting to extract data", {
        chatId: chat._id,
        responsePreview: evaluationResponse.substring(0, 200)
      });
      
      // Fallback: try to extract score and feedback from markdown/text response
      evaluation = extractEvaluationFromText(evaluationResponse);
    }

    // Validate the new evaluation structure
    if (!evaluation || !evaluation.evaluations || !Array.isArray(evaluation.evaluations)) {
      Logger.error("❌ Invalid evaluation format", { 
        chatId: chat._id, 
        evaluation: evaluation 
      });
      throw new Error("AI evaluation returned invalid format");
    }

    // Calculate total evaluation score from all evaluations
    // Handle scores that might be incorrectly formatted (e.g., 38/10 instead of 3.8/10)
    const totalScore = evaluation.evaluations.reduce((sum, evaluationItem) => {
      let score = evaluationItem.totalScore || 0;
      const scoreBase = evaluationItem.scoreBase || 10;
      
      // If score is greater than scoreBase, it's likely incorrectly formatted
      // Convert it to the proper scale (e.g., 38/10 becomes 3.8/10)
      if (score > scoreBase) {
        score = score / 10;
      }
      
      // Convert to percentage (e.g., 3.8/10 = 38%)
      const percentage = (score / scoreBase) * 100;
      return sum + percentage;
    }, 0) / evaluation.evaluations.length;

    Logger.info("📊 Updating chat and application with comprehensive evaluation results", {
      chatId: chat._id,
      totalScore: Math.round(totalScore),
      evaluationCount: evaluation.evaluations.length,
      hasSummary: !!evaluation.evaluationSummary,
    });

    chat.status = "ai-reviewed";
    chat.score = Math.round(totalScore);
    chat.feedback = evaluation.evaluationSummary || "Comprehensive evaluation completed";

    // Update application with detailed evaluations
    if (chat.application) {
      await Application.findByIdAndUpdate(chat.application, {
        status: "ai-reviewed",
        evaluations: evaluation.evaluations,
        evaluationSummary: evaluation.evaluationSummary || "",
        totalEvaluationScore: Math.round(totalScore),
        updatedAt: new Date()
      });
    }

    Logger.debug("💾 Saving evaluation results to database", {
      chatId: chat._id,
    });
    await chat.save();

    Logger.success("🎉 Comprehensive candidate evaluation completed", {
      chatId: chat._id,
      finalScore: Math.round(totalScore),
      status: "ai-reviewed",
      evaluationCategories: evaluation.evaluations.map(e => e.name),
    });
  } catch (error) {
    Logger.error("❌ Error evaluating candidate", error);
    throw error;
  }
}

// Export the new function
export { evaluateCandidateImmediately };
