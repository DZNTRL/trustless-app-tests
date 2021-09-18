import request from "supertest"
import createApp from "pro-web-app"
import { expect } from "chai"
import Core from "pro-web-core"
import { createPool, IResponse } from "pro-web-core"
import { IUser } from "pro-web-core/src/interfaces/models/IUser"
import config from "config"
import sinon from "sinon"

const userService = new Core.Service.User(config.get("db"))

const stub = sinon.stub(Core.Service, "User").callsFake(function() {
    this.verifyChallenge = function(username, challenge) {
        return new Promise<IResponse<boolean>>((res, rej) => {
            var resp = new Core.Response<boolean>(true)
            if(username === "test" && challenge === "test") {
            } else {
                resp.Data = false
            }
            res(resp)    
        })
    }
    this.get = function(username) {
        return new Promise<IResponse<IUser>>((res, rej) => {
            const resp = new Core.Response<IUser>()
            if(username === "test") {
                resp.Data = {
                    username: "test",
                    id: 1,
                    publicKey: "test",
                    isAdmin: false
                }
            } else {
                resp.Message = Core.Enums.ResponseMessages.NotFound.toString()
            }
            res(resp)
        })
    }
})

describe("User api tests", function() {
    const app = createApp(Core)
    describe("User create api tests", function() {
        it("post /user should return 200 + proper response", () => {
            const expectedValue: number = 1
            request(app)
                .post("/user", {username: "[[TEST]]", publicKey: "test"})
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.be.an("object")
                    expect(res.body).to.have.property("IsError")
                    expect(res.body.IsError).to.equal(false)
                    expect(res.body).to.have.property("Message")
                    expect(res.body).to.have.property("Data")
                    expect(res.body.Data).to.equal(expectedValue)
                })
        })
        it("get /unique/username with unique username should return Response<true>", () => {
            const uniqueUsername = "TEST"
            request(app)
                .get(`/user/unique/${uniqueUsername}`)
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.be.an("object")
                    expect(res.body).to.have.property("IsError")
                    expect(res.body.IsError).to.equal(false)
                    expect(res.body).to.have.property("Message")
                    expect(res.body).to.have.property("Data")
                    expect(res.body.Data).to.equal(true)
                })
        })
    })
    describe("login tests", function() {
        it("should not login an invalid user", async() => {
            request(app)
                .post(`/login`).send({username: "test", password: "abd"})
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property("token")
                    expect(res.body.token).to.equal(null)
                })
        })
        it("should login an valid user", async() => {
            request(app)
                .post(`/login`).send({username: "test", password: "test"})
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property("token")
                    expect(res.body.token).to.be.a("string")
                })
        })
    })
})