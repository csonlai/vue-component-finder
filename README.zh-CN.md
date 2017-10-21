# vue-component-finder
vue-component-finder is a Chrome plugin for Vue project, which help developer preview component code module and locate code file in IDE quickly.

# Example
![插件展示][1]

1."template","script" and "style" tag of the component in code file and line number.
2. File path with line number the component was created
3. Component code file preview
4. Position of the component in html page

Open IDE with path clicked and locate the component file and code line:

![代码定位][2]

# Usage

1.Install loader and webpack plugin：
```
    npm install vue-component-finder-loader && npm install vue-component-finder-plugin
```
2.Use loader and webpack plugin in Vue project dev build:

Use loader：

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
Use webpack plugin and config IDE type and IDE path:
``` js
    var VueComponentFinderPlugin = require('vue-component-finder-plugin');

    plugins: [
        new VueComponentFinderPlugin({
            editor: 'sublime',
            cmd: 'E:\\Sublime Text 2\\sublime_text.exe'
        });
    ]
```

3.Install Chrome plugin vue-component-finder.crx

4.npm run dev, and open html page, when hover the Vue component, it will show code module info of component and locate component Vue file after path clicked



  [1]: http://p.qpic.cn/pic_wework/3832524150/beb84ab606969bfaf48d8997b870cfa549817938e8657f98/0
  [2]: http://p.qpic.cn/pic_wework/3832524150/b3b547bb07efdf6682e4d13f9bdd5c939537ac9915842d7d/0
