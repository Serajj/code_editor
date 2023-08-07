// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const config = require('./config');
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/question');
const editorRoutes = require('./routes/editor');
const chatRoutes = require('./routes/chat');


const cors = require('cors');
const authMiddleware = require('./middlewares/authMiddleware');
const ChatMessage = require('./models/chatMessage');

const app = express();
 
const server = http.createServer(app);
const io = socketIo(server);

//cors
app.use(cors());
//for socket
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json()); // Add this line to parse incoming JSON data

// Connect to MongoDB
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Socket.io event handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Event: User joins a group
  socket.on('joinGroup', (data) => {
    const { groupId, username } = data;

    // Store user's group info in the array
    users.push({ socketId: socket.id, groupId, username });

    // Join the Socket.io room corresponding to the group
    socket.join(groupId);

    // Broadcast to all users in the group that a new user has joined
    socket.to(groupId).emit('userJoined', { username });
  });

  //join room event
  socket.on('joinRoom',(data) => {
    console.log("Is this room ID");
    console.log(data.roomId);
    // Join the Socket.io room corresponding to the user
    socket.join(data.roomId);
  });

  // Event: User sends a message
  socket.on('sendMessage', async (data) => {
    const { user, message , roomId , timestamp } = data.data;
    console.log("message recieved");
    console.log(timestamp + " " + message);

    // Create the new message object
    const newMessage = {
      user: user,
      message: message,
      media: '',
      timestamp
    };
    const chatRoom = await ChatMessage.findOne({ roomId });
    messageData = {}
    if (!chatRoom) {
      console.log(`Chat room with roomId ${roomId} not found.`);
      socket.emit('newMessage', {status:false ,message : "Room Id not found" , newMessage});
      return;
    }

     // Add the new message to the messages array of the chat room
     chatRoom.messages.push(newMessage);

     // Save the updated chat room with the new message
     const updatedChatRoom = await chatRoom.save();

    // Broadcast the message to all users in the group
    io.to(roomId).emit('newMessage', {status:true ,message : "New message received" , newMessage});
  });

  // Event: User disconnects
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    
  });
});

// Routes
app.use('/api/auth', authRoutes);
// editor
app.use('/api/editor',editorRoutes );
//authenticated routes
app.use('/api/questions',authMiddleware,questionRoutes);

//authenticated routes chat
app.use('/api/chat',authMiddleware,chatRoutes);


app.get('/', (req,res)=>{
    res.send("Welcome to the server...");
});
// Start the server
server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
