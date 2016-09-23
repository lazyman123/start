var indexTpl=require('./tpls/index.string');
window.onload=function () {
    var body=document.querySelector('body');
    body.innerHTML=indexTpl+body.innerHTML;
}
