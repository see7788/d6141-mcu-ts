import React, { FC } from 'react'
import store, { State } from "../../useStore";
import { EditOutlined } from "@ant-design/icons"
import { Input, Descriptions, Segmented, InputNumber } from "antd"
const App: FC = () => {
    const c = store(s => s.state.fangjian)
    const db = store(s => s.state.rf433Server.db)
    const do0 = store(s => s.state.rf433Server.doTypes[0])
    const kengshu = Object.entries(db).filter((kv, i) => kv[1][2] == 0).length
    const kengtext = `按${do0}自动计算坑数`
    const api = (op: State["fangjian"]) => {
        store.getState().req<"fangjian">("config_set", { fangjian: op });
    }
    const set_doorType = (c: string | number) => store.setState(s => {
        s.state.fangjian.doorType = String(c);
        api(s.state.fangjian);
    });
    const set_doorName = (c: string | number) => store.setState(s => {
        s.state.fangjian.doorName = String(c);
        api(s.state.fangjian);
    });
    const set_doorFloor = (c: string | number) => store.setState(s => {
        s.state.fangjian.doorFloor = Number(c)
        api(s.state.fangjian);
    });
    return (
        <Descriptions>
            <Descriptions.Item label="id">
                <InputNumber
                    defaultValue={c.id}
                    min={1}
                    max={10}
                    bordered={false} />
            </Descriptions.Item>
            <Descriptions.Item label="名称">
                <Input
                    defaultValue={c.doorName.replace(/\s*/g, "") || `${c.doorFloor}Floor-${c.doorType}`}
                    onChange={(c:any) => set_doorName(c.target.value)}
                    suffix={<EditOutlined />}
                    bordered={false}
                />
            </Descriptions.Item>
            <Descriptions.Item label="男女">
                <Segmented
                    value={c.doorType}
                    options={['girl', 'boy']}
                    onChange={set_doorType}
                />
            </Descriptions.Item>
            <Descriptions.Item label="楼层">
                <Segmented
                    value={c.doorFloor}
                    options={Array.from(new Array(9), (c, i) => ++i)}
                    onChange={set_doorFloor}
                />
            </Descriptions.Item>
            <Descriptions.Item label="坑数">
                <Input
                    suffix={kengtext}
                    value={kengshu}
                    bordered={false}
                    disabled />
            </Descriptions.Item>
        </Descriptions>
    )
}
export default App