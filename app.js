const express = require("express");
const bodyParse = require("body-parser");
const request = require("request");
const https = require("https");

const app = express()

app.use(bodyParse.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})


app.post("/", function(req, res){
    const firstName = req.body.fName
    const lastName = req.body.lName
    const email = req.body.email
    console.log(firstName, lastName, email);

    const data = {
        members : [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/846581e11a";

    const options = {
        method: "POST",
        auth: "Daryl:6f91522265d16e032f24759c0732aaed-us17"
    }

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req, res){
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function(req, res){
    console.log("Server is running on port 3000");
})


// 6f91522265d16e032f24759c0732aaed-us17

// 846581e11a