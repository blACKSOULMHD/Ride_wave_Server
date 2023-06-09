require("dotenv").config();
const bcrypt = require("bcrypt");
const cloudinary = require("../../utils/Cloudinary");
const user = require("../../models/user");
const Car = require('../../models/car')
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { fname, password, cpassword, email, license } = req.body;
    const findUser = await user.findOne({ email: email });

    console.log(findUser, "this find user");
    if (findUser && findUser.isDriver) {
      console.log("user allredy ");
      return res.json({ message: "email is all ready registred" });
    }

    if (password && cpassword) {
      const hashedpassword = await bcrypt.hash(password, 10);

      const hashedconfirmpassword = await bcrypt.hash(cpassword, 10);
      console.log("this password checking");
      const file = await cloudinary.uploader.upload(license, {
        folder: "DriverLicense",
      });
      await user
        .create({
          name: fname,
          email: email,
          password: hashedpassword,
          confirm_password: hashedconfirmpassword,
          license: file.secure_url,
          isDriver: true,
          DriverStatus: true,
        })
        .then(() => {
          res.status(200).json({ message: "new account created sucessfully" });
        })
        .catch((error) => {
          console.log(error.message, "server erro");
          res.json({ message: "something wrong" });
        });
    }
  } catch (error) {
    console.log(error.message, "this server error");
    res.status(500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
  
    const findDriver = await user.findOne({ email: email ,isDriver:true });
    if (!findDriver) return res.json({ status: "User doesn't exist" });
    const isPasswordCorrect = await bcrypt.compare(password, findDriver.password);
    console.log(isPasswordCorrect, "password");
    if (!isPasswordCorrect) {
      return res.json({ status: "incorrect password" });
    }
    console.log(findDriver, "find driver ");
    if (findDriver.isverify === true && isPasswordCorrect) {
      if (findDriver.DriverStatus) {
        const toke = jwt.sign(
          { id: findDriver._id, role: "driver" },
          "ClientTokenSecret",
          { expiresIn: "5h" }
        );
        res.status(200).json({ token: toke, driver: findDriver, status: "Login success" });
      }else{
        res.status(200).json({status:'this id is blocked'});
      }
      
      }else{
      res.status(200).json({status:'it may take 24 houres to verify driver'})
      }
    }catch (error){
    console.log(error.message);
    res.json({status:'something wrong'})
    }
     
    };
    const carRegister = async (req,res)=>{
    try {
      const { model, year,RegistrationNumber,Seats,Features,Carimage,Rate} = req.body
      
      const findcar = await Car.findOne({RegistrationNumber:RegistrationNumber})
         if(!findcar){
          const file = await cloudinary.uploader.upload(Carimage, {
            folder: "carImage",
          });
          const car = await Car.create({
            model:model,
            year:year,
            RegistrationNumber:RegistrationNumber,
            Seats:Seats,
            Features:Features,
            Rate:Rate,
            carimage:file.secure_url
          })
          console.log(car,'this is your car');
          res.status(200).json({message:'it  may take 24 houres to verify your car'})
         }else{
          res.status(200).json({message:'Registration number allready exists'})
         }
     
    } catch (error) {
      res.status(500).json({message:'something  wrong'})
      console.log(error.message,);
    }
    }

module.exports = {
  signup,
  login,
  carRegister
};
