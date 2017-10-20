# vue-component-finder
vue-component-finder是一款用于Vue项目的代码模块预览与快速定位的chrome插件，对于文件目录繁多的vue项目，可以使用该插件快速查看组件对应的代码模块，以及快速打开IDE修改组件代码。

# 插件展示
![插件展示][1]


1.组件的template，script，style对应所在的文件以及其实行数
2.组件被创建的文件以及行数
3.文件代码预览
4.组件所在页面位置

# 代码定位
点击自动打开IDE，并定位到对应文件和对应的代码行：

![代码定位][2]

# 如何使用

1.安装对应的loader与webpack plugin：
```
    npm install vue-component-finder-loader && npm install vue-component-finder-plugin
```
2.在项目的dev构建中引入loader与plugin：

引入loader：

webpack 2.x:
``` js
    module: {
        rules: [{
            test: /\.(vue)$/,
            loader: 'vue-component-finder-loader',
            enforce: "pre",
            include: ['src']
        }]
    }
```
webpack 1.x:
``` js
    module: {
        preLoaders: [{
            test: /\.(vue)$/,
            loader: 'vue-component-finder-loader',
            include: ['src']
        }]
    }
```
引入plugin并配置对应IDE类型以及文件路径（sublime为例）:
``` js
    var VueComponentFinderPlugin = require('vue-component-finder-plugin');

    plugins: [
        new VueComponentFinderPlugin({
            editor: 'sublime',
            cmd: 'E:\\Sublime Text 2\\sublime_text.exe'
        });
    ]
```

3.安装chrome插件vue-component-finder.crx

4.运行项目开发构建npm run dev，打开页面，鼠标移动到组件区域即可展示对应模块详情，点击自动打开IDE展示对应组件文件内容。


  [1]: http://p.qpic.cn/pic_wework/3832524150/beb84ab606969bfaf48d8997b870cfa549817938e8657f98/0
  [2]: http://p.qpic.cn/pic_wework/3832524150/b3b547bb07efdf6682e4d13f9bdd5c939537ac9915842d7d/0
