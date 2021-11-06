# 宫子恰布丁-Vue重构版

## 介绍

宫子恰布丁-Vue重构版本。

这是利用Vue框架进行重构后的一个版本，后端也进行了很多的优化和重构，原来做的[原生HTML版本](https://gitee.com/swsk33/MiyakoEatPuddings)已不再维护。

该游戏为太空入侵者改版，前端使用Vue框架编写，后端使用Spring Boot + MyBatis。

## 游戏网址

[点击进入](https://miyakogame.swsk33-site.fun/)

## 关于服务器部署

如果你想将该游戏部署到自己的服务器，请根据下列步骤完成。

首先确定你的**电脑**安装并配置好了以下软件：

- JDK 11 或者其以上版本
- maven
- nodejs，并已经安装了vue-cli

可以在cmd依次测试以下命令，如果**没有**提示`'xxx'不是内部或外部命令，也不是可运行的程序或批处理文件。`之类的错误，说明都安装成功了：

```bash
javac -version
mvn -version
npm -v
vue -V
```

然后确定你的**服务器**安装了以下软件：

- Java 11 或者其以上版本运行环境
- MySQL数据库
- Redis数据库

确定全部安装配置完成后，就可以开始部署了。

### 1，克隆项目至本地

### 2，构建前端Vue代码

使用`cd`命令，进入项目文件夹中的`web-vue`目录下，这里是前端Vue工程的目录，依次执行以下命令进行构建：

```bash
npm install
npm run build
```

等待构建完成，该目录下会生成一个名为`dist`的文件夹，这就是编译好了的内容。

> 如果安装了cnpm，那么建议第一条命令使用`cnpm install`来代替

### 3，将前端代码放进Spring Boot

将刚刚生成的`dist`目录下的全部内容复制到`项目文件夹/server-springboot/resource/web`目录下。

### 4，修改Spring Boot配置文件

在配置之前，Spring Boot的一些配置可能需要修改。配置文件位于`项目文件夹/server-springboot/resource/config`目录下，首先修改`config.properties`文件，将里面的`spring.profiles.active`配置项的值由`dev`改为`prod`。

然后修改`config-prod.properties`文件，按照里面的注释提示，把数据库地址修改为自己的数据库地址，需要有MySQL和Redis数据库。以及需要配置一个邮箱，用于发送邮件验证码。其余配置按需修改。

如果需要开启https，那么将其中`miyako.server.enablehttps`的值改为`true`，并将`# SSL证书设置`下面三项的注释去掉，按照提示填上你的证书位置和密码。证书位置可以是`classpath`路径，也可以是`file`路径。若不明白这两个路径可以参考：[网址](https://juejin.cn/post/6989109110172024840)

### 5，初始化数据库

使用命令行或者工具连接你的MySQL数据库，先创建`database`名为`miyakogame`：

```sql
create database miyakogame;
use miyakogame;
```

然后使用`source`命令执行`项目文件夹/server-springboot/resource/sql/initUsers.sql`文件以初始化数据库表。

### 6，构建Spring Boot应用程序

使用`cd`命令，进入`项目文件夹/server-springboot`目录下，这里是后端Spring Boot的工程目录，执行命令进行构建：

```bash
mvn clean package
```

出现`BUILD SUCCESS`说明构建成功。

然后把`项目文件夹/server-springboot/target/miyakogame-vue-x.x.x.jar`文件（x表示版本号）和`项目文件夹/server-springboot`目录下的`resource`文件夹一起复制到一个文件夹中，将其上传至服务器。

### 7，运行Spring Boot

上传至服务器完成，就可以运行程序了。

使用ssh连接服务器，使用`cd`命令进入到你刚刚上传的jar文件所在目录下，执行命令：

```bash
java -jar miyakogame-vue-x.x.x.jar
```

x为版本号，jar文件名字也可以自行修改。

一定要确保`jar`文件和`resource`文件夹两者在同一个目录下！

运行起来之后，访问服务器地址即可！

可以使用`screen`命令将其挂在服务器后台运行。

`resource`文件夹中并非全部文件是必须的，其中的以下文件可以删除：

- 文件夹`sql`
- 文件`web/说明.txt`

> 最后更新：2021.11.6
