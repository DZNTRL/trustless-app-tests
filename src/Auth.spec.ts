import request from "supertest"
import createApp from "pro-web-app"
import { expect } from "chai"
import Core from "pro-web-core"
import { testuserid1, testchallenge1 } from "./testingUtils/constants"

import config from "config"
import StubCore from "./StubCore"

const userService = new Core.Service.User(config.get("db"))

describe("Authentication api tests", function() {
    const app = createApp(StubCore)
    const requestApp = request(app)
    describe("request session tests", function() {
        it("a valid username without a token should return a response<string> with a challenge", (done) => {
            requestApp
                .get(`/request-session/${testuserid1}`)
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.be.an("object")
                    expect(res.body.IsError).to.equal(false)
                    expect(res.body.Message).to.equal(StubCore.Enums.ResponseMessages.OK.toString())
                    expect(res.body.Data).to.equal(testchallenge1)
                    done()
                })
        })
        it("a valid username with a valid token should return 400", (done) => {
            request(app)
                .post("/login")
                .send({username: testuserid1, password: testchallenge1})            
                .end((err, res) => {
                    request(app)
                        .get(`/request-session/${testuserid1}`)                    
                        .set("authorization", res.body.token)
                        .expect("Content-Type", /json/)
                        .end((reqa, resa) => {
                            expect(resa.statusCode).to.equal(400)
                            done()
                        })
                })

        })

    })
    describe("login tests", function() {        
        it("should not login an invalid user", (done) => {
            request(app)
                .post(`/login`).send({username: "TETTTS", password: testchallenge1})
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property("token")
                    expect(res.body.token).to.equal(null)
                    done()
                })
        })
        it("should not login an invalid challenge", (done) => {
            request(app)
                .post(`/login`).send({username: testuserid1, password: "BLABLABLA"})
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property("token")
                    expect(res.body.token).to.equal(null)
                    done()
                })
        })
        it("should login a valid user", (done) => {
            request(app)
                .post(`/login`).send({username: testuserid1, password: testchallenge1})
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property("token")
                    expect(res.body.token).to.be.a("string")
                    done()
                })
        })
    })
    describe("jwtissuance tests", () => {
        const requestApp = request(app)
        it("a request to a protected page should succeed with a token", (done) => {
            requestApp
                .post("/login")
                .send({username: testuserid1, password: testchallenge1})
                .end((err, res) => {
                    requestApp
                        .get("/board/abc")
                        .set("authorization", res.body.token)
                        .expect("Content-Type", /text-html/)
                        .expect(200)
                        .end((err, resa) => {
                            expect(resa.body).to.equal("boardabc")
                            done()
                        })
                })
        })
        it("a request to a protected page should fail without a token", (done) => {
            requestApp
                .get("/board/abc")
                .expect("Content-Type", /text-html/)
                .expect(401)
                .end((err, resa) => {
                    expect(JSON.stringify(resa.body)).to.equal("{}")
                    done()
                })    
        })
        it("a request to a protected page shuold fail with an invalid tokens", () => {
            requestApp
                .get("/board/abc")
                .set("authorization", "abcdef")
                .expect("Content-Type", /text-html/)
                .expect(401)
        })
    })
})