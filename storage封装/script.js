
function addChange(name,value){
    var argLength=arguments.length;
    if(argLength==0){
        return localStorage;
    }
    if(argLength==1){
        return localStorage.getItem(name);
    }
    if(argLength==2){
        if(value=="object"){
            var localStr=localStorage.getItem(name);
            return JSON.parse(localStr);
        }else if(value=="number"){
            var localStr=localStorage.getItem(name);
            return parseInt(localStr);
        }else if(value=="string"){
            return localStorage.getItem(name);
        }else if(typeof value=="object"){
            var str=JSON.stringify(value);
            localStorage.setItem(name,str);
        }else{
            localStorage.setItem(name,value);
        }
    }
}
function delClear(){
    var argLength=arguments.length;
    if(argLength==0){
        localStorage.clear()
    }else{
        for(var i=0;i<argLength;i++){
            localStorage.removeItem(arguments[i]);
        }
    }
}

function changeLostarage(num,name,value){
    var argLength=arguments.length;
    if(num==1){
        if(argLength==1){
            return localStorage;
        }
        if(argLength==2){
            return localStorage.getItem(name);
        }
        if(argLength==3){
            if(value=="json"){
                var localStr=localStorage.getItem(name);
                return JSON.parse(localStr);
            }else if(value=="number"){
                var localStr=localStorage.getItem(name);
                return parseInt(localStr);
            }else if(value=="string"){
                return localStorage.getItem(name);
            }else if(value=="date"){
                var localStr=localStorage.getItem(name);
                return new Date(localStr);
            }
            else if(typeof value=="object"){
                var str;
                if(value instanceof Date){
                    str=value+"";
                }else{
                    str=JSON.stringify(value);
                }
                localStorage.setItem(name,str);
            } else{
                localStorage.setItem(name,value);
            }
        }
    }
    if(num==0){
        if(argLength==1){
            localStorage.clear()
        }else{
            for(var i=1;i<argLength;i++){
                localStorage.removeItem(arguments[i]);
            }
        }
    }
}


