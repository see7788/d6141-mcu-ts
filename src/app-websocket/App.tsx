import { FC, lazy, Suspense, useEffect, useState } from 'react'
import store from "../useStore"
import { Input, Space, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const App = lazy(() => import("../state/index"))
let webSocketObj: WebSocket
const UI: FC<{ wsUri?: string }> = ({ wsUri }) => {
    const [ipcname, statesucc, wsuri] = store(s => s.ipc.state)
    const onClick = (wsuri: string): Promise<boolean> => new Promise((ok) => {
        webSocketObj = new WebSocket(wsuri);
        webSocketObj.onopen = e => {
            store.setState(s => {
                s.ipc.state[0] = "webSocket";
                s.ipc.state[1] = false;
                s.ipc.state[2] = wsuri;
            })
            const loop = setInterval(() => {
                if (webSocketObj.readyState === 1) {
                    store.setState(s => {
                        s.req = async (...op) => {
                            webSocketObj.send(JSON.stringify(op))
                        };
                        s.req("globalConfig_get")
                        ok(true);
                    })
                    clearInterval(loop)
                }
            }, 300);
        }
        webSocketObj.onmessage = e => {
            try {
                const db = JSON.parse(e.data);
                store.getState().res(db)
            } catch (ee) {
                console.error(e.data)
            }
        };
        webSocketObj.onclose = e => {
            store.setState(s => {
                s.ipc.state[0] = false;
                s.ipc.state[1] = false;
                s.ipc.state[2] = false;
            })
            console.error("ws.onclose", e);
            setTimeout(() => {
                onClick(wsuri);
            }, 2000);
        }
    })
    useEffect(() => {
        if (wsUri) {
            onClick(wsUri);
        };
    }, [])
    if (ipcname && statesucc) {
        return <Suspense fallback={<>我是懒加载</>}><App /></Suspense>
    } else if (wsuri) {
        return <LoadingOutlined style={{ fontSize: '30px' }} spin />
    } else {
        return (
            <Space>
                wsUri:<Input.Search
                    value={wsUri}
                    size="small"
                    placeholder="请输入协议地址"
                    onSearch={(v: any) => {
                        if (v) onClick(v.target.value);
                    }}
                    enterButton="连接" />
            </Space>
        )
    }
}
export default UI