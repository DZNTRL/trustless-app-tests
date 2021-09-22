import request from "supertest"
import createApp from "pro-web-app"
import { expect } from "chai"
import Core from "pro-web-core"
import { createPool, IResponse } from "pro-web-core"
import { IUser } from "pro-web-core/src/interfaces/models/IUser"
import config from "config"
import StubCore from "./StubCore"

const userService = new Core.Service.User(config.get("db"))

describe("User api tests", function() {
    const app = createApp(StubCore)
    describe("login tests", function() {
        it("should not login an invalid user", (done) => {
            request(app)
                .post(`/login`).send({username: "test", password: "abc"})
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
                .post(`/login`).send({username: "test", password: "test"})
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
                .send({username: "test", password: "test"})
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