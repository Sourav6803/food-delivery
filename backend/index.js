
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt') ;

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 7000;

//mongodb connection
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connect to Databse"))
  .catch((err) => console.log(err));

//schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
  refreshToken: String,
});

//
const userModel = mongoose.model("user", userSchema);

//api
app.get("/", (req, res) => {
  res.send("Server is running");
});

//sign up
app.post("/signup", async (req, res) => {
  
  

  // userModel.findOne({ email: email }, (err, result) => {
  //   console.log(result);
  //   console.log(err);
  //   if (result) {
  //     res.send({ message: "Email id is already register", alert: false });
  //   } else {
  //     const data = userModel(req.body);
  //     const save = data.save();
  //     res.send({ message: "Successfully sign up", alert: true , save});
  //   }
  // });
  const data = req.body
    const { firstName , lastName, password, confirmPassword, email , image } = data;
    const checkedUser = await userModel.findOne({ email: email })
    if (checkedUser) return res.status(409).send({ status: false, message: "Email already exist" })
    const usedEmail = await userModel.findOne({ email: email })
    if (usedEmail) return res.status(409).send({ status: false, message: "emailId is already used" })
    const bcryptPassword = await bcrypt.hash(password, 10)
    data.password = bcryptPassword

    let user = await userModel.create(data)
    return res.status(201).send({ status: true, message: "User Register successfully", data: user })
});

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value != "string") return false;
  return true;
};

//api login
app.post("/login", async(req, res) => {
  try {
    let { email, password } = req.body;

    // if (!isValid(email) || !isValid(password))
    // return res.status(400).send({ status: false, msg: "Provide emailId and Password both" });
    // if (!isValid(email)) return res.status(400).send({ status: false, message: "please enter email in string format" })
    // if (!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email)) return res.status(400).send({ status: false, message: "please enter valid email" })

    // if (!isValid(password)) return res.status(400).send({ status: false, message: "please enter password in string format" })
    // if (!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/.test(password)) return res.status(400).send({ status: false, message: "invalid password" })


    let myUser = await userModel.findOne({ email: email });
    if (!myUser) return res.status(400).send({ status: false, message: "userid is not present in db" });

    const generateRefreshToken = (id) => {
        return jwt.sign({ id }, "sourav", { expiresIn: "3d" })
    }

    const refreshToken = await generateRefreshToken(myUser._id)

    const updateUser = await userModel.findByIdAndUpdate(myUser.id, { refreshToken: refreshToken }, { new: true })
    // console.log(updateUser)
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000
    })

    bcrypt.compare(password, myUser.password, function (err, result) {
        if (result) {
            let token = jwt.sign({
                userId: myUser._id.toString(),
                username: myUser.firstName
            }, "sourav",
                {
                    expiresIn: "10d"
                });

            return res.status(200).send({ message: " Login succesfully...",  data:myUser, alert: true, })
        }
        return res.status(400).send({ status: false, message: "wrong password" })

    });
} catch (err) {
    return res.status(500).send({ status: false, message: err.message })
}
});

//product section

const schemaProduct = mongoose.Schema({
  name: String,
  category:String,
  image: String,
  price: String,
  description: String,
});
const productModel = mongoose.model("product",schemaProduct)



//save product in data 
//api
app.post("/uploadProduct",async(req,res)=>{
    // console.log(req.body)
    // const data = await productModel(req.body)
    // const datasave = await data.save()
    // console.log(datasave)
    // res.send({message : "Upload successfully"})
    const data = req.body
    const product = await productModel.create(data)
    res.status(201).send({message:"Upload succesfully", data: product})
})

//
app.get("/product",async(req,res)=>{
  const data = await productModel.find()
  res.send(JSON.stringify(data))
})



//server is ruuning
app.listen(PORT, () => console.log("server is running at port : " + PORT));


