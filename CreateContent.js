/**
 * 获取 #cnblogs_post_body 元素下的标题元素
 * 返回标题的数组
 * @returns [{tagName:'H1',text:'title',id:'title'},...]
 */
function getHeadsFromPost() {
    var c = document.getElementById('cnblogs_post_body').children;
    var data = [];
    for (var i = 0; i < c.length; i++) {
        if (/h\d/i.test(c[i].tagName)) {
            data.push({ tagName: c[i].tagName, text: c[i].innerText, id: c[i].id });
        }
    }
    return data;
}
/**
 * 将标题的数组转换成树的结构
 */
function arr2Tree(arr) {
    var tree = [];
    tree.pushlast = function (n) {
        if (this[this.length - 1].children) {
            this[this.length - 1].children.push(n);
        } else {
            this[this.length - 1].children = [n];
        }
    }
    tree.empty = function () { return this.length === 0; }
    tree.last = function () { return this[this.length - 1]; }
    arr.forEach(head => {
        if (tree.empty() || head.tagName <= tree.last().tagName) {
            tree.push(head);
        } else {
            tree.pushlast(head)
        }
    })
    tree.forEach(head => { if (head.children) head.children = arr2Tree(head.children) });
    return tree;
}
/**
 * 根据树的结构生成HTML
 */
function createHTML(data) {
    function head2li(head) {
        var html = `<li><a href='#${head.id}'>${head.text}</a></li>`;
        if (head.children) {
            html += arr2html(head.children);
        }
        return html;
    }
    function arr2html(arr) {
        return `<ul>${arr.map(head2li).join('')}</ul>`;
    }
    return arr2html(data);
}
/**
 * 插入HTML
 */
function insert2PostBody(contenthtml) {
    var content = document.createElement('div');
    content.id = 'custom-content';
    content.innerHTML = contenthtml;
    document.getElementById('cnblogs_post_body').prepend(content);
}
/**
 * 自动生成目录
 */
function createContent() {
    var rawdata = getHeadsFromPost();
    var treedata = arr2Tree(rawdata);
    var contenthtml = createHTML(treedata);
    insert2PostBody(contenthtml);
}