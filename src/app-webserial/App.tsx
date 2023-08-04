import { FC, lazy, Suspense, useEffect, useRef, useState } from 'react'
import store from "../useStore"
import { Input, Space, Button } from 'antd';
import usewebserial from './usewebserial'
const App = lazy(() => import("../state/index"))
export default () => {
    const [ipcname, statesucc] = store<[false | string, boolean, any?]>(s => s.ipc.state)
    const { portOpen, port, send, on, errorMsg } = usewebserial();
    const res = () => {
        on(s => {
            try {
                const db = JSON.parse(s)
                store.getState().res(db)
            } catch (e) {
                console.error({ e, s })
            }
        })
        const req = async (...op: any) => {
            try {
                const db = JSON.stringify(op)
                send(db)
            } catch (e) {
                console.error({ e, op })
            }
        }
        store.setState(s => {
            s.ipc.state[0] = "webSerial"
            s.req = req
        })
        req("globalConfig_get");
    }
    if (ipcname && statesucc) {
        return <Suspense fallback={<>我是懒加载</>}><App /></Suspense>
    } else if (port) {
        return (
            <>
                <Button onClick={res}>res</Button>
                {errorMsg}
            </>
        )
    } else {
        return (
            <>
            <Input.Search
                placeholder="请输入波特率"
                allowClear
                enterButton="portOpen"
                defaultValue="115200"
                onSearch={(v) => portOpen({}, { baudRate: Number(v) })}
            />
            {errorMsg}
            </>
        )
    }
}