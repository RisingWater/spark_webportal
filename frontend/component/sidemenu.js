import React from 'react';
import 'antd/dist/antd.css';
import { Layout, Menu } from 'antd';

export class SideMenu extends React.Component {
    onSelectChange(selectEvent) {
        this.props.menuSelectedChange(selectEvent.key);
    }

    getMenus() {
        return (
            this.props.menus.map((value, i) => {
                return (<Menu.Item disabled={value.disable} key={value.key}>{value.name}</Menu.Item>)
            })
        )
    }

    render() {
        return (
            <Layout.Sider width={150} style={{ background: '#fff' }}>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={this.props.selectKey} style={{ height: '100%', borderRight: 0 }} onSelect={this.onSelectChange.bind(this)}>
                    {this.getMenus()}
                </Menu>
            </Layout.Sider>
        )
    }
}