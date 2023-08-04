import React, { FC, lazy, Suspense } from 'react';
import { Collapse, theme, Affix, Button, FloatButton } from "antd"
import useStore from "../useStore"
const Fangjian = lazy(() => import("./fangjian"))
const Rf433Server = lazy(() => import("./rf433Server"))
const SerialServer = lazy(() => import("./serialServer"))
const EthServer = lazy(() => import("./ethServer"))
const WsClient = lazy(() => import("./wsClient"))
const WsServer = lazy(() => import("./wsServer"))
//const WifiSta = lazy(() => import("./wifiSta"))
const WifiApServer = lazy(() => import("./wifiApServer"))
const App = () => {
    const { Panel } = Collapse;
    const { token } = theme.useToken();
    return (
        <>
            <FloatButton
                description="保存重启"
                shape="square"
                style={{ right: 70 }}
                onClick={() => {
                    useStore.getState().req("globalConfig_toFile");
                }}
            />
            <FloatButton
                description="放弃重启"
                shape="square"
                style={{ right: 20 }}
                onClick={() => {
                    useStore.getState().req("espRestart")
                }}
            />
            <Collapse
                bordered={false}
                defaultActiveKey={['1']}
                // expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                style={{ background: token.colorBgContainer }}
            >
                <Panel header="房间配置" key={1}>
                    <Suspense fallback={<>我是懒加载</>}><Fangjian /></Suspense>
                </Panel>
                <Panel header="rf433Server" key={2}>
                    <Suspense fallback={<>我是懒加载</>}><Rf433Server /></Suspense>
                </Panel>
                <Panel header="serialServer" key={3}>
                    <Suspense fallback={<>我是懒加载</>}><SerialServer /></Suspense>
                </Panel>
                <Panel header="wsClient" key={4}>
                    <Suspense fallback={<>我是懒加载</>}><WsClient /></Suspense>
                </Panel>
                <Panel header="wsServer" key={5}>
                    <Suspense fallback={<>我是懒加载</>}><WsServer /></Suspense>
                </Panel>
                <Panel header="ethServer" key={6}>
                    <Suspense fallback={<>我是懒加载</>}><EthServer /></Suspense>
                </Panel>
                {/* <Panel header="wifiSta" key="5">
                    <Suspense fallback={<>我是懒加载</>}><WifiSta /></Suspense>
                </Panel> 
                {/* <Panel header="ETH" key="6">
                    -----
                </Panel>
                <Panel header="dnsServer+mdnsServer" key="7">
                    -----
                </Panel>
                <Panel header="ttl serialServer" key="8">
                    -----
                </Panel>
                <Panel header="udpServer" key="9">
                    -----
                </Panel>
                <Panel header="webScoketServer+webServer+esServer" key="10">
                    -----
                </Panel> 
                <Panel header="udpClient" key="12">
                    -----
                </Panel>
                <Panel header="mqttClient" key="13">
                    -----
                </Panel>
                <Panel header="tcpClient" key="14">
                    -----
                </Panel>
                <Panel header="ttl serialClient" key="15">
                    -----
                </Panel> */}
            </Collapse>
        </>
    )
}
export default App