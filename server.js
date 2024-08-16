// const { createServer } = require('http');
// const next = require('next');
// const socketIo = require('socket.io');
// const connectMongo = require('./lib/mongodb');
// const Notification = require('./src/models/Notification');
// const User = require('./src/models/User');
// const ChatMessage = require('./src/models/ChatMessage');  // Correct import

// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//     const server = createServer((req, res) => {
//         handle(req, res);
//     });

//     const io = socketIo(server); // Initialize Socket.IO here
//     global.io = io; // Make io globally accessible

//     connectMongo();  // Ensure MongoDB is connected

//     io.on('connection', (socket) => {
//         console.log('New client connected:', socket.id);

//         socket.on('sendFriendRequest', async ({ sender, receiver }) => {
//             console.log('sendFriendRequest event received:', { sender, receiver });

//             // Emit the real-time notification to the receiver
//             console.log(`Emitting notification to receiver: ${receiver}`);
//             io.to(receiver).emit('receiveNotification', {
//                 type: 'friendRequest',
//                 message: `${sender.username} sent you a friend request`,
//                 senderId: sender._id,
//                 receiverId: receiver,
//             });
//         });

//         socket.on('acceptFriendRequest', async ({ requestId, receiver }) => {
//             console.log('acceptFriendRequest event received:', { requestId, receiver });

//             try {
//                 // Fetch sender details from Notification
//                 const notification = await Notification.findById(requestId).populate('senderId');
//                 if (notification) {
//                     const senderId = notification.senderId._id;
//                     const senderName = notification.senderId.username;
                    
//                     console.log(`Emitting friend request accepted notification to sender: ${senderId}`);
//                     io.to(senderId.toString()).emit('receiveNotification', {
//                         type: 'friendRequestAccepted',
//                         message: `${receiver.username} accepted your friend request.`,
//                         senderId: receiver._id,
//                         receiverId: senderId,
//                         requestId: notification._id,
//                     });
//                 }
//             } catch (error) {
//                 console.error('Error handling acceptFriendRequest:', error);
//             }
//         });

//         socket.on('declineFriendRequest', async ({ requestId, receiver }) => {
//             console.log('declineFriendRequest event received:', { requestId, receiver });

//             try {
//                 // Fetch sender details from Notification
//                 const notification = await Notification.findById(requestId).populate('senderId');
//                 if (notification) {
//                     const senderId = notification.senderId._id;
//                     const senderName = notification.senderId.username;
                    
//                     console.log(`Emitting friend request declined notification to sender: ${senderId}`);
//                     io.to(senderId.toString()).emit('receiveNotification', {
//                         type: 'friendRequestDeclined',
//                         message: `${receiver.username} declined your friend request.`,
//                         senderId: receiver._id,
//                         receiverId: senderId,
//                         requestId: notification._id,
//                     });
//                 }
//             } catch (error) {
//                 console.error('Error handling declineFriendRequest:', error);
//             }
//         });

//         socket.on('sendMessage', async (messageData) => {
//             const { sender, receiver, message, timestamp } = messageData;
          
//             try {
//               // Save the message to the database
//               const chatMessage = new ChatMessage({ sender, receiver, message, timestamp });
//               await chatMessage.save();
          
//               // Emit the message to both sender and receiver
//               socket.to(receiver).emit('receiveMessage', messageData);
              
//               // Emit the message back to the sender
//               socket.emit('receiveMessage', messageData); 
          
//               console.log('Message saved and broadcasted:', messageData);
//             } catch (error) {
//               console.error('Error handling sendMessage event:', error);
//             }
//           });
          
          

//         socket.on('disconnect', () => {
//             console.log('Client disconnected:', socket.id);
//         });
//     });

//     server.listen(3000, (err) => {
//         if (err) throw err;
//         console.log('> Ready on http://localhost:3000');
//     });
// });



//for host
const { createServer } = require('http');
const next = require('next');
const socketIo = require('socket.io');
const connectMongo = require('./lib/mongodb');
const Notification = require('./src/models/Notification');
const User = require('./src/models/User');
const ChatMessage = require('./src/models/ChatMessage');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000; // Use environment variable for port or fallback to 3000

app.prepare().then(() => {
    const server = createServer((req, res) => {
        handle(req, res);
    });

    const io = socketIo(server, {
        cors: {
            origin: process.env.NODE_ENV !== 'production' ? '*' : process.env.ALLOWED_ORIGIN,
            methods: ['GET', 'POST'],
            allowedHeaders: ['Authorization'],
            credentials: true
        }
    });
    

    global.io = io; // Make io globally accessible

    connectMongo();  // Ensure MongoDB is connected

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Handling different socket events
        socket.on('sendFriendRequest', async ({ sender, receiver }) => {
            console.log('sendFriendRequest event received:', { sender, receiver });

            // Emit the real-time notification to the receiver
            console.log(`Emitting notification to receiver: ${receiver}`);
            io.to(receiver).emit('receiveNotification', {
                type: 'friendRequest',
                message: `${sender.username} sent you a friend request`,
                senderId: sender._id,
                receiverId: receiver,
            });
        });

        socket.on('acceptFriendRequest', async ({ requestId, receiver }) => {
            console.log('acceptFriendRequest event received:', { requestId, receiver });

            try {
                const notification = await Notification.findById(requestId).populate('senderId');
                if (notification) {
                    const senderId = notification.senderId._id;
                    const senderName = notification.senderId.username;
                    
                    console.log(`Emitting friend request accepted notification to sender: ${senderId}`);
                    io.to(senderId.toString()).emit('receiveNotification', {
                        type: 'friendRequestAccepted',
                        message: `${receiver.username} accepted your friend request.`,
                        senderId: receiver._id,
                        receiverId: senderId,
                        requestId: notification._id,
                    });
                }
            } catch (error) {
                console.error('Error handling acceptFriendRequest:', error);
            }
        });

        socket.on('declineFriendRequest', async ({ requestId, receiver }) => {
            console.log('declineFriendRequest event received:', { requestId, receiver });

            try {
                const notification = await Notification.findById(requestId).populate('senderId');
                if (notification) {
                    const senderId = notification.senderId._id;
                    const senderName = notification.senderId.username;
                    
                    console.log(`Emitting friend request declined notification to sender: ${senderId}`);
                    io.to(senderId.toString()).emit('receiveNotification', {
                        type: 'friendRequestDeclined',
                        message: `${receiver.username} declined your friend request.`,
                        senderId: receiver._id,
                        receiverId: senderId,
                        requestId: notification._id,
                    });
                }
            } catch (error) {
                console.error('Error handling declineFriendRequest:', error);
            }
        });

        socket.on('sendMessage', async (messageData) => {
            const { sender, receiver, message, timestamp } = messageData;
          
            try {
                const chatMessage = new ChatMessage({ sender, receiver, message, timestamp });
                await chatMessage.save();
          
                socket.to(receiver).emit('receiveMessage', messageData);
                socket.emit('receiveMessage', messageData); 
          
                console.log('Message saved and broadcasted:', messageData);
            } catch (error) {
                console.error('Error handling sendMessage event:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
