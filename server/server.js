const express=require('express');
const dbconfig=require("./config/dbconfig")
const app=express();
const cors = require('cors');
app.use(cors());
require("dotenv").config();
const bodyparser=require('body-parser');
app.use(bodyparser.json());
app.use(express.json());

const port=process.env.PORT || 3001;
const userRoute=require("./routes/usersRoute")
const projectRoute=require("./routes/projectRoute")
const taskRoute=require('./routes/tasksRoute');
const notificationsRoute=require('./routes/notificationsRoute')
app.use("/api/users",userRoute);
app.use("/api/projects",projectRoute);
app.use("/api/tasks",taskRoute);
app.use("/api/notifications",notificationsRoute)
// deployment config
const path = require("path");
__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port,()=>{
    console.log(`Node server listenin on port ${port}`);
});
