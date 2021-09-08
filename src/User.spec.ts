import request from "supertest"
import app from "pro-web-app"
import { expect } from "chai"

describe("User api tests", function() {
    describe("User create api tests", function() {
        it("post /user should return 200 + proper response", () => {
            const expectedValue: number = 1
            request(app)
                .post("/user", {username: "test", publicKey: "test"})
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
})