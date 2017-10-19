(function(){
    var mask;
    var maskRect;
    var info;
    var infoRect;
    var code;
    var currentTemplatePath;
    var currentLineIndex;
    var offsetCount = 5;
    var port = 8493;
    var protocol = window.location.protocol;
    var timeId;


    function request(url,cb){
        var xmlHttpReq = new XMLHttpRequest();
        xmlHttpReq.open('GET', url);
        xmlHttpReq.send(null);
        xmlHttpReq.onreadystatechange = function () {
            if(xmlHttpReq.readyState === 4){
                cb && cb(xmlHttpReq.responseText);
            }
        }
    }

    function fectchContent(path,type){
        var url = chrome.extension.getURL(path);
        request(url,function(content){
            var s = document.createElement(type);
            s.innerHTML = content;
            document.getElementsByTagName('head')[0].appendChild(s);
        });
    }

    fectchContent('index.css','style');
    fectchContent('highlight.css','style');

    function getCodeContent (contentList , viewLineCount, viewLineLastCount) {
        if (!contentList) return '';
        var dCount = 0;
        var startCount, endCount;

        startCount = Math.max(1, viewLineCount - offsetCount);

        endCount = startCount + offsetCount * 2 - 1;

        var codeArr = [];
        for (var i = 0; i < contentList.length; i++) {
            var lineCount = i + 1;
            var newCodeLine;
            var lineText;
            var lineElement = document.createElement('p');

            if (lineCount >= startCount && lineCount <= endCount){
                lineText = '<span class="vfinder-line-count">' + lineCount + ':</span>' + contentList[i];
                // 当前行
                if (lineCount >= viewLineCount && (viewLineLastCount == null || lineCount <= viewLineLastCount)) {
                    lineElement.className = 'vfinder-current-code-line';
                }
                lineElement.innerHTML = lineText;
                codeArr.push('<pre><code>' + lineElement.outerHTML + '</code></pre>');
            }
        }
        return codeArr.join('');
    }


    function setCode (path, linkElement) {
        if (!code) {
            code = document.createElement('div');
            code.className = 'vfinder-code';
            document.body.appendChild(code);
        }
        code.style.display = 'block';
        request(protocol + '//localhost:' + port + '?view=' + encodeURIComponent(path) + '&count=' + (offsetCount * 2), function(data) {
            var contentList;
            var codeRect;
            var viewLineCount;
            var codeContent;
            var lastIndex = linkElement.getAttribute('data-last-index');
            var codeElement = document.createElement('div');
            codeElement.className = 'vfinder-code-content';
            var dataType = linkElement.getAttribute('data-type');
            if (data) {
                data = JSON.parse(data);
                contentList = data.contentList;
                viewLineCount = data.viewLineCount;
            }

            infoRect = info.getBoundingClientRect();
            // 显示的代码片段内容
            codeContent = getCodeContent(contentList , viewLineCount,  lastIndex === '' ? null : Number(lastIndex) + 1);


            codeElement.innerHTML = codeContent;
            code.innerHTML = `<div class="vfinder-path"><span>${path}</span></div>`;
            code.appendChild(codeElement);

            codeRect = code.getBoundingClientRect();

            var linkRect = linkElement.getBoundingClientRect();

            code.style.left = infoRect.left + (infoRect.width - codeRect.width) / 2 + 'px';

            if (infoRect.right + codeRect.width > window.innerWidth) {
                code.style.left = infoRect.left - codeRect.width + 20 + 'px';
            } 
            else {
                code.style.left = infoRect.left + infoRect.width - 20 + 'px';
            }
            if (infoRect.top + codeRect.height > window.innerHeight) {
                code.style.top = window.innerHeight - codeRect.height - 20 + 'px';
            }
            else {
                code.style.top = linkRect.top - 30 + 'px';
            }
        });
    }


    function setMask (target) {
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var top;
        var left;

        if (!mask) {
            mask = document.createElement('div');
            mask.className = 'vfinder-mask';
            document.body.appendChild(mask);
        }
        maskRect = target.getBoundingClientRect();

        mask.style.display = 'block';
        mask.style.left = maskRect.left + 'px';
        mask.style.top = maskRect.top + 'px';
        mask.style.width = maskRect.width + 'px';
        mask.style.height = maskRect.height + 'px';


        if (!info) {
            info = document.createElement('div');
            info.className = 'vfinder-info';
            bindInfoClick(info);
            bindInfoHover(info);
            document.body.appendChild(info);
        }

        info.style.display = 'block';


        info.innerHTML = createSingleLink('template', target)
                       + createSingleLink('script', target)
                       + createSingleLink('style', target)
                       + createSingleLink('created', target, currentLineIndex);

        infoRect = info.getBoundingClientRect();
        // 超出右边界
        if (maskRect.right + infoRect.width > windowWidth) {
            info.style.right = 20 + 'px';
            info.style.left = 'auto';
        }
        else {
            info.style.left = maskRect.right - Math.min(30, (maskRect.width * 0.1)) + 'px';
            info.style.right = 'auto';
        }
        if (infoRect.height > maskRect.height) {
            top = maskRect.top + ((maskRect.height - infoRect.height) / 2);
        }
        else {
            top = maskRect.top + (Math.min(30, maskRect.height * 0.1));
        }
        if (top + infoRect.height > windowHeight) {
            top = windowHeight - infoRect.height - 10;
        }
        else if (top < 0) {
            top = 10;
        }
        info.style.top = top + 'px';

    }

    function bindInfoHover (info) {
        info.addEventListener('mouseover', function(e){
            var target = e.target;
            if (target.tagName === 'A') {
                setCode(target.getAttribute("data-path"), target);
            }
        });
    }

    function createSingleLink (name, target) {
        var path = target.getAttribute('data-' + name + '-path');
        var lineIndex;

        if (!path) {
            return '';
        }

        if (name === 'created') {
            lineIndex = target.getAttribute('data-created-index');
        }
        var lastLineIndex = target.getAttribute('data-' + name + '-last-index');

        path = lineIndex == null ? path : path + ':' + (Number(lineIndex) + 1);
        var fileName = path.replace(/^.*[\\\/]/, '');
        return `<div><span class="vfinder-info-name-${name}">${name}：</span><a href="javascript:" data-type="${name}" data-last-index="${lastLineIndex}" data-path="${path}">${fileName}</a></div>`;
    }

    function bindInfoClick (info) {
        info.addEventListener('mousedown', function(e){
            var target = e.target;
            var path = target.getAttribute('data-path');
            if (path) {
                request(protocol + '//localhost:8493?open=' + encodeURIComponent(path));
            }
        });
    }


    function getComponentElement (target) {
        if (!target) return;
        while(target && target.getAttribute) {
            var templatePath = target.getAttribute('data-template-path');
            var parentTemplatePath = target.getAttribute('data-parent-template-path');
            if (templatePath || parentTemplatePath) {
                currentTemplatePath = templatePath;

                return target;
            }
            target = target.parentNode;
        }
    }


    document.addEventListener('mouseover',function(e){
        debugger;
        var target = e.target;
        if ((info && info.contains(target)) || (code && code.contains(target))) {
            return;
        }
        if (code) {
           code.style.display = 'none';
        }
        target = getComponentElement(target);
        if (!target) {
            if (mask) {
                currentTemplatePath = null;
                mask.style.display = info.style.display = 'none';
            }
            return;
        }
        setMask(target);
    });
})();





