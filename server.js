import express from "express";
import cors from "cors";
import { URLSearchParams } from "url";
import dotenv from "dotenv";
import helmet from "helmet";

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

app.post("/", async (req, res) => {
  console.log(req.get("origin"));
  if (req.body === undefined) {
    res.send("error");
  } else {
    const data = req.body;
    const formdata = new URLSearchParams();
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

app.listen(process.env.PORT, () => {
  console.log(
    `[server]: Server is running at http://localhost:${process.env.PORT}`
  );
});
