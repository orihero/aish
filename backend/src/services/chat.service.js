import axios from "axios";
import { Chat } from "../models/chat.model.js";
import { Logger } from "../utils/logger.js";

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
          content: `You are an AI recruiter conducting an initial screening interview. 
          Your task is to assess the candidate's fit for the position based on their resume and the job requirements.
          Ask one question at a time and wait for the candidate's response.
          Focus on technical skills, experience, and behavioral questions relevant to the role.`,
        },
        {
          role: "user",
          content: `Please start the screening interview for this position:
          Job Title: ${vacancy.title}
          Job Description: ${vacancy.description}
          
          Candidate Resume:
          ${JSON.stringify(resume.parsedData, null, 2)}`,
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
        content:
          "Hello! I'm ready to start your screening interview. Please tell me a bit about yourself and your experience.",
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

    // Check if screening should end
    if (chat.messages.length >= 10) {
      // After 5 exchanges
      Logger.info("🏁 Chat reached maximum messages, starting evaluation", {
        chatId,
        totalMessages: chat.messages.length,
      });
      await evaluateCandidate(chat);
    }

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
            content:
              "You are an AI recruiter evaluating a candidate based on their interview responses. Provide a score from 0-100 and detailed feedback.",
          },
          {
            role: "user",
            content: `Please evaluate this interview transcript and provide a score and feedback:
          ${JSON.stringify(chat.messages, null, 2)}`,
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

    console.log(JSON.stringify(response.data, null, 2));

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

    const evaluation = JSON.parse(evaluationResponse);

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
