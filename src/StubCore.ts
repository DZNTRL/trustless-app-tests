import { stub } from "sinon"
import Core from "pro-web-core"
import userServiceStub from "./testingUtils/Service/User"

stub(Core.Service, "User").callsFake(userServiceStub)

export default Core