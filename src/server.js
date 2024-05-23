const app = require("./app");
const connectDatabase = require("./config/database");
const { serverPort } = require("./secret");


app.listen(serverPort, async () => {
    console.log(`server is running at http://localhost:${serverPort}`);
    await connectDatabase();
});
