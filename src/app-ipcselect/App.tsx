import React, { FC, Suspense, lazy, useEffect, useState } from 'react';
import { Collapse, theme, notification, FloatButton } from "antd"
import store from "../useStore"
const Websocket = lazy(() => import("../app-websocket/App"))
const Webserial = lazy(() => import("../app-webserial/App"))
const IpcQrcode = (url: string) => (
    <FloatButton
        description="二维码"
        shape="square"
        style={{ right: 120 }}
        onClick={() => {
            notification.open({
                message: 'Notification Title',
                description: (<Suspense fallback={<>我是懒加载</>}>
                    {/* /////// <Qrcode qrUrl={url} /> */}
                </Suspense>)

            });
        }}
    />
)
const App: FC = () => {
    const [ipcname, initstate] = store(s => s.ipc.state)
    const { Panel } = Collapse;
    const { token } = theme.useToken();
    useEffect(() => {
        if (!ipcname) {
            notification.open({
                message: '先建立通讯',
                description:
                    '先选择通讯方式，才能进行设备系统的配置。',
            });
        } else if (!initstate) {
            notification.open({
                message: '等待初始数据'
            });
        } else if (initstate) {
            notification.open({
                message: '初始数据已经就位，可以开始配置'
            });
        }
    }, [ipcname, initstate])
    return <Collapse
        bordered={false}
        defaultActiveKey={['1']}
        style={{ background: token.colorBgContainer }}
    >
        <Panel header="wsServer" key="1">
            <Suspense fallback={<>我是懒加载</>}><Websocket /></Suspense>,
        </Panel>
        <Panel header="serialServer" key="2">
            <Suspense fallback={<>我是懒加载</>}><Webserial /></Suspense>,
        </Panel>
    </Collapse>
}
export default App