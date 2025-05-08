const express= require("express");
const mongoose= require("mongoose");
const jwt = require('jsonwebtoken');
const app= express();
const port= 3000;
app.use(express.json());

const secretKey= "sup3rSecr3tss";

const userSchema= new mongoose.Schema({
    username: String,
    password: String,
    purchasedCourses: [{type: mongoose.Schema.Types.ObjectId}]
});

const adminSchema= new mongoose.Schema({
    username:  String,
    password: String
});

const courseSchema= new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean
});

const User= mongoose.model("User",userSchema);
const Admin= mongoose.model("Admin",adminSchema);
const Course= mongoose.model("Course",courseSchema);    

const generateJwt= (user)=>{
const payload = {username: user.username};
    return jwt.sign(payload, secretKey, {expiresIn: "1h"});
}
    
const authenticatejwt=(req, res, next)=>{
    const authHeader= req.headers.authorization;
    if(authHeader){
    const token= authHeader.split(" ")[1];
    
    console.log("call from authenticate JWT");
    console.log(token);

    jwt.verify(token, secretKey,(err, user)=>{
        if(err){
            return res.sendStatus(403);
        }
        req.user= user;
        next();
    });
   }else{
    res.sendStatus(401);
   }
};

// mongoose.connect(" ",{})

// ADMIN Routes
app.post("/admin/signup", (req, res)=>{
    const {username, password} = req.body;
    const existingAdmin = ADMIN.find(a=> a.username=== admin.username);
    if(existingAdmin){
        res.status(403).json({message: "Admin Already Exists"});
    }else{
        ADMIN.push(admin);
        const token= generateJwt(admin);
        res.json({message: "Admin Created Succesfully", token});
    }
});

app.post("/admin/login", async(req, res)=>{
    const {username, password} = req.headers;
    const admin= await Admin.findOne({username, password});
    if(admin){
        const token= jwt.sign({username, role:"admin"}, secretKey, {expiresIn:"1h"});
        res.json({message: "Logged in succesful", token});
    }else{
        res.status(403).json({message:"Admin Authentication failed"});
    }
});

app.post("/admin/courses", authenticatejwt, async (req, res)=>{
    const course= new Course(req.body);
    await course.save();
    res.json({message: "Course Added Succesfully", courseId: course.id});

});

///course update route
app.put("/admin/courses/:courseId", authenticatejwt, async(req, res)=>{
    const course= await Course.findByIdAndUpdate(req.params.courseId, req.body, {new: true}) ;
    if(course){
        res.json({message:"Course Updated Succesfully"});
    }else{
        res.status(404).json({message:"Course not Found"});
    }
});

app.get("/",authenticatejwt, async(req, res)=>{
    const courses= await Course.find({});
    res.json({courses});

});

/// USER ROUTES
app.post("/users/signup", async(req, res)=>{
    const {username, password}= req.body;
    const user= await User.findOne({username});
    if(user){
        res.status(403).json({message:"User Already Exists"});
    }else{
        const newUser= new User({username, password});
        await newUser.save();
        const token= jwt.sign({username, role:"user"}, secretKey, {expiresIn:"1h"});
        res.json({message:"User Created Succesfully ", token});
    }
});

app.post("/users/login", async(req, res)=>{
    const {username, password}= req.headers;
    const user= await User.findOne({username, password});
    if(user){
        const token= jwt.sign({username, role:"user"}, secretKey, {expiresIn:"1h"});
        res.json({message: "Logged in Succesfully ", token});
    }else{
        res.status(403).json({message: "User Authentication Failed"});
    }
});

app.get("/users/courses",authenticatejwt, async(req, res)=>{
    const courses= await Course.find({published: true});
    res.json({courses});
});

app.post("/users/courses/:courseId", authenticatejwt, async(req, res)=>{
    const course= await Course.findById(req.params.courseId);
    if(course){
        const user = await User.findOne({username: req.user.username});
    if (user) {
        user.purchasedCourses.push(course);
        await user.save();
      res.json({ message: 'Course purchased successfully' });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
    }else{
        res.status(404).json({message:"Course not found"});
    }
});

app.get("/users/purchasedCourses", authenticatejwt, async(req, res)=>{
    const user = await User.findOne({username: req.user.username}).populate("purchasedCourses")
    if (user) {
      res.json({ purchasedCourses: user.purchasedCourses || []});
    } else {
      res.status(404).json({ message: 'User Not Found' });
    }
})
app.listen(port, ()=>{
    console.log(`Example app listening on port: ${port}`);
})