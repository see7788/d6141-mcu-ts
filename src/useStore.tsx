import { immer } from 'zustand/middleware/immer'
import { create } from "zustand"
import _ from "lodash"
import globalConfig from "./config.json";
type PowerPartial<T> = { [U in keyof T]?: T[U] extends object ? PowerPartial<T[U]> : T[U]; }
export type State = (typeof globalConfig) & {
    rf433Server: {
        db: { [id in string]: [autoIndex: number, state: boolean, doId: number] }
    }
}
export type Store = {
    ipc: {
        state: ["webSocket" | "webSerial" | false, boolean, any?]//[0通讯初始化，1globalConfig初始化]
    };
    res: <T extends keyof State >(op: ["config_set", Pick<State, T>] | ["globalConfig_set", State]) => void
    req: <T extends keyof State>(...op:
        ["config_set", Pick<State, T>] |
        ["globalConfig_set", Partial<State>] |
        ["globalConfig_get"] |
        ["globalConfig_toFile"] |
        ["globalConfig_fromFile"] |
        ["espRestart"]
    ) => Promise<void>;
    state: State
}
export default create<Store>()(immer<Store>((set, self) => {
    let req: Store["req"] = async (...req) => console.log("req def", ...req);
    return {
        ipc: {
            state: [false, false]
        },
        res: ([api, info]) => set(s => {
            let res = "web pass";
            if (api === "globalConfig_set") {
                s.state = { ...s.state, ...info }
                res = "web use";
                s.ipc.state[1] = true;
            } else if (api === "config_set") {
                s.state = { ...s.state, ...info }
                res = "web use";
                s.ipc.state[1] = true;
            }
            console.log({ res, api, info });

        }),
        req: (...op) => req(...op),
        state: globalConfig
    }
}))