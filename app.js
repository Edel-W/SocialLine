const express = require("express");
const app = express();
const PORT = 3000;


const userRouter = require("./routes/users");
const commentRouter = require("./routes/comments");

app.use(express.json());

app.use("/user", userRouter);
app.use("/comments", commentRouter);

app.listen(PORT, () => {
    console.log(`Server has started on PORT: {PORT}`); 
});