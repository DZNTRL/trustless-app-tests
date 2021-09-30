import { IResponse } from "pro-web-core"
import Core from "pro-web-core"
import { IUser } from "pro-web-core/src/interfaces/models/IUser"
import { testuserid1, testchallenge1, testpubkey1 } from "../constants"


export default function() {
    this.verifyChallenge = function(username, challenge) {
        return new Promise<IResponse<boolean>>((res, rej) => {
            var resp = new Core.Response<boolean>(true)
            if(username === testuserid1 && challenge === testchallenge1) {
            } else {
                resp.Data = false
            }
            res(resp)
        })
    }
    this.get = function(username) {
        return new Promise<IResponse<IUser>>((res, rej) => {
            const resp = new Core.Response<IUser>()
            if(username === testuserid1) {
                resp.Data = {
                    username: testuserid1,
                    id: 1,
                    publicKey: testpubkey1,
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
            if(username !== testuserid1) {
                resp.Data = false
            }
            return res(resp)
        })
    }
    this.requestLogin = function(username) {
        return new Promise((res, rej) => {
            const resp = new Core.Response<string>(testchallenge1);
            if(username !== testuserid1) {
                resp.Data = null
                resp.Message = Core.Enums.ResponseMessages.NotFound.toString()
            }
            res(resp)    
        })
    }
    this.login = function(username, challenge) {
        return new Promise((res, rej) => {
            const resp = new Core.Response<boolean>(true)
            if(username !== testuserid1 || challenge !== testchallenge1) {
                resp.Data = false
            }
            res(resp)
        })
    }
}