const express= require("express");
const app= express();
const port= 3000;
app.use(express.json());

// ADMIN Routes

app.post("/admin/signup", adminAuthentication, (req, res)=>{
    res.send("Admin Signup Succesful");
});

app.post("/admin/login",(req, res)=>{
    res.send("Login Succesful");

})

app.post("/admin/courses",(req, res)=>{
    res.send("Course Added succesfull");

});

app.put("/admin/courses/:courseId",(req, res)=>{
    res.send("Courses Edited Succesfully");

});

app.get("/admin/courses",(req, res)=>{
    res.send("All Courses List");

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