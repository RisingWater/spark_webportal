import React from 'react';
import ReactDOM from 'react-dom';
import { Layout } from 'antd';
import { HeaderBar } from './component/headerbar.js'
import { SideMenu  } from './component/sideMenu.js'
import { UserTable } from './component/user_table.js'
import { AppGroupTable} from './component/appgroup_table.js'
import { DesktopGroupTable } from './component/desktopgroup_table.js'

class RootContext extends React.Component {
    constructor(props,context) {
        super(props,context)
        this.state = {
            menuSelectedkey : "1"
        };
    }

    onMenuSelectChange(key){
        var state = {"menuSelectedkey" : key};
        console.log(state);
        this.setState(state);
    }

    getTable() {
        if (this.state.menuSelectedkey == 1) {
            return (<UserTable/>);
        } else if (this.state.menuSelectedkey == 2) {
            return (<AppGroupTable/>);
        } else if (this.state.menuSelectedkey == 3) {
            return (<DesktopGroupTable/>);    
        } else {
            return (<div>{this.state.menuSelectedkey}</div>);
        }
    }

    render() {
        const Menus = [ { name : "用户管理", key : "1", disable: false}, { name : "应用管理", key : "2", disable: false}, { name : "桌面管理", key : "3", disable: false} ];
        return (
            <Layout>
                <HeaderBar title="简易接入管理平台"/>
                <Layout>
                    <SideMenu menuSelectedChange={this.onMenuSelectChange.bind(this)} menus={Menus} selectKey={['1']}/>
                    <Layout>
                        <Layout.Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 1024,}}>
                            {this.getTable()}
                        </Layout.Content>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}

ReactDOM.render(
    <RootContext/>,
    document.getElementById("root")
);