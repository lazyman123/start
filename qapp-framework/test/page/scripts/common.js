// 基础配置信息
QApp.hy.config({
    // 指定首页。值为页面的名字
    indexView: 'index',
    // 页面配置信息。
    viewOptions: {
        // 配置 'index' 页
        index: {
            // 导航栏配置信息
            nav: {
                // 中央标题配置信息
            	title: {
	                style: 'location',  // 显示位置图标
                    text: 'QApp Demo'       // 文字内容
	            }
            },
            // 页面显示时触发的回调
            onShow: function() {
                // alert('onShow')
            },
            // 页面激活时触发的回调
            onActived: function() {
                // alert('onActived')
            },
            // 页面失活时触发的回调
            onDeactived: function() {
                // alert('onDeactived')
            }
        },
        router: {
            nav: {
            	title: {
	                style: 'text',
	                text: 'Router'
	            }
            }
        },
        // 配置 'a' 页
        a: {
            nav: {
            	title: {
	                style: 'text',
	                text: 'A'
	            }
            }
        },
        // 配置 'b' 页
        b: {
            nav: {
            	title: {
	                style: 'text',
	                text: 'B'
	            }
            }
        },
        // 配置 'c' 页
        c: {
            nav: {
            	title: {
	                style: 'text',
	                text: 'C'
	            }
            }
        }
    }
});
