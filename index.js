import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "Swordfish@1984",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  try{
  const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  if (checkResult.rows.length > 0){
    res.send("Email already exist");
  }else{
    result = await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, password]);
  };  
  console.log(result.rows);
  res.render(secrets.ejs);
}catch (err){
  console.log(err);
};
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  console.log(email);
  try{
    const checkEmail = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const response = checkEmail.rows[0];
  if (checkEmail.rows.length > 0){
    /*let storedEmail = response[0].email;*/
    let storedPassword = response.password;
    if (password === storedPassword){
      res.render("secrets.ejs")
    }else {
      res.send("Password is incorrect, Try again")
    }
  }else {
    res.send("Email does not exist, Try registering your email")
  }
} catch (err){
  console.log(err);
};
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
