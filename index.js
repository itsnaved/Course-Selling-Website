const express= require("express");
const jwt = require('jsonwebtoken');
const app= express();
const port= 3000;
app.use(express.json());

let ADMIN= [];
let COURSES= [];
let USERS= [];

const secretKey= "sup3rSecr3tss";

const generateJwt= (user)=>{
    payload = {username: user.username};
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

// ADMIN Routes

app.post("/admin/signup", (req, res)=>{
    const admin = req.body;
    const existingAdmin = ADMIN.find(a=> a.username=== admin.username);
    if(existingAdmin){
        res.status(403).json({message: "Admin Already Exists"});
    }else{
        ADMIN.push(admin);
        const token= generateJwt(admin);
        res.json({message: "Admin Created Succesfully", token});
    }
});

app.post("/admin/login", (req, res)=>{
    const {username, password} = req.headers;
    const admin= ADMIN.find(a=> a.username=== username && a.password=== password);

    if(admin){
        const token= generateJwt(admin);
        res.json({message: "Logged in succesful", token});
    }else{
        res.status(403).json({message:"Admin Authentication failed"});
    }
});

app.post("/admin/courses", authenticatejwt, (req, res)=>{
    const course= req.body;
    course.id= COURSES.length +1 ;
    COURSES.push(course);
    res.json({message: "Course Added Succesfully", courseId: course.id});

});

///course update route
app.put("/admin/courses/:courseId", authenticatejwt, (req, res)=>{
    courseId= parseInt(req.params.courseId);
    courseIndex= COURSES.findIndex(c=> c.id=== courseId);

    if(courseIndex > -1){
        const updatedCourse= {...COURSES[courseIndex], ...req.body};
        COURSES[courseIndex]= updatedCourse;
        res.json({message:"Course Updated Succesfully"});
    }else{
        res.status(404).json({message:"Course not Found"});
    }
});

app.get("/admin/courses",authenticatejwt,(req, res)=>{
    res.json({courses: COURSES});

});

/// USER ROUTES

app.post("/users/signup",(req, res)=>{
    const user= req.body;
    const existingUser= USERS.find(u=> u.username== user.username);
    if(existingUser){
        res.status(403).json({message:"User Already Exists"});
    }else{
        USERS.push(user);
        const token= generateJwt(user);
        res.json({message:"User Created Succesfully "});
    }
});

app.post("/users/login", (req, res)=>{
    const {username, password}= req.headers;
    const user= USERS.find(u=> u.username=== username && u.password=== password);
    if(user){
        const token = generateJwt(user);
        res.json({message: "Logged in Succesfully ", token});
    }else{
        res.status(403).json({message: "User Authentication Failed"});
    }
});

app.get("/users/courses",authenticatejwt, (req, res)=>{
    res.json({courses: COURSES});
});

app.post("/users/courses/:courseId", authenticatejwt, (req, res)=>{
    const courseId = parseInt(req.params.courseId);
    const course= COURSES.find(c=> c.id=== courseId && c.published);
    if(course){
        const user = USERS.find(u => u.username === req.user.username);
    if (user) {
      if (!user.purchasedCourses) {
        user.purchasedCourses = [];
      }
      user.purchasedCourses.push(course);
      res.json({ message: 'Course purchased successfully' });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
    }else{
        res.status(404).json({message:"Course not found"});
    }
});

app.get("/users/purchasedCourses", authenticatejwt, (req, res)=>{
    const user = USERS.find(u => u.username === req.user.username);
    if (user && user.purchasedCourses) {
      res.json({ purchasedCourses: user.purchasedCourses });
    } else {
      res.status(404).json({ message: 'No courses purchased' });
    }
})
app.listen(port, ()=>{
    console.log(`Example app listening on port: ${port}`);
})