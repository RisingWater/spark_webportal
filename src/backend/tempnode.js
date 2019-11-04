<div>
            <div style={{marginBottom : 8}}>
                域：
            </div>
            <div style={{marginBottom : 16}}>
                <Input ref="domain_inputer" placeholder="输入新用户所属的域"/>
            </div>
            <div style={{marginBottom : 8}}>
                用户名：
            </div>
            <div style={{marginBottom : 16}}>
                <Input ref="username_inputer" placeholder="新用户的用户名"/>
            </div>
            <div style={{marginBottom : 8}}>
                密码：
            </div>
            <div style={{marginBottom : 16}}>
                <Input ref="password_inputer" placeholder="新用户的密码"/>
            </div>
            <div style={{marginBottom : 8}}>
                关联应用组：
            </div>
            <div style={{marginBottom : 16}}>
                <Dropdown overlay={this.AppGroupListMenu()} placement="bottomLeft">
                    <Button>关联的应用组 <Icon type="down" /></Button>
                </Dropdown>
            </div>
            </div>