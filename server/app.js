const express = require('express');
const dotenv = require('dotenv');
const  cors = require('cors');
const path = require('path');

dotenv.config();
const bodyParser = require('body-parser');

const Router4 = require("./routers/employeRouter");
const Router2 = require("./routers/organizationRoutes");
const Router3 = require("./routers/dashboardRoutes");
const Router = require("./routers/userdataroutes")

const app = express();

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use('/api', Router3);
app.use("/api", Router2);
app.use("/api", Router4);
app.use('/api', Router);
app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/Assets', express.static(path.join(__dirname, 'Assets')));




const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
