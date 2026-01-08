import express from "express";
import isAuth from "../middleware/isauth.js";
import {
  chatWithAssistant,
  getChatHistory,
  clearChatHistory,
} from "../contollers/aiAssistantController.js";

const chatRouter = express.Router();

// Route for sending message to AI assistant
chatRouter.post("/send", isAuth, chatWithAssistant);

// Route for getting chat history
chatRouter.get("/history", isAuth, getChatHistory);

// Route for clearing chat history
chatRouter.delete("/clear", isAuth, clearChatHistory);

export default chatRouter;
