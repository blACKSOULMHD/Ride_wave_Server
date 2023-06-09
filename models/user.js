
const mongoose =  require('mongoose')
const moment = require("moment");

const addressSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true],
        
      },
    email: {
      type: String,
      required: [true],
      unique: true,
    },
    password: {
      type: String,
      required: [true],
      
    },
    confirm_password: {
      type: String,
      required: [true],
      
    },
    status: {
      type: Boolean,
      default:true
    },
   license:{
    type:String
   },
  isverify:{
    type: String,
    default:'not verified'
  },
  EmailToken:{
    type: String,
    
  },
  isAdmin:{
    type:Boolean,
    default:false
  },
  isDriver:{
    type:Boolean,
    default:false
    
  },
  DriverStatus:{
    type:Boolean,
   
  },
  isUser:{
    type:Boolean,
    default:false
    
  },
  userVerify:{
    type:Boolean,
    default:false,
  },
  carId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'car'
  },


updated:{ type: Date, default: moment(Date.now()).format("DD MMM YYYY")},
created:{ type: Date, default: moment(Date.now()).format("DD MMM YYYY")}
})

const user = mongoose.model("user",addressSchema)
module.exports = user