const express= require("express");
const app= express();
const port= 3000;
app.use(express.json());

let ADMIN= [];
let COURSES= [];
let USERS= [];

const adminAuthentication= (req, res, next)=>{
    const {username, password}= req.headers;
    let admin= ADMIN.find(a=> a.username=== username && a.password=== password);
    if(admin){
        next();
    }
    else{
        res.status(403).json({message: "Admin Authentication Failed"});
    }
}

const userAuthentication= (req, res, next)=>{
    const {username, password}= req.headers;
    let user= USERS.find(a=> a.username=== username && a.password=== password);
    if(user){
        req.user= user;
        next();
    }
    else{
        res.status(403).json({message: "User Authentication Failed"});
    }
}
// ADMIN Routes

app.post("/admin/signup", (req, res)=>{
    const admin = req.body;
    const existingAdmin = ADMIN.find(a=> a.username=== admin.username);
    if(existingAdmin){
        res.status(403).json({message: "Admin Already Exists"});
    }else{
        ADMIN.push(admin);
        res.json({message: "Admin Created Succesfully"});
    }
});

app.post("/admin/login", adminAuthentication, (req, res)=>{
    res.json({message: "Logged in succesfully "});

});

app.post("/admin/courses", adminAuthentication, (req, res)=>{
    const course= req.body;

    course.id= Date.now();
    COURSES.push(course);
    res.json({message: "Course Added Succesfully", courseId: course.id});

});

///course update route
app.put("/admin/courses/:courseId", adminAuthentication, (req, res)=>{
    courseId= parseInt(req.params.courseId);
    course= COURSES.find(c=> c.id=== courseId);

    if(course){
        Object.assign(course, req.body);
        res.json({message: "Message Updated Succesfully"});
    }else{
        res.status(404).json({message: "Course not Found"});
    }
});

app.get("/admin/courses",(req, res)=>{
    res.json({courses: COURSES});

});

/// USER ROUTES

app.post("/users/signup",(req, res)=>{
    res.send("User Signup Succesful");

});

app.post("/users/login",(req, res)=>{
    res.send("User login succesful");

});

app.get("/users/courses",(req, res)=>{
    res.send("All Courses List");

});

app.post("/users/courses/:courseId",(req, res)=>{
    res.send("Course Purchased Succesfull");

});

app.get("/users/purchasedCourses", (req, res)=>{
    res.send("Purchasesd courses list");

})
app.listen(port, ()=>{
    console.log(`Example app listening on port: ${port}`);
})