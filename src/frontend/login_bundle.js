import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Form, Icon, Input, Button, Typography, Alert} from 'antd';
import $ from 'jquery';

import { HeaderBar } from './component/headerbar.js'

class NormalLoginFormTemplate extends React.Component {
    handleSubmit(e) {
        e.preventDefault();
        this.props.showError(false);
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                var json = { "username": values.username, "password": values.password };
                console.log(json);

                var userid = null;
                $.ajax({
                    type: "post",
                    url: "login",
                    contentType: "application/json",
                    async: false,
                    data: JSON.stringify(json),
                    success: function (data, status) {
                        if (status == "success") {
                            userid = data.userid;
                        }
                    }
                })

                if (userid == null)
                {
                    this.props.showError(true);
                    return;
                }

                console.log("userid2: " + userid);
                
                window.location.href = "./userportal.html?userid=" + userid;
            }
        });
    };
  
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
                <Form.Item>
                    {getFieldDecorator('username', {rules: [{ required: true, message: '请输入用户名!' }]})(
                        <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入用户名"/>,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {rules: [{ required: true, message: '请输入密码!' }]})(
                        <Input.Password size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入密码" />,
                    )}
                </Form.Item>
                <Form.Item>
                    <Button size="large" type="primary" htmlType="submit" className="login-form-button">
                        登陆
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}
  

class RootContext extends React.Component {
    constructor(props,context) {
        super(props,context)
        this.state = {
            showError : false
        }
    }

    showError(on) {
        this.setState( {showError : on});
    }

    getAlert() {
        if (this.state.showError) {
            return (<div style={{marginBottom : 20}}><Alert message="登陆失败，请检查用户名和密码" type="error" showIcon closable/></div>);
        }
        else
        {
            return (<div/>);
        }
    }

    render() {
        const LoginForm = Form.create({ name: 'LoginForm' })(NormalLoginFormTemplate);

        return (
            <Layout>
                <HeaderBar/>
                <Layout>
                    <Layout.Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 1024}}>
                        <div className="login_div">
                            <Typography>
                                <Typography.Title>登陆</Typography.Title>
                            </Typography>                            
                            {this.getAlert()}
                            <LoginForm showError={this.showError.bind(this)}/>
                        </div>
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