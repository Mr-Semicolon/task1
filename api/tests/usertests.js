const chai = require("chai");
const chaiHttp = require("chai-http");

let usertesting = require("../routes/users");

chai.should();

chai.use(chaiHttp);



describe('users API', () => {
///////////////////////////////sign-up testing///////////////////////////////////
    describe("POST /signup", () => {
        it("It should POST a new user", (done) => {
            const newUser = {
                userName: "yahiya",
                email: "yahiya.mahrous@gmail.com",
                password : "1234567",
                firstName: "yahiya",
                lastName:"ramadan"

            };
            chai.request(usertesting)                
                .post("/signup")
                .send(newUser)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('userName').eq("yahiya");
                    response.body.should.have.property('email').eq("yahiya.mahrous@gmail.com");
                    response.body.should.have.property('password').eq("1234567");
                    response.body.should.have.property('firstName').eq("yahiya");
                    response.body.should.have.property('lastName').eq("ramadan");
                done();
                });
        });

        it("It should NOT POST a new user without his email", (done) => {
            const newUser = {
                userName: "yahiya",
                password : "1234567",
                firstName: "yahiya",
                lastName:"ramadan"

            };
            chai.request(usertesting)                
                .post("/signup")
                .send(newUser)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq("Email is required!!");
                done();
                });
        });

    });


/////////////////////////////////login user ////////////////////////////////


describe("POST /login", () => {
    it("It should POST a existing user to login", (done) => {
        const existingUser = {
           
            email: "yahiya.mahrous@gmail.com",
            password : "1234567",
           

        };
        chai.request(usertesting)                
            .post("/login")
            .send(existingUser)
            .end((err, response) => {
                response.should.have.status(201);
                response.body.should.be.a('object');
                response.body.should.have.property('email').eq("yahiya.mahrous@gmail.com");
                response.body.should.have.property('password').eq("1234567");
            done();
            });
    });

    it("It should NOT POST a exisitng user with his password below that 6", (done) => {
        const existingUser = {
            email : "yahiya.mahrous@gmail.com",
            password : "12345",
           

        };
        chai.request(usertesting)                
            .post("/login")
            .send(existingUser)
            .end((err, response) => {
                response.should.have.status(400);
                response.text.should.be.eq("The password should be at least 6 long!");
            done();
            });
    });

});


///////////////////////// profile edit ///////////////////////////////


    describe("PATCH /:userID", () => {
        it("It should PATCH an existing user", (done) => {
            const changeData = {
                userName: "mohamed"
            };
            chai.request(usertesting)                
                .patch("/" + "5f5ccbeacf5aaf8fbd339d48")
                .send(changeData)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('userName').eq("mohamed");
                    response.body.should.have.property('email').eq("yahiya.mahrous@gmail.com");
                    response.body.should.have.property('firstName').eq("yahiya");
                done();
                });
        });

        it("It should NOT PATCH a password of exisitng user contain less than 6", (done) => {
            
            const changeData = {
                password: "12345"
            };
            chai.request(usertesting)                
                .patch("/" + "5f5ccbeacf5aaf8fbd339d48")
                .send(changeData)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq("The password should be at least 6 long!");
                done();
                });
        });        
    });
    



});