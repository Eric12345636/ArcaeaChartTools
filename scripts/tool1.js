function fomatFloat(num,n){   
    var f = parseFloat(num);
    if(isNaN(f)){
        return false;
    }   
    f = Math.round(num*Math.pow(10, n))/Math.pow(10, n); // n 幂   
    var s = f.toString();
    var rs = s.indexOf('.');
    //判定如果是整数，增加小数点再补0
    if(rs < 0){
        rs = s.length;
        s += '.'; 
    }
    while(s.length <= rs + n){
        s += '0';
    }
    return s;
}

function changeSpeed(a){
    let startTime = Number(document.querySelector("#startTime").value);
    return Math.round((Number(a)-startTime)/Number(document.querySelector("#time").value)) + startTime;
}

var result = "";

document.querySelector("#generate").addEventListener("click",function(){
    if(document.querySelector("#chart").value&&document.querySelector("#time").value&&document.querySelector("#startTime").value){
        if((document.querySelector("#time").value).search(/[^1234567890.]/)==-1||(document.querySelector("#startTime").value).search(/[^1234567890]/)==-1){
            var chart = document.querySelector("#chart").value;
            var time = Number(document.querySelector("#time").value);
            var lines = chart.split("\n");
            for(let i = 0; i < lines.length; i++){
                if(lines[i].includes("AudioOffset:")){
                    let timeResult = changeSpeed(lines[i].match(new RegExp(/-?[1-9]\d*/)));
                    lines[i]="AudioOffset:"+timeResult;
                }
                else if(lines[i].includes("timing(")){
                    let params = lines[i].match(/\((.+?)\)/gi)[0].replace("(","").replace(")","").split(",");
                    params[0]=changeSpeed(params[0]);
                    params[1]=fomatFloat(Math.min(params[1]*time,10000000),2);
                    lines[i]="timing("+params[0]+","+params[1]+","+params[2]+");";
                }
                else if(lines[i][0]=="("){
                    let params = lines[i].match(/\((.+?)\)/gi)[0].replace("(","").replace(")","").split(",");
                    params[0]=changeSpeed(params[0]);
                    lines[i]="("+params[0]+","+params[1]+");";
                }
                else if(lines[i].includes("hold(")){
                    let params = lines[i].match(/\((.+?)\)/gi)[0].replace("(","").replace(")","").split(",");
                    params[0]=changeSpeed(params[0]);
                    params[1]=changeSpeed(params[1]);
                    lines[i]="hold("+params[0]+","+params[1]+","+params[2]+");";
                }
                else if(lines[i].includes("arc(")){
                    let params = lines[i].match(/\((.+?)\)/gi)[0].replace("(","").replace(")","").split(",");
                    params[0]=changeSpeed(params[0]);
                    params[1]=changeSpeed(params[1]);
                    if(params[0]==params[1]&&params[2]==params[3]&&params[5]==params[6]){
                        params[1]+=1;
                    }
                    let temp = "";
                    if(lines[i].includes("[")){
                        temp+="["
                        let paramsArctap = lines[i].match(/\[(.+?)\]/gi)[0].replace("[","").replace("]","").split(",");
                        for(var j=0;j<paramsArctap.length;j++){
                            paramsArctap[j] = changeSpeed(String(paramsArctap[j]).replace("arctap(","").replace(")",""));
                            if(j!=paramsArctap.length-1){
                                temp+="arctap("+String(paramsArctap[j])+"),";
                            }
                            else{
                                temp+="arctap("+String(paramsArctap[j])+")";
                            }
                        }
                        temp+="];"
                        if(params.length==10){
                            lines[i]="arc("+params[0]+","+params[1]+","+params[2]+","+params[3]+","+params[4]+","+params[5]+","+params[6]+","+params[7]+","+params[8]+","+params[9]+")"+temp;
                        }
                        else{
                            lines[i]="arc("+params[0]+","+params[1]+","+params[2]+","+params[3]+","+params[4]+","+params[5]+","+params[6]+","+params[7]+","+params[8]+")"+temp;
                        }
                    }
                    else{
                        if(params.length==10){
                            lines[i]="arc("+params[0]+","+params[1]+","+params[2]+","+params[3]+","+params[4]+","+params[5]+","+params[6]+","+params[7]+","+params[8]+","+params[9]+");";
                        }
                        else{
                            lines[i]="arc("+params[0]+","+params[1]+","+params[2]+","+params[3]+","+params[4]+","+params[5]+","+params[6]+","+params[7]+","+params[8]+");";
                        }
                    }
                }
                else if(lines[i].includes("scenecontrol(")){
                    let params = lines[i].match(/\((.+?)\)/gi)[0].replace("(","").replace(")","").split(",");
                    params[0] = changeSpeed(params[0]);
                    if(params.length==2){
                        lines[i] = "scenecontrol("+params[0]+","+params[1]+");";
                    }
                    else{
                        params[2] = fomatFloat(params[2]/time,2);
                        lines[i] = "scenecontrol("+params[0]+","+params[1]+","+params[2]+","+params[3]+");";
                    }
                }
                else if(lines[i].includes("camera(")){
                    let params = lines[i].match(/\((.+?)\)/gi)[0].replace("(","").replace(")","").split(",");
                    params[0] = changeSpeed(params[0]);
                    params[8] = changeSpeed(params[8]);
                    lines[i] = "camera("+params[0]+","+params[1]+","+params[2]+","+params[3]+","+params[4]+","+params[5]+","+params[6]+","+params[7]+","+params[8]+");"
                }
                else if(lines[i].includes("flick(")){
                    let params = lines[i].match(/\((.+?)\)/gi)[0].replace("(","").replace(")","").split(",");
                    params[0] = changeSpeed(params[0]);
                    lines[i] = "flick("+params[0]+","+params[1]+","+params[2]+","+params[3]+","+params[4]+");";
                }
                result+=lines[i]+"\n";
            }
            mdui.snackbar("完成", {position:'top'});
            document.querySelector("#copyButton").removeAttribute("disabled");
        }
        else{
            mdui.snackbar("请正确填写参数", {position:'top'});
        }
    }
    else{
        mdui.snackbar("请填写内容", {position:'top'});
    }
});

document.querySelector("#copyButton").addEventListener("click",function(){
	const textarea = document.createElement('textarea');
	textarea.value = result;
	document.body.appendChild(textarea);
	textarea.select();
	if (document.execCommand('copy')) {
		document.execCommand('copy');
	}
	document.body.removeChild(textarea);
    mdui.snackbar("已复制", {position:'top'});
})