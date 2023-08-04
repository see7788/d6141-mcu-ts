import React, { FC, useEffect, useState } from 'react';
import store, { State } from "../../useStore";
import _ from "lodash"
import {
    Descriptions,
    Space,
    Drawer,
    Popover,
    List,
    Avatar,
    Badge,
    Typography,
    Divider,
    Button,
    Dropdown,
    Select
} from 'antd';
const { Text } = Typography;
import {
    DeleteOutlined,
    UserAddOutlined,
    FormOutlined
} from '@ant-design/icons';

const App: FC = () => {
    const api = (op: State["rf433Server"]) => {
        store.getState().req<"rf433Server">("config_set", { rf433Server: op });
    }
    const rf433Server = store(s => s.state.rf433Server);
    const db_entries = Object.entries(rf433Server?.db || {})
    const doTypes = store(s => s.state.rf433Server.doTypes);
    const children = _.orderBy(db_entries, e => `${e[1][rf433Server.by]}${e[1][0]}`).map(([id, info]) => {
        const [byNumber, state, doId] = info
        const doname = doTypes[doId]
        const style = { backgroundColor: state ? '#FF3366' : "#33CC33" }
        const doIdSet = (doId: string) => {
            store.setState(s => {
                s.state.rf433Server.db[id][2] = Number(doId);
                api(s.state.rf433Server)
            });
        }
        const dbdel = () => {
            store.setState(s => {
                delete s.state.rf433Server.db[id];
                Object.keys(s.state.rf433Server.db).map((v, i) => {
                    s.state.rf433Server.db[v][0] = i
                })
                api(s.state.rf433Server)
            });
        }
        return (
            <Badge key={id} style={style} count={byNumber + 1} >
                <Popover content={
                    <Space wrap={true}>
                        <Button onClick={() => dbdel()}>删传感器<DeleteOutlined /></Button >
                        <Select onChange={doIdSet} defaultValue={doname} options={
                            doTypes.map((v, i) => ({
                                value: i,
                                label: v,
                            }))} />
                    </Space>
                } >
                    <Avatar shape="square" style={style} size={64}>{doname}</Avatar >
                </Popover>
            </Badge>
        )
    })
    return <Space wrap={true} align="end" children={children} />
}
export default App