import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Card, Row, Col } from 'antd';
import $ from 'jquery';

import { HeaderBar } from './component/headerbar.js'
import { SideMenu  } from './component/sideMenu.js'

class AppElement extends React.Component {

    connectApp() {
        console.log("connectApp " + this.props.data.appId);
        var url = "./vPortal/V1.0/userportal/controller-manage/app/" 
        + this.props.userid
        + "/" 
        + this.props.data.appId
        + "/connectParamIni";

        window.location.href = url;
    }

    render () {
        console.log(this.props.data);
        const { appResource } = this.props.data;
        return (
            <Card size="small"
                hoverable style={{ width: 128 }}
                cover={<img alt={this.props.decription} src={appResource.icon} onClick={this.connectApp.bind(this)}/>}
                bodyStyle={{padding : 2}}>
                <Card.Meta style={{"text-align" : "center"}} title={<h3>{appResource.name}</h3>} />
            </Card>
        );
    }
}

class RootContext extends React.Component {
    constructor(props) {
        super(props);
        this.state = { dataSource: [], 
            userid : this.getQueryVariable("userid"),
            menuSelectedkey : "2" };
    }

    componentDidMount() {
        console.log(this.props);
        this.RefreshData();
    }

    getQueryVariable(variable)
    {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0; i<vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
    
        return null;
    }

    RefreshData() {
        console.log("RefreshData");
        var url = "vPortal/V1.0/userportal/controller-manage/app/" + this.state.userid;
        console.log(url);
        $.ajax({
            type: "get",
            url:  url,
            contentType: "application/json",
            success: (data, status) => {
                if (status == "success") {
                    this.setState({ dataSource : data });
                }
            }
        });
    }

    onMenuSelectChange(key){
        var state = {"menuSelectedkey" : key};
        console.log(state);
        this.setState(state);
    }

    getApplist() {
        return (
            this.state.dataSource.map((value, i) => {
                return (
                    <Col xs={12} sm={8} md={4}>
                        <AppElement data={value} userid={this.state.userid}/>
                    </Col>
                );
            })
        )
    }

    render() {
        const Menus = [ { name : "云桌面", key : "1", disable: true}, { name : "云应用", key : "2", disable: false} ];
        return (
            <Layout>
                <HeaderBar title="简易接入平台"/>
                <Layout>
                    <SideMenu menuSelectedChange={this.onMenuSelectChange.bind(this)} menus={Menus} selectKey={['2']}/>
                    <Layout.Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 1024}}>
                        <Row gutter={32} type="flex" justify="center" align="center">
                            {this.getApplist()}
                        </Row>
                    </Layout.Content>
                </Layout>
            </Layout>
        );
    }
}

ReactDOM.render(
    <RootContext/>,
    document.getElementById("root")
);