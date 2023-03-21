const express = require("express");
const path = require("path");
const app = express();
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const Sib = require('sib-api-v3-sdk');
require('dotenv').config();
const client = Sib.ApiClient.instance ;

const PORT = 5000;
const bookMark = [];
let click = false;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home", {body: req.body, click});
});
app.get("/bookmark", (req, res) => {
  res.render("bookmark", { bookmark: bookMark });
});

//Sendinblue setup
const apiKey = client.authentications['api-key'] ;
apiKey.apiKey = process.env.API_KEY ;


app.post("/", async (req, res) => {
  try {
    const { fromEmail, name, toEmail, subject, body, attachment } = req.body;
    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
      email: fromEmail,
      name: name,
    }

    const receivers = [
      {
          email: toEmail,
      },
  ]

    tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: subject,
        textContent: body,
        params: {
            role: 'Frontend',
        },
    })
    .then(console.log)
    .catch(console.log)

    bookMark.push(req.body);
    res.render("home", { body: req.body, click });
  } catch (error) {
    throw new Error(error);
  }
});



app.listen(PORT, () => {
  console.log(`app is working on port: ${PORT}`);
});
