简易接入系统部署文档

1）安装nodejs
前往nodejs 官方网站下载最新版本的Windows安装包，网址如下：
https://nodejs.org/en/
注意要下载长期支持版(LTS版本)，目前最新的长期支持版位12.13.0 LTS。

![Image text](https://github.com/RisingWater/spark_webportal/raw/master/readme_image/1.png)

下载完成后，双击运行安装，一路无脑下一步，即可完成

![Image text](https://github.com/RisingWater/spark_webportal/raw/master/readme_image/2.png)

2）下载简易接入系统，并安装
前往github上下载最新的简易接入系统代码。
下载地址为：
https://github.com/RisingWater/spark_webportal

![Image text](https://github.com/RisingWater/spark_webportal/raw/master/readme_image/3.png)

将下载后的压缩包解压（以防万一，不要放在中文路径下）到安装目录下

![Image text](https://github.com/RisingWater/spark_webportal/raw/master/readme_image/4.png)

开一个cmd或者powershell，cd到安装目录下，运行npm install
此时会从网络上下载该系统所有的依赖项，请保障网络畅通，与磁盘空间足够（估计要下载100MB到200MB的东西），如果网络不稳定失败，没有关系，再运行一次npm install即可。

![Image text](https://github.com/RisingWater/spark_webportal/raw/master/readme_image/5.png)

3）修改服务器的配置文件
修改到安装目录下db/server_config.json
其中listen_port为web服务器使用的端口

![Image text](https://github.com/RisingWater/spark_webportal/raw/master/readme_image/6.png)
 
4）手动运行，或者配置为系统服务
手动运行很简单，使用cmd或者powershell到安装目录下
运行npm start，即可启动web服务器，就可以在配置的端口上访问web服务器了。

![Image text](https://github.com/RisingWater/spark_webportal/raw/master/readme_image/7.png)
 
也可以配置为系统服务，系统服务会随着开机自动启动。
配置方式为，使用cmd或者powershell到安装目录下，运行node winServer.js

![Image text](https://github.com/RisingWater/spark_webportal/raw/master/readme_image/8.png)
 
运行成功后，会添加一个系统服务，之后便可以用windows系统的服务管理器进行管理了。

![Image text](https://github.com/RisingWater/spark_webportal/raw/master/readme_image/9.png)

5）使用简易接入系统

![Image text](https://github.com/RisingWater/spark_webportal/raw/master/readme_image/10.png)

Adminportal.html为管理配置界面，需要手动输入完整路径才可以访问这个页面。
而默认跳转到Login.html，可以使用web浏览器来登陆并使用应用发布的功能（可以用来测试发布是否成功）。目前还不支持桌面登陆，可以坐等该系统更新。

![Image text](https://github.com/RisingWater/spark_webportal/raw/master/readme_image/11.png)

正确的发布新应用的流程，应该是
先到Adminportal.html 下添加应用组，然后再应用组中添加应用，然后在添加桌面组（不需要添加桌面），之后添加用户，并选择用户关联到的应用组和桌面组。
添加好到Login.html下看看是否发布成功。如果ok，就可以使用国产化终端来登陆测试了。


