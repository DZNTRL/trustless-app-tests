import { IResponse } from "pro-web-core"
import Core from "pro-web-core"
import { IUser } from "pro-web-core/src/interfaces/models/IUser"


export default function() {
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
    this.checkUsernameUnique = function(username) {
        return new Promise<IResponse<boolean>>((res, rej) => {
            const resp = new Core.Response<boolean>(true)
            if(username !== "TEST") {
                resp.Data = false
            }
            return res(resp)
        })
    }
}