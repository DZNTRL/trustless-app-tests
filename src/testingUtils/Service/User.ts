import { IResponse } from "pro-web-common/dist/js/interfaces/IResponse"
import { Response } from "pro-web-common/dist/js/Response"
import { ResponseMessages } from "pro-web-common/dist/js/enums/ResponseMessages"
import { IUser } from "pro-web-common/dist/js/interfaces/models/IUser"
import { testuserid1, testchallenge1, testpubkey1 } from "../constants"


export default function() {
    this.verifyChallenge = function(username, challenge) {
        return new Promise<IResponse<boolean>>((res, rej) => {
            var resp = new Response<boolean>(true)
            if(username === testuserid1 && challenge === testchallenge1) {
            } else {
                resp.Data = false
            }
            res(resp)
        })
    }
    this.get = function(username) {
        return new Promise<IResponse<IUser>>((res, rej) => {
            const resp = new Response<IUser>()
            if(username === testuserid1) {
                resp.Data = {
                    username: testuserid1,
                    id: 1,
                    publicKey: testpubkey1,
                    isAdmin: false
                }
            } else {
                resp.Message = ResponseMessages.NotFound.toString()
            }
             res(resp)
        })
    }
    this.checkUsernameUnique = function(username) {
        return new Promise<IResponse<boolean>>((res, rej) => {
            const resp = new Response<boolean>(true)
            if(username !== testuserid1) {
                resp.Data = false
            }
            return res(resp)
        })
    }
    this.requestLogin = function(username) {
        return new Promise((res, rej) => {
            const resp = new Response<string>(testchallenge1);
            if(username !== testuserid1) {
                resp.Data = null
                resp.Message = ResponseMessages.NotFound.toString()
            }
            res(resp)    
        })
    }
    this.login = function(username, challenge) {
        return new Promise((res, rej) => {
            const resp = new Response<boolean>(true)
            if(username !== testuserid1 || challenge !== testchallenge1) {
                resp.Data = false
            }
            res(resp)
        })
    }
}