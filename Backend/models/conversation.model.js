import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.Mixed, // ✅ Allows ObjectId or String like "gemini-bot"
        required: true,
        refPath: "participantModel",
      },
    ],
    participantModel: [
      {
        type: String,
        required: true,
        enum: ["User", "Bot"], // ✅ Allow distinguishing between user and bot
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
