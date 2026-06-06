const dotenv = require('dotenv').config();
const express = require("express");
const app = express();
const PORT = 3000;

const userRouter = require("./routes/users");
const postRouter = require("./routes/post");       
const commentRouter = require("./routes/comments");
const likeRouter = require("./routes/likes");      
const followRouter = require("./routes/follow");  
const messageRouter = require("./routes/message"); // Ensure your file in the routes folder is exactly named 'message.js'
const searchRouter = require("./routes/search");
const adminRouter = require("./routes/admin");

app.use(express.json());

app.use("/user", userRouter);
app.use("/posts", postRouter);      
app.use("/comments", commentRouter);
app.use("/likes", likeRouter);       
app.use("/follows", followRouter);   

app.use("/messages", messageRouter);
app.use("/search", searchRouter);
app.use("/admin", adminRouter);

// Start server
app.listen(PORT, () => {
    console.log(`Server has started on PORT: ${PORT}`); 
});