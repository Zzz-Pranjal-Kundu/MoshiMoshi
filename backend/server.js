const express = require("express");
const dotenv = require("dotenv");
const { chats } =require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); //accept the data from the frontend i.e. JSON

app.get('/',(req,res)=>{
    res.send("API RUNNING");
});
app.get("/api/chat",(req,res)=>{
    res.send(chats);
});
app.get('/api/chat/:id',(req,res)=>{
    // console.log(req.params.id);
    const singleChat=chats.find(c=>c._id === req.params.id);
    res.send(singleChat);
});
app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000
const server = app.listen(PORT,()=>console.log(`Server started on port ${PORT}`));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log('connected to socket.io');

    // a new socket where the frontned will send some data and will join a room
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        // console.log(userData._id);
        socket.emit("connected");
    });

    // when any  of the chats is selected, a room should be created iwth the other user
    socket.on("joinChat", (room) => {
        socket.join(room);
        console.log('User joined room ' + room);
        // socket.emit("connected");
    });

    socket.on('typing', (room) => socket.in(room).emit("typing"));
    socket.on('stop typing', (room) => socket.in(room).emit("stop typing"));


    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if(!chat.users){
            return console.log("chat.users not defined");
        }
        
        chat.users.forEach(user=> {
            if(user._id == newMessageRecieved.sender._id)
                return;
            socket.in(user._id).emit('message recieved', newMessageRecieved);
        })
    });

    // clean up the csocket after finishing since it consumes a lot of bandwidth otherwise.
    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });

});