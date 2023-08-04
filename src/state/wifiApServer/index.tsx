import React, { FC } from 'react'
import store from "../../useStore";
import { Descriptions, Segmented, Input } from "antd"
const App: FC = () => {
    const c = store(s => s.state.wifiAp)
    const set_ssid = (e: React.ChangeEvent<HTMLInputElement>) => store.setState(s => {
        s.state.wifiAp.ssid = e.target.value
        s.req<"wifiAp">("config_set", {wifiAp:s.state.wifiAp})
    });
    return (
        <Descriptions>
            <Descriptions.Item label="热点名称">
                <Input 
                value={c.ssid}
                 bordered={false} 
                 onChange={set_ssid}
                 />;
            </Descriptions.Item>
        </Descriptions>
    )
}
export default App