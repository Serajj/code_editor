
const express = require("express");
const ChatMessage = require("../models/chatMessage");
const router = express.Router();


//startroom

router.post("/startroom" , async (req, res) => {
    const {roomId} = req.body;
    if(roomId === null || roomId === '' || roomId === undefined){
        return res.status(400).json({status:false,message:"Room id required"});
    }
      // List of participants (user IDs) in the chat room
    
      try {
        // Check if a chat room exists with both users where isGroup is false
        const chatRoom = await ChatMessage.findOne({
            roomId
        });
    
        if (chatRoom) {
          console.log('Both users exist in the same private chat room.');
          return res.status(200).json({status : true , message:"Found chat" ,chatData:chatRoom});
        } else {
         
          return res.status(400).json({status : false , message:"Invalid room id" ,chatData:[]});
        }
      } catch (error) {
        console.error('Error checking chat room:', error);
        return res.status(400).json({status : false , message:"Something went wrong" ,error});
      }
    });
    


// CREATE a new question (admin access only)
router.post("/start" , async (req, res) => {
const {receiverIds} = req.body;
if(receiverIds === null || receiverIds.length === 0){
    return res.status(400).json({status:false,message:"Receiver id required"});
}
const currenUserId = req.user.userId;
const addedId = receiverIds.join('') + currenUserId;
//convert to array
const idsCharArray = addedId.split('');
// Sort the array of characters
idsCharArray.sort();
// Join the characters back to form the sorted string
const roomId = idsCharArray.join('');

const messages = [];

  // List of participants (user IDs) in the chat room
  const participants = [...receiverIds, currenUserId];

  try {
    // Check if a chat room exists with both users where isGroup is false
    const chatRoom = await ChatMessage.findOne({
      isGroup: participants.length > 2,
      participants: { $all: participants },
    });

    if (chatRoom) {
      console.log('Both users exist in the same private chat room.');
      return res.status(200).json({status : true , message:"Found existing chat" ,chatData:chatRoom});
    } else {
      console.log('Both users do not exist in the same private chat room.');
      const newChatRoom = await ChatMessage.create({
        title: participants.length > 2 ? 'Group': '',
        description: '',
        roomId: roomId, // Make sure it's unique
        isGroup: participants.length > 2,
        participants: participants,
        messages: messages,
      });

      return res.status(200).json({status : true , message:"Created a new chat" ,chatData:newChatRoom});
    }
  } catch (error) {
    console.error('Error checking chat room:', error);
    return res.status(400).json({status : false , message:"Something went wrong" ,error});
  }
});

router.post("/chats" , async (req, res) => {
    const userId = req.user.userId;
    try {
        // Fetch chat rooms where the user is a participant
        const chatRooms = await ChatMessage.find({
          participants: userId,
        }).populate('participants', 'name email'); // Populate participants details from User model
    
        console.log('Chat rooms where the user is a participant:');
        console.log(chatRooms.length);
    
       return res.status(200).json({status:true,message:"Chats fetched successfully!!",chats:chatRooms});
      } catch (error) {
        console.error('Error fetching chat records:', error);
        return res.status(400).json({status:false,message:"Something error",error});
      }
});

module.exports = router;
