import React from 'react';
import 'antd/dist/antd.css';
import { Table, Button, Popconfirm, Input, Modal, Avatar, Divider, Form, Select ,Upload, Icon, InputNumber } from 'antd';
import $ from 'jquery';

class DesktopFormTemplate extends React.Component {
    render () {
        const { getFieldDecorator } = this.props.form;
        var component = (
            <Form layout="vertical">
                <Form.Item label="云桌面名称">
                    {getFieldDecorator('desktop_name', {rules: [{ required: true, message: '桌面组名称不能为空' }]})
                    (<Input placeholder="请输入云桌面名称"/>)}
                </Form.Item>
                <Form.Item label="云桌面IP">
                    {getFieldDecorator('desktop_ip', {rules: [{ required: true, message: '桌面IP不能为空' }]})(
                    <Input placeholder="请输入云桌面IP"/>)}
                </Form.Item>
                <Form.Item label="是否使用VDI模式">
                    {getFieldDecorator('vdi_mode')(
                    <Select>
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
                    </Select>)}
                </Form.Item>
            </Form>
        );
        return component;
    }
}

class DesktopTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { dataSource: [], 
            visible: false,
            select_desktop : { desktop_id: "", desktop_name: "", vdi_mode : "", desktop_ip : ""},
            confirmLoading : false,
        };
    }

    get_columns() {
        return (
            [
                { title: '云桌面名称', dataIndex: 'desktop_name' },
                { title: '云桌面IP', dataIndex: 'desktop_ip' },
                {
                    title: 'vdi模式',
                    dataIndex: 'vdi_mode',
                    render: (text, record) => (
                        <span>{record.delayLogout == 0 ? "关闭" : "开启"}</span>
                    ),
                },
                { title: '操作',
                    key: 'action',
                    width: '20%',
                    render: (text, record) => (
                        <span>
                            <Popconfirm title="确认删除" onConfirm={() => this.DeleteData(record.desktop_id)}>
                            <Button type='danger'>删除云桌面</Button>
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
        var url = "adminPortal/desktopgroup/" + this.props.desktopgroup_id + "/list_desktop"
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
        var json = { "desktop_id": key };
        var url = "adminPortal/desktopgroup/" + this.props.desktopgroup_id + "/del"
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
            select_desktop : { desktop_id:"", desktop_name: "", desktop_ip : "", vdi_mode : "1"}});
    };

    DialogClickOk(e) {
        this.formRef.props.form.validateFields((err, values) => {
            if (err != null) {
                return;
            } else {
                this.setState({confirmLoading: true});
                console.log(values);
                var json = JSON.stringify({desktop_id: this.state.select_desktop.desktop_id,
                    desktop_name : values.desktop_name,
                    vdi_mode : values.vdi_mode,
                    desktop_ip : values.desktop_ip});

                console.log(json);
                var url = "adminPortal/desktopgroup/" + this.props.desktopgroup_id + "/add"
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
        const DesktopFrom = Form.create({
             name: 'DesktopDialog',
             mapPropsToFields: (props) => {
                return {
                    desktop_name: Form.createFormField({
                        value: props.select_desktop.desktop_name,
                    }),
                    vdi_mode: Form.createFormField({
                        value: props.select_desktop.vdi_mode,
                    }),
                    desktop_ip: Form.createFormField({
                        value: props.select_desktop.desktop_ip,
                    }),
                };
            }
            })(DesktopFormTemplate);

        return ( <DesktopFrom select_desktop={this.state.select_desktop}
             wrappedComponentRef={this.saveFormRef.bind(this)}/> );
    }


    render() {
        return (<div>
            <Button type = "primary" 
                onClick = {this.ShowAddDialog.bind(this)}
                style = {{ marginBottom: 16 }}>
                添加桌面
            </Button>
            <Table columns={this.get_columns()}
                dataSource={this.state.dataSource}
                pagination={false} />
            <Modal title = "添加云桌面" 
                visible = {this.state.visible} 
                onOk = {this.DialogClickOk.bind(this)} 
                onCancel = {this.DialogClickCancel.bind(this)}
                confirmLoading = {this.state.confirmLoading}>
                {this.DialogComponent()}
            </Modal>
        </div>);
    }
}

class DesktopGroupFormTemplate extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        const { getFieldDecorator } = this.props.form;
        var component = (
            <Form layout="vertical">
                <Form.Item label="桌面组名称">
                    {getFieldDecorator('desktopgroup_name', {rules: [{ required: true, message: '桌面组名称不能为空' }]})
                    (<Input placeholder="请输入桌面组名称"/>)}
                </Form.Item>
            </Form>
        );
        return component;
    }
}

export class DesktopGroupTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { dataSource: [], 
            visible: false,
            modelTitle : "",
            select_desktopgroup : { desktopgroup_id: "", desktopgroup_name: "" },
            insert_new : false,
            confirmLoading : false,
        };
    }

    getColumns() {
        return (
            [
                {
                    title: '桌面组名称',
                    dataIndex: 'desktopgroup_name',
                },
                {
                    title: '操作',
                    key: 'action',
                    width: '20%',
                    render: (text, record) => (
                        <span>
                            <Button type='primary' onClick={() => this.ShowModifyDialog(record)}>修改</Button>
                            <Divider type='vertical'/>
                            <Popconfirm title="确认删除" onConfirm={() => this.DeleteData(record.desktopgroup_id)}>
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
            url:  "adminPortal/desktopgroup/list",
            contentType: "application/json",
            success: (data, status) => {
                if (status == "success") {
                    this.setState({ dataSource : data });
                }
            }
        });
    }

    DeleteData(key) {
        var json = { "desktopgroup_id": key };
        $.ajax({
            type: "post",
            url:  "adminPortal/desktopgroup/del",
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
            modelTitle : "添加新桌面组",
            select_desktopgroup : { desktopgroup_id: "",
                desktopgroup_name: ""}});
    };

    ShowModifyDialog(data) {
        this.setState({visible: true,
            insert_new : false,
            modelTitle : "修改桌面组信息",
            select_desktopgroup : { desktopgroup_id: data.desktopgroup_id, 
                desktopgroup_name: data.desktopgroup_name }});
    };

    DialogClickOk(e) {
        console.log("DialogClickOk");
        this.formRef.props.form.validateFields((err, values) => {
            if (err != null) {
                return;
            } else {
                this.setState({confirmLoading: true});
                var json = JSON.stringify({appgroup_id: this.state.select_desktopgroup.desktopgroup_id,
                    desktopgroup_name: values.desktopgroup_name});

                console.log(json);
                if (this.state.insert_new) {
                    console.log("insert new appgroup");
                    $.ajax({
                        type: "post",
                        url:  "adminPortal/desktopgroup/add",
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
                        url:  "adminPortal/desktopgroup/update",
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
        const DesktopGroupFrom = Form.create({
             name: 'DesktopgroupDialog',
             mapPropsToFields: (props) => {
                return {
                    desktopgroup_name: Form.createFormField({
                        value: props.select_desktopgroup.desktopgroup_name,
                    }),
                };
            }
            })(DesktopGroupFormTemplate);
        return ( <DesktopGroupFrom select_desktopgroup={this.state.select_desktopgroup}
             wrappedComponentRef={this.saveFormRef.bind(this)}/> );
    }

    expandedRowRender(record) {
        return (<DesktopTable desktopgroup_id={record.desktopgroup_id}/>)
    };

    render() {
        return (
            <div>
                <Button type = "primary"
                    onClick = {this.ShowAddDialog.bind(this)}
                    style = {{ marginBottom: 16 }}> 
                    添加桌面组
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
