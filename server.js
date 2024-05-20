import express from "express";
import cors from "cors";
import { URLSearchParams } from "url";
import dotenv from "dotenv";
import helmet from "helmet";
import os from "os";

const app = express();
const customCors = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(" ");
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Request from unauthorized origin"));
    }
  },
};

app.use(helmet());
app.use(express.json());
app.use(cors(customCors));
dotenv.config();
app.use(express.urlencoded({ extended: false }));

async function postData(url = "", formdata) {
  try {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",

      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formdata.toString(),
    });
    if (response.ok) {
      console.log("success");
    } else {
      console.log("error");
    }
  } catch (error) {
    console.log(error);
  }
}
// app.get("/", (req, res) => {
//   const date = new Date();
//   res.send(date.toLocaleDateString("ru-RU"));
// });
app.post("/", async (req, res) => {
  const date = new Date();
  console.log(req.get("origin"));
  if (req.body === undefined) {
    res.send("error");
  } else {
    const data = req.body;
    const formdata = new URLSearchParams();
    formdata.append("Date", date.toLocaleDateString("ru-RU"));
    formdata.append("Time", date.toLocaleTimeString());
    formdata.append("Email", data.Email);
    formdata.append("Name", data.Name);
    formdata.append("Phone", data.Phone);
    formdata.append("step1", data.step1);
    formdata.append("step2", data.step2);
    formdata.append("step3", data.step3);
    formdata.append("step4", data.step4);

    let url = process.env.URL;
    postData(url, formdata);
  }
  res.send("success");
});

function getIPAddress() {
  let interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];

    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      )
        return alias.address;
    }
  }
  return "0.0.0.0";
}

const address = getIPAddress();

app.listen(process.env.PORT, () => {
  console.log(
    `[server]: Server is running at ${address} port ${process.env.PORT}`
  );
});
