import React from 'react';
import 'antd/dist/antd.css';
import { Table, Button, Popconfirm, Input, Modal, Divider, Form, Select} from 'antd';
import $ from 'jquery';

class UserFormTemplate extends React.Component {
    render () {
        const { getFieldDecorator } = this.props.form;
        var component = (
            <Form layout="vertical">
                <Form.Item label="域">
                    {getFieldDecorator('domain')
                    (<Input placeholder="请输入用户所属的域"/>)}
                </Form.Item>
                <Form.Item label="用户名">
                    {getFieldDecorator('username', {rules: [{ required: true, message: '用户名不能为空' }]})(
                    <Input placeholder="请输入用户名"/>)}
                </Form.Item>
                <Form.Item label="密码">
                    {getFieldDecorator('password', {rules: [{ required: true, message: '密码不能为空' }]})(
                    <Input placeholder="请输入密码"/>)}
                </Form.Item>
                <Form.Item label="应用组">
                    {getFieldDecorator('appgroup_id', {rules: [{ required: true, message: '应用组不能为空' }]})(
                    <Select placeholder="请选择应用组" showSearch='true'>
                        {this.props.dataSource.map(function (value, i) {
                            return (<Option value={value.appgroup_id}>{value.friendly_name}</Option>)
                        })}
                    </Select>)}
                </Form.Item>
            </Form>
        );
        return component;
    }
}


export class UserTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { dataSource: [], 
            appGroupData: [],
            visible: false,
            modelTitle : "",
            select_user : { userid: "", domain: "", username : "", password : "", appgroup_id : ""},
            insert_new : false,
            confirmLoading : false,
        };
    }

    getColumns() {
        return (
            [
                {
                    title: '域名',
                    dataIndex: 'domain',
                },
                {
                    title: '用户名',
                    dataIndex: 'username',
                },
                {
                    title: '密码',
                    dataIndex: 'password',
                },
                {
                    title: '应用组',
                    dataIndex: 'appgroup_id',
                    width: '20%',
                    render: (text, record) => (
                        <span>
                            {this.state.appGroupData.map(function(value) {
                                if (value.appgroup_id == record.appgroup_id) {
                                    return value.friendly_name;
                                }
                            })}
                        </span>
                    )
                },
                {
                    title: '操作',
                    key: 'action',
                    width: '20%',
                    render: (text, record) => (
                        <span>
                            <Button type='primary' onClick={() => this.ShowModifyDialog(record)}>修改</Button>
                            <Divider type='vertical'/>
                            <Popconfirm title="确认删除" onConfirm={() => this.DeleteData(record.userid)}>
                            <Button type='danger'>删除</Button>
                            </Popconfirm>
                        </span>
                    ),
                },
            ]
        );
    }

    RefreshData() {
        $.ajax({
            type: "get",
            url:  "adminPortal/user/list",
            contentType: "application/json",
            success: (data, status) => {
                if (status == "success") {
                    this.setState({ dataSource : data });
                }
            }
        });

        $.ajax({
            type: "get",
            url:  "adminPortal/appgroup/list",
            contentType: "application/json",
            success: (data, status) => {
                if (status == "success") {
                    this.setState({ appGroupData : data });
                }
            }
        });
    }

    DeleteData(key) {
        var json = { "userid": key };
        $.ajax({
            type: "post",
            url:  "adminPortal/user/del",
            contentType: "application/json",
            data: JSON.stringify(json),
            success: (data, status) => {
                if (status == "success") {
                    this.RefreshData();
                }
            }
        });
    };

    componentDidMount() {
        this.RefreshData();
    }

    ShowAddDialog() {
        this.setState({visible: true,
            insert_new : true,
            modelTitle : "添加新用户",
            select_user : { userid:"", domain: "", username : "", password : "", appgroup_id: ""}});
    };

    ShowModifyDialog(data) {
        this.setState({visible: true,
            insert_new : false,
            modelTitle : "修改用户信息",
            select_user : { userid: data.userid, domain: data.domain, username : data.username, password : data.password, appgroup_id : data.appgroup_id}});
    };

    DialogFormChange(allFields) {
        console.log("DialogFormChange");
    };

    DialogClickOk(e) {
        console.log("DialogClickOk");
        this.formRef.props.form.validateFields((err, values) => {
            if (err != null) {
                return;
            } else {
                this.setState({confirmLoading: true});
                var json = JSON.stringify({userid: this.state.select_user.userid,
                    domain: values.domain,
                    username : values.username,
                    password : values.password,
                    appgroup_id : values.appgroup_id});
                if (this.state.insert_new) {
                    console.log("insert new user");
                    $.ajax({
                        type: "post",
                        url:  "adminPortal/user/add",
                        contentType: "application/json",
                        data: json,
                        async : false,
                        success: (data, status) => {
                            if (status == "success") {
                                this.RefreshData();
                            }
                        }
                    });
                } else {
                    console.log("update user");
                    $.ajax({
                        type: "post",
                        url:  "adminPortal/user/update",
                        contentType: "application/json",
                        data: json,
                        async : false,
                        success: (data, status) => {
                            if (status == "success") {
                                this.RefreshData();
                            }
                        }
                    });
                }

                this.setState({visible: false, confirmLoading: false});
            }
        });
    };

    DialogClickCancel(e) {
        this.setState({visible: false});
    };

    saveFormRef(formRef) {
        this.formRef = formRef;
    };

    DialogComponent() {
        const UserFrom = Form.create({
             name: 'UserDialog',
             onFieldsChange : (props, changedFields, allFields) => {
                props.onChange(allFields);
             },

             mapPropsToFields: (props) => {
                return {
                    domain: Form.createFormField({
                        value: props.select_user.domain,
                    }),
                    username: Form.createFormField({
                        value: props.select_user.username,
                    }),
                    password: Form.createFormField({
                        value: props.select_user.password,
                    }),
                    appgroup_id: Form.createFormField({
                        value: props.select_user.appgroup_id,
                    }),
                };
            }
            })(UserFormTemplate);
        return ( <UserFrom select_user={this.state.select_user}
             dataSource={this.state.appGroupData}
             onChange={this.DialogFormChange.bind(this)}
             wrappedComponentRef={this.saveFormRef.bind(this)}/> );
    }

    render() {
        return (
            <div>
                <Button type = "primary"
                    onClick = {this.ShowAddDialog.bind(this)}
                    style = {{ marginBottom: 16 }}> 
                    添加用户
                </Button>
                <Table columns = {this.getColumns()} dataSource = {this.state.dataSource} />
                <Modal title = {this.state.modelTitle} 
                    visible = {this.state.visible} 
                    onOk = {this.DialogClickOk.bind(this)} 
                    onCancel = {this.DialogClickCancel.bind(this)}
                    confirmLoading = {this.state.confirmLoading}>
                    {this.DialogComponent()}
                </Modal>
            </div>
        );
    }
}
