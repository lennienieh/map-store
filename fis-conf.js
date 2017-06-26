// 编译支持 amd 规范
// npm install -g fis3-hook-amd
fis.hook('amd');
// 依赖组件加载支持
// npm install -g fis3-postpackager-loader
fis.match('::package', {
    postpackager: fis.plugin('loader', {})
});

fis.match('**.{md}', { //所有md后缀的文件
    release: false //不发布
});

fis.match('/components/**', {
    isMod: true
});

fis.match('/components/**.js', {
    packTo: '/static/app.js',
    optimizer: fis.plugin('uglify-js')
}).match('/css/**', {
    useHash: true,
    optimizer: fis.plugin('clean-css')
}).match('/static/**', {
    useHash: true
})

// 开发环境
fis.media('dev').match('/components/ctrls/**.js', {
    packTo: '/static/ctrl.js'
}).match('/components/services/*.js', {
    packTo: '/static/service.js'
}).match('/components/directives/*.js', {
    packTo: '/static/directive.js'
}).match('/components/constants/*.js', {
    packTo: '/static/constant.js'
});