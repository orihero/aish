import axios from "axios";
import { Chat } from "../models/chat.model.js";
import { Logger } from "../utils/logger.js";
import {
  SCREENING_SYSTEM_PROMPT,
  SCREENING_INITIAL_PROMPT,
  SCREENING_FALLBACK_MESSAGE,
  SCREENING_COMPLETION_MESSAGE,
  SCREENING_PARTIAL_RESPONSE_PROMPT,
  EVALUATION_SYSTEM_PROMPT,
  EVALUATION_USER_PROMPT,
  EVALUATION_ERROR_FALLBACK
} from "../prompts/index.js";

export async function startScreeningChat(application, vacancy, resume) {
  try {
    Logger.info("💬 Starting screening chat", {
      applicationId: application._id,
      vacancyId: vacancy._id,
      candidateId: application.user,
      vacancyTitle: vacancy.title,
    });

    // Create initial chat with just the system message
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

async function evaluateCandidate(chat) {
  try {
    Logger.info("📊 Starting candidate evaluation", {
      chatId: chat._id,
      messageCount: chat.messages.length,
      model:
        process.env.OPENROUTER_EVAL_MODEL || "meta-llama/llama-4-maverick:free",
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
            content: EVALUATION_USER_PROMPT(chat.messages),
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

    // Validate the evaluation object
    if (!evaluation || typeof evaluation.score !== 'number' || typeof evaluation.feedback !== 'string') {
      Logger.error("❌ Invalid evaluation format", { 
        chatId: chat._id, 
        evaluation: evaluation 
      });
      throw new Error("AI evaluation returned invalid format");
    }

    Logger.info("📊 Updating chat with evaluation results", {
      chatId: chat._id,
      score: evaluation.score,
      hasFeedback: !!evaluation.feedback,
    });

    chat.status = "completed";
    chat.score = evaluation.score;
    chat.feedback = evaluation.feedback;

    Logger.debug("💾 Saving evaluation results to database", {
      chatId: chat._id,
    });
    await chat.save();

    Logger.success("🎉 Candidate evaluation completed", {
      chatId: chat._id,
      finalScore: evaluation.score,
      status: "completed",
    });
  } catch (error) {
    Logger.error("❌ Error evaluating candidate", error);
    throw error;
  }
}
