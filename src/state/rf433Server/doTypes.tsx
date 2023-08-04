import React, { FC, useState, useRef, useEffect } from 'react';
import store, { State } from "../../useStore";
import { PlusOutlined } from '@ant-design/icons';
import { Tag, InputRef, Input, Tooltip, Space, theme, Button } from 'antd';
const App: FC = () => {
    const api = (op: State["rf433Server"]) => {
        store.getState().req<"rf433Server">("config_set", { rf433Server: op });
    }
    // const rf433Serverdb = store(s => s.state.rf433Server.db);
    // const dbUseIng = Object.entries(rf433Serverdb).map(e => Number(e[1][2])).filter(function (item, index, arr) {
    //     //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
    //     return arr.indexOf(item, 0) === index;
    // });
    const doTypes = store(s => s.state.rf433Server.doTypes);
    const { token } = theme.useToken();
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [editInputIndex, setEditInputIndex] = useState(-1);
    const [editInputValue, setEditInputValue] = useState('');
    const inputRef = useRef<InputRef>(null);
    const editInputRef = useRef<InputRef>(null);
    const setdoTypes = (newdoTypes: string[]) => store.setState(s => {
        s.state.rf433Server.doTypes = newdoTypes;
        api(s.state.rf433Server)
    })
    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);

    useEffect(() => {
        editInputRef.current?.focus();
    }, [inputValue]);

    const handleClose = (removedTag: string) => {
        const newdoTypes = doTypes.filter((tag) => tag !== removedTag);
        console.log(newdoTypes);
        setdoTypes(newdoTypes);
    };

    const showInput = () => {
        setInputVisible(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        if (inputValue && doTypes.indexOf(inputValue) === -1) {
            setdoTypes([...doTypes, inputValue]);
        }
        setInputVisible(false);
        setInputValue('');
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditInputValue(e.target.value);
    };

    const handleEditInputConfirm = () => {
        const newdoTypes = [...doTypes];
        newdoTypes[editInputIndex] = editInputValue;
        setdoTypes(newdoTypes);
        setEditInputIndex(-1);
        setInputValue('');
    };

    const tagInputStyle: React.CSSProperties = {
        width: 78,
        verticalAlign: 'top',
    };

    const tagPlusStyle: React.CSSProperties = {
        background: token.colorBgContainer,
        borderStyle: 'dashed',
    };
    return (
        <Space size={[0, 8]} wrap>
            <Space size={[0, 8]} wrap>
                {(doTypes || []).map((tag, index) => {
                    if (editInputIndex === index) {
                        return (
                            <Input
                                ref={editInputRef}
                                key={tag}
                                size="small"
                                style={tagInputStyle}
                                value={editInputValue}
                                onChange={handleEditInputChange}
                                onBlur={handleEditInputConfirm}
                                onPressEnter={handleEditInputConfirm}
                            />
                        );
                    }
                    const tagmaxLenght = 10
                    const isLongTag = tag.length > tagmaxLenght;
                    //const closable = dbUseIng.indexOf(index) == -1
                    const tagElem = (
                        <Button
                            key={tag}
                            size="small"
                            //closable={closable}
                            style={{ userSelect: 'none' }}
                        //onClose={() => handleClose(tag)}
                        >
                            <span
                                onDoubleClick={(e) => {
                                    setEditInputIndex(index);
                                    setEditInputValue(tag);
                                    e.preventDefault();
                                }}
                            >
                                {isLongTag ? `${tag.slice(0, tagmaxLenght - 1)}...` : tag}
                            </span>
                        </Button>
                    );
                    return isLongTag ? (
                        <Tooltip title={tag} key={tag}>
                            {tagElem}
                        </Tooltip>
                    ) : (
                        tagElem
                    );
                })}
            </Space>
            {inputVisible ? (
                <Input
                    ref={inputRef}
                    type="text"
                    size="small"
                    style={tagInputStyle}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                />
            ) : (
                <Button 
                style={tagPlusStyle} 
                size="small"
                onClick={showInput}>
                    <PlusOutlined /> New 用途
                </Button>
            )}
        </Space>
    );
};
export default App