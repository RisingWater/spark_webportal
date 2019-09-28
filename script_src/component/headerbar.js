import React from 'react';
import 'antd/dist/antd.css';
import { Layout, Menu } from 'antd';

export class HeaderBar extends React.Component {
    render() {
        return (
            <Layout.Header className="header">
                <div className="logo" />
                <span className="logo_title">{this.props.title}</span>
            </Layout.Header>
        )
    }
}