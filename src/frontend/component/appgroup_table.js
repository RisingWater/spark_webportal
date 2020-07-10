import React from 'react';
import 'antd/dist/antd.css';
import { Table, Button, Popconfirm, Input, Modal, Avatar, Divider, Form, Select ,Upload, Icon, InputNumber } from 'antd';
import $ from 'jquery';

class AppFormTemplate extends React.Component {
    normFile(e) {
        console.log(e);
        if (Array.isArray(e)) {
            return e;
        }

        if (e.file.status == 'done') {
            return e.file.response.url;
        } else {
            return "/appicon/default_icon.png";
        }
    };

    render () {
        const { getFieldDecorator } = this.props.form;
        var component = (
            <Form layout="vertical">
                <Form.Item label="应用名称">
                    {getFieldDecorator('appname', {rules: [{ required: true, message: '应用组名称不能为空' }]})
                    (<Input placeholder="请输入应用名称"/>)}
                </Form.Item>
                <Form.Item label="应用图标">
                    {getFieldDecorator('appicon',
                        {rules: [{ required: true, message: '应用图标不能为空', type: "string" }],
                         getValueFromEvent: this.normFile.bind(this)})(
                        <Upload name="logo" 
                            accept= ".png"
                            action="/uploadicon"
                            listType="picture">
                            <Button>
                                <Icon type="upload" />点击上传应用图标
                            </Button>
                        </Upload>,
                    )}
                </Form.Item>
                <Form.Item label="应用关联mimetype">
                    {getFieldDecorator('mimetype')
                    (<Input placeholder="请输入应用关联mimetype"/>)}
                </Form.Item>
                <Form.Item label="应用路径">
                    {getFieldDecorator('apppath', {rules: [{ required: true, message: '应用路径不能为空' }]})(
                    <Input placeholder="请输入应用路径"/>)}
                </Form.Item>
            </Form>
        );
        return component;
    }
}

class AppTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { dataSource: [], 
            visible: false,
            select_app : { appid: "", appname: "", appicon : "", mimetype : "", apppath : ""},
            confirmLoading : false,
        };
    }

    get_columns() {
        return (
            [
                { title: '云应用名称', dataIndex: 'appname' },
                { title: '云应用图标',
                    dataIndex: 'appicon',
                    render: (text, record) => (
                        <span>
                            <Avatar shape="square" size={32} src={record.appicon} />
                        </span>
                    )
                },
                { title: '云应用关联mimetype', dataIndex: 'mimetype' },
                { title: '云应用可执行文件路径', dataIndex: 'apppath' },
                { title: '操作',
                    key: 'action',
                    width: '20%',
                    render: (text, record) => (
                        <span>
                            <Popconfirm title="确认删除" onConfirm={() => this.DeleteData(record.appid)}>
                            <Button type='danger'>删除应用</Button>
                            </Popconfirm>
                        </span>
                    ),
                },
            ]
        );
    }

    componentDidMount() {
        this.RefreshData();
    }

    RefreshData() {
        console.log("RefreshData2");
        var url = "adminPortal/appgroup/" + this.props.appgroup_id + "/list_app"
        console.log(url);
        $.ajax({
            type: "get",
            url:  url,
            contentType: "application/json",
            success: (data, status) => {
                if (status == "success") {
                    this.setState({ dataSource : data });
                    console.log(this.state.dataSource);
                }
            }
        });
    }

    DeleteData(key) {
        var json = { "appid": key };
        var url = "adminPortal/appgroup/" + this.props.appgroup_id + "/del"
        $.ajax({
            type: "post",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(json),
            success: (data, status) => {
                if (status == "success") {
                    this.RefreshData();
                }
            }
        });
    };

    ShowAddDialog() {
        this.setState({visible: true,
            select_app : { appid:"", appname: "", appicon : "", mimetype : "", apppath : ""}});
    };

    DialogClickOk(e) {
        this.formRef.props.form.validateFields((err, values) => {
            if (err != null) {
                return;
            } else {
                this.setState({confirmLoading: true});
                var json = JSON.stringify({appid: this.state.select_app.appid,
                    appname: values.appname,
                    appicon : values.appicon,
                    mimetype : values.mimetype,
                    apppath : values.apppath});

                console.log(json);
                var url = "adminPortal/appgroup/" + this.props.appgroup_id + "/add"
                $.ajax({
                    type: "post",
                    url: url,
                    contentType: "application/json",
                    data: json,
                    async : false,
                    success: (data, status) => {
                        if (status == "success") {
                            this.RefreshData();
                        }
                    }
                });

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
        const AppFrom = Form.create({
             name: 'AppDialog',
             mapPropsToFields: (props) => {
                return {
                    appname: Form.createFormField({
                        value: props.select_app.appname,
                    }),
                    appicon: Form.createFormField({
                        value: props.select_app.appicon,
                    }),
                    mimetype: Form.createFormField({
                        value: props.select_app.mimetype,
                    }),
                    apppath: Form.createFormField({
                        value: props.select_app.apppath,
                    }),
                };
            }
            })(AppFormTemplate);

        return ( <AppFrom select_app={this.state.select_app}
             wrappedComponentRef={this.saveFormRef.bind(this)}/> );
    }


    render() {
        return (<div>
            <Button type = "primary" 
                onClick = {this.ShowAddDialog.bind(this)}
                style = {{ marginBottom: 16 }}>
                添加应用
            </Button>
            <Table columns={this.get_columns()}
                dataSource={this.state.dataSource}
                pagination={false} />
            <Modal title = "添加云应用" 
                visible = {this.state.visible} 
                onOk = {this.DialogClickOk.bind(this)} 
                onCancel = {this.DialogClickCancel.bind(this)}
                confirmLoading = {this.state.confirmLoading}>
                {this.DialogComponent()}
            </Modal>
        </div>);
    }
}

class AppGroupFormTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            delayLogoutTimeDisable : (this.props.select_appgroup.delayLogout == '0')
        };
    }

    delayLogoutChange(value) {
        this.setState({ delayLogoutTimeDisable : (value == '0') })
    };

    render () {
        const { getFieldDecorator } = this.props.form;
        var component = (
            <Form layout="vertical">
                <Form.Item label="应用组名称">
                    {getFieldDecorator('friendly_name', {rules: [{ required: true, message: '应用组名称不能为空' }]})
                    (<Input placeholder="请输入应用组名称"/>)}
                </Form.Item>
                <Form.Item label="应用服务器地址">
                    {getFieldDecorator('app_server', {rules: [{ required: true, message: '应用服务器地址不能为空' }]})(
                    <Input placeholder="请输入服务器地址"/>)}
                </Form.Item>
                <Form.Item label="是否使用VDI模式">
                    {getFieldDecorator('vdi_mode')(
                    <Select>
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
                    </Select>)}
                </Form.Item>
                <Form.Item label="是否延迟注销">
                    {getFieldDecorator('delayLogout')(
                    <Select onChange={this.delayLogoutChange.bind(this)}>
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
                    </Select>)}
                </Form.Item>
                <Form.Item label="延迟注销时间">
                    {getFieldDecorator('delayLogoutTime')(
                    <InputNumber min={0} disabled={this.state.delayLogoutTimeDisable}/>)}
                </Form.Item>
                <Form.Item label="会话断开策略">
                    {getFieldDecorator('disconnectedPolicy')(
                    <Select>
                        <Option value="0">始终保持连接不断开</Option>
                        <Option value="1">所有窗体关闭时断开</Option>
                        <Option value="2">所有应用退出时断开</Option>
                    </Select>)}
                </Form.Item>
            </Form>
        );
        return component;
    }
}

export class AppGroupTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { dataSource: [], 
            visible: false,
            modelTitle : "",
            select_appgroup : { appgroup_id: "", friendly_name: "", app_server : "", vdi_mode : "", delayLogout : "", delayLogoutTime : "", disconnectedPolicy : ""},
            insert_new : false,
            confirmLoading : false,
        };
    }

    getColumns() {
        return (
            [
                {
                    title: '应用组名称',
                    dataIndex: 'friendly_name',
                },
                {
                    title: '应用服务器地址',
                    dataIndex: 'app_server',
                },
                {
                    title: 'vdi模式',
                    dataIndex: 'vdi_mode',
                    render: (text, record) => (
                        <span>{record.delayLogout == 0 ? "关闭" : "开启"}</span>
                    ),
                },
                {
                    title: '延迟注销',
                    dataIndex: 'delayLogout',
                    render: (text, record) => (
                        <span>{record.delayLogout == 0 ? "关闭" : "开启"}</span>
                    ),
                },
                {
                    title: '延迟注销时间',
                    dataIndex: 'delayLogoutTime',
                    render: (text, record) => (
                        <span>{record.delayLogout == 0 ? "关闭" : (record.delayLogoutTime + "分钟")}</span>
                    ),
                },
                {
                    title: '会话断开策略',
                    dataIndex: 'disconnectedPolicy',
                    render: (text, record) => (
                        <span>{record.disconnectedPolicy == 0 ? "始终保持连接不断开" : (record.disconnectedPolicy == 1 ? "所有窗体关闭时断开" : "所有应用退出时断开")}</span>
                    ),
                },
                {
                    title: '操作',
                    key: 'action',
                    width: '20%',
                    render: (text, record) => (
                        <span>
                            <Button type='primary' onClick={() => this.ShowModifyDialog(record)}>修改</Button>
                            <Divider type='vertical'/>
                            <Popconfirm title="确认删除" onConfirm={() => this.DeleteData(record.appgroup_id)}>
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
            url:  "adminPortal/appgroup/list",
            contentType: "application/json",
            success: (data, status) => {
                if (status == "success") {
                    this.setState({ dataSource : data });
                }
            }
        });
    }

    DeleteData(key) {
        var json = { "appgroup_id": key };
        $.ajax({
            type: "post",
            url:  "adminPortal/appgroup/del",
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
            modelTitle : "添加新应用组",
            select_appgroup : { appgroup_id:"",
                friendly_name: "",
                app_server : "",
                vdi_mode : "0",
                delayLogout : "1",
                delayLogoutTime : "30",
                disconnectedPolicy : "0"}});
    };

    ShowModifyDialog(data) {
        this.setState({visible: true,
            insert_new : false,
            modelTitle : "修改应用组信息",
            select_appgroup : { appgroup_id: data.appgroup_id, 
                friendly_name: data.friendly_name,
                app_server : data.app_server,
                vdi_mode : data.vdi_mode,
                delayLogout : data.delayLogout,
                delayLogoutTime : data.delayLogoutTime,
                disconnectedPolicy : data.disconnectedPolicy}});
    };

    DialogClickOk(e) {
        console.log("DialogClickOk");
        this.formRef.props.form.validateFields((err, values) => {
            if (err != null) {
                return;
            } else {
                this.setState({confirmLoading: true});
                var json = JSON.stringify({appgroup_id: this.state.select_appgroup.appgroup_id,
                    friendly_name: values.friendly_name,
                    app_server : values.app_server,
                    vdi_mode : values.vdi_mode,
                    delayLogout : values.delayLogout,
                    delayLogoutTime : values.delayLogoutTime,
                    disconnectedPolicy : values.disconnectedPolicy});

                console.log(json);
                if (this.state.insert_new) {
                    console.log("insert new appgroup");
                    $.ajax({
                        type: "post",
                        url:  "adminPortal/appgroup/add",
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
                    console.log("update appgroup");
                    $.ajax({
                        type: "post",
                        url:  "adminPortal/appgroup/update",
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
        const AppGroupFrom = Form.create({
             name: 'AppgroupDialog',
             mapPropsToFields: (props) => {
                return {
                    friendly_name: Form.createFormField({
                        value: props.select_appgroup.friendly_name,
                    }),
                    app_server: Form.createFormField({
                        value: props.select_appgroup.app_server,
                    }),
                    vdi_mode: Form.createFormField({
                        value: props.select_appgroup.vdi_mode,
                    }),
                    delayLogout: Form.createFormField({
                        value: props.select_appgroup.delayLogout,
                    }),
                    delayLogoutTime: Form.createFormField({
                        value: props.select_appgroup.delayLogoutTime,
                    }),
                    disconnectedPolicy: Form.createFormField({
                        value: props.select_appgroup.disconnectedPolicy,
                    }),
                };
            }
            })(AppGroupFormTemplate);
        return ( <AppGroupFrom select_appgroup={this.state.select_appgroup}
             wrappedComponentRef={this.saveFormRef.bind(this)}/> );
    }

    expandedRowRender(record) {
        return (<AppTable appgroup_id={record.appgroup_id}/>)
    };

    render() {
        return (
            <div>
                <Button type = "primary"
                    onClick = {this.ShowAddDialog.bind(this)}
                    style = {{ marginBottom: 16 }}> 
                    添加应用组
                </Button>
                <Table columns = {this.getColumns()}
                    dataSource = {this.state.dataSource}
                    expandedRowRender={this.expandedRowRender.bind(this)} />
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
