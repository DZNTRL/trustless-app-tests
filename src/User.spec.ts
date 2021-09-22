import request from "supertest"
import createApp from "pro-web-app"
import { expect } from "chai"
import Core from "pro-web-core"
import config from "config"
import StubCore from "./StubCore"

const userService = new Core.Service.User(config.get("db"))

describe("User api tests", function() {
    const app = createApp(StubCore)
    describe("User create api tests", function() {
        it("post /user should return 200 + proper response", (done) => {
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
                    done()
                })
        })
        it("get /unique/username with unique username should return Response<true>", (done) => {
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
                    done()
                })
        })
        it("get /unique/username with unique username should return Response<false>", (done) => {
            const uniqueUsername = "BADC"
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
                    expect(res.body.Data).to.equal(false)
                    done()
                })
        })
    })
})