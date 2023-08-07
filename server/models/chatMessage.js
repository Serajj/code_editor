const mongoose = require('mongoose');



const messagesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true 
  },
  message: { type: String, required: true },
  media: { type: String},
  timestamp: { type: Date, default: Date.now },
});


const chatMessageSchema = new mongoose.Schema(
  {
    title : { type: String, default: "" },
    description : { type: String, default: "" },
    roomId : { type: String, required: true },
    isGroup :  { type: Boolean, default:false },
    participants: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true 
    }],
    messages: [messagesSchema],
  },
  { timestamps: true }
);

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
