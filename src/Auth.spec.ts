import request from "supertest"
import createApp from "pro-web-app"
import { expect } from "chai"
import Core from "pro-web-core"
import { testuserid1, testchallenge1 } from "./testingUtils/constants"
import { ResponseMessages } from "pro-web-common/dist/js/enums/ResponseMessages"
import config from "config"
import StubCore from "./StubCore"

const userService = new Core.Service.User(config.get("db"))
const createCookie = (res) => {
    const _cookie = res.headers["set-cookie"][0] ? 
    decodeURI(res.headers["set-cookie"][0]
        .replace("Path", "")
        .replace("authorization=Bearer", "")
        .replace("Path=", "")): ""
    const cookie = `authorization=${_cookie}`
    return cookie
}

describe("Authentication api tests", function() {
    const app = createApp(StubCore)
    const requestApp = request(app)
    describe("request session tests", function() {
        it("a valid username without a token should return a response<string> with a challenge", (done) => {
            requestApp
                .get(`/api/request-session/${testuserid1}`)
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.be.an("object")
                    expect(res.body.IsError).to.equal(false)
                    expect(res.body.Message).to.equal(ResponseMessages.OK.toString())
                    expect(res.body.Data).to.equal(testchallenge1)
                    done()
                })
        })
        it("a valid username with a valid token should return 400", (done) => {
            request(app)
                .post("/api/login")
                .send({username: testuserid1, password: testchallenge1})            
                .end((err, res) => {
                    request(app)
                        .get(`/api/request-session/${testuserid1}`)
                        .set("Cookie", createCookie(res))                   
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
                .post(`/api/login`).send({username: "TETTTS", password: testchallenge1})
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.equal("OK")
                    done()
                })
        })
        it("should not login an invalid challenge", (done) => {
            request(app)
                .post(`/api/login`).send({username: testuserid1, password: "BLABLABLA"})
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.equal("OK")
                    done()
                })
        })
        it("should login and logout valid user", (done) => {
            request(app)
                .post(`/api/login`).send({username: testuserid1, password: testchallenge1})
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.equal("OK")
                    request(app)
                    .get(`/api/logout`)
                    .set("Cookie", createCookie(res))
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.equal("OK")
                        done()
                    })
                })
        })
    })
    describe("jwtissuance tests", () => {
        const requestApp = request(app)
        it("a request to a protected page should succeed with a token", (done) => {
            requestApp
                .post("/api/login")
                .send({username: testuserid1, password: testchallenge1})
                .end((err, res) => {
                    requestApp
                        .get("/api/board/abc")
                        .set("Cookie", createCookie(res))
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
                .get("/api/board/abc")
                .expect("Content-Type", /text-html/)
                .expect(401)
                .end((err, resa) => {
                    expect(JSON.stringify(resa.body)).to.equal("{}")
                    done()
                })    
        })
        it("a request to a protected page shuold fail with an invalid tokens", () => {
            requestApp
                .get("/api/board/abc")
                .set("authorization", "abcdef")
                .expect("Content-Type", /text-html/)
                .expect(401)
        })
    })
})