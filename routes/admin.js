/* 
    constants to enable connectivity between components and encryption using bcrypt
    bcrypt and saltRounds enable authorization and encryption
    jwt uses the passport module to create and store a user token
*/
const router = require("express").Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");

// import models
const Student = require("../models/Student");
const Staff = require("../models/Staff");
const AdvisingWindow = require("../models/AdvisingWindow");

// add new student account
router.post("/students/create", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        // destructure data entered
        const {username, password} = req.body

        // check if user exists since duplicate usernames aren't allowed
        const user = await Student.findOne({where: { username }});
        if(user) {
            return res.status(401).send("Student already exists.");
        }
        else {
            // saltRounds are needed to increase the degree of hashing
            // passEncrypt is the encrypted version of the password entered which uses the salt created
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const passEncrypt = await bcrypt.hash(password, salt);

            await Student.create({
                username,
                password: passEncrypt,
            })
            .then(() => {
                return res.status(200).send("Student added!");
            })
            .catch (err => {
                    console.log("Error: ", err.message);
            });
        }
    }
    catch (err) {
        console.log("Error: ", err.message);
        res.status(500).send("Server Error");
    }
});

// add new staff account
router.post("/staff/create", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const {username, password} = req.body

        const user = await Staff.findOne({where: { username }});
        if(user) {
            return res.status(401).send("Staff member already exists.");
        }
        else {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const passEncrypt = await bcrypt.hash(password, salt);

            await Staff.create({
                username,
                password: passEncrypt,
            })
            .then(() => {
                return res.status(200).send("Staff added!");
            })
            .catch(err => {
                    console.log("Error: ", err.message);
            });
        }
    }
    catch (err) {
        console.log("Error: ", err.message);
        res.status(500).send("Server Error");
    }
});

// set advising window
router.post("/academic-advising/window", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const {advisingStart, advisingEnd, semester} = req.body

        await AdvisingWindow.create({
            advisingStart,
            advisingEnd,
            semester
        })
        .then(() => {
            return res.status(200).send("Window Set for Semester");
        })
        .catch(err => {
            console.log("Error: ", err.message);
        });
    }
    catch (err) {
        console.log("Error: ", err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
