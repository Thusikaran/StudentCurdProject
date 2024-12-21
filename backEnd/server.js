const express = require('express');
const mysql = require('mysql');

const server = express();

// Middleware for parsing body
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Establish the database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dbsmschool"
});

db.connect(function (error) {
    if (error) {
        console.log("Error Connecting to DB");
    } else {
        console.log("Successfully Connected to DB");
    }
});

// Establish the port
server.listen(8085, function check(error) {
    if (error) console.log("Error....!!!!");
    else console.log("Started......!!!!");
});

// Add a student
server.post("/api/student/add", (req, res) => {
    let details = {
        stname: req.body.stname,
        course: req.body.course,
        fee: req.body.fee,
    };
    let sql = "INSERT INTO student SET ?";
    db.query(sql, details, (error) => {
        if (error) {
            console.error("SQL Error:", error.message); // Debug log
            res.send({ status: false, message: "Student creation failed" });
        } else {
            res.send({ status: true, message: "Student created successfully" });
        }
    });
});

//view the records
server.get("/api/student",(req,res)=>{
    var sql = "SELECT * FROM student";
    db.query(sql,function(error,result){
        if(error){
            console.log("Error Connecting to DB")
        }else{
            res.send({status:true,data:result});
        }
    })
})

//search the records
server.get("/api/student/:id",(req,res)=>{
    var studentid =req.params.id;
    var sql ="SELECT * FROM student WHERE id="+studentid;
    db.query(sql,function (error,result){
        if(error){
            console.log("Error Connecting to DB")
        }else{
            res.send({status:true,data:result})
        }
    })
});

//update record
server.put("/api/student/:id", (req, res) => {
    let sql = `
      UPDATE student 
      SET stname = ?, course = ?, fee = ? 
      WHERE id = ?
    `;

    let data = [req.body.stname, req.body.course, req.body.fee, req.params.id];

    db.query(sql, data, (error, result) => {
        if (error) {
            console.error("SQL Error:", error.message);  // Debugging
            res.send({ status: false, message: "Student update failed" });
        } else {
            if (result.affectedRows > 0) {
                res.send({ status: true, message: "Student updated successfully" });
            } else {
                res.send({ status: false, message: "Student not found" });
            }
        }
    });
});

//delete record
server.delete("/api/student/:id",(req,res)=>{
    let sql = "DELETE FROM student WHERE id="+req.params.id+"";
    let query = db.query(sql,(error)=>{
        if(error){
            res.send({status:false,message:"Student Delete Failed"})
        }else {
            res.send({status:true,message:"Student Deleted Successfully"})
        }
    })
})
