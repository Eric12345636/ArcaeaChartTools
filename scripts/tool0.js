function save(filename,data){
    var ua = window.navigator.userAgent.toLowerCase();
    //alert(ua);
    var version = (ua.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1];

    if(ua.indexOf("edge") > -1 || (ua.indexOf("msie") == -1 && version =='11.0') || (ua.indexOf("msie") > -1 && version == '10.0' )) {
        window.navigator.msSaveOrOpenBlob(new Blob([ data ]), filename);
        return;
    } 	
   // for IE9-
   if(ua.indexOf("msie") > -1 && (version == '9.0' || version == '8.0')){
        var frame = document.createElement("iframe");
        if (frame) {
            document.body.appendChild(frame);
            frame.setAttribute("style", "display:none");
            frame.contentWindow.document.open("txt/html", "replace");
            
            frame.contentWindow.document.write(data);
            frame.contentWindow.document.close();
            frame.focus();
            frame.contentWindow.document.execCommand("SaveAs", true,
                    filename);
            document.body.removeChild(frame);
        }
    }else if(ua.indexOf('firefox')>-1 || ua.indexOf('chrome')>-1){
        var blob = new Blob([data]);
        var link = document.querySelector("#save");
        link.download = filename;
        var url = URL.createObjectURL(blob);
        link.href = url;
        link.click();
        //URL.revokeObjectURL(url);
    }
}

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

function getFileName(o){
    var pos=o.lastIndexOf("\\");
    return o.substring(pos+1);  
}

/**
 * 复制单行内容到粘贴板
 * content : 需要复制的内容
 * message : 复制完后的提示，不传则默认提示"复制成功"
 */

document.querySelector("#upload").addEventListener("click",function(){
    document.querySelector("#fileInput").click();
})

var aff = "";
var affResult = "";
var fileName = "";
function changeSpeed(a){
    return Math.round(Number(a)/Number(document.querySelector("#time").value));
}
var openFile = function (event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function () {
        if(reader.result){
            aff=reader.result;
            fileName=getFileName(document.querySelector("#fileInput").value);
            document.querySelector("#upload").innerHTML="<i class='mdui-icon material-icons mdui-color-theme-accent mdui-icon-right'>check</i>上传.aff文件"
        }
    };
    reader.readAsText(input.files[0]);
    document.querySelector("#saveButton").setAttribute("disabled","");
};
document.querySelector("#generate").addEventListener("click",function(){
    if(aff&&document.querySelector("#time").value){
        if((document.querySelector("#time").value).search(/[^1234567890.]/)==-1){
            var time = Number(document.querySelector("#time").value);
            var lines = aff.split("\r\n");
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
                affResult+=lines[i]+"\r\n";
            }
            mdui.snackbar("完成", {position:'top'});
            document.querySelector("#saveButton").removeAttribute("disabled");
            document.querySelector("#copyButton").removeAttribute("disabled");
        }
        else{
            mdui.snackbar("请输入正确的倍数", {position:'top'});
        }
       
    }
    else{
        mdui.snackbar("请上传.aff文件或填写倍数", {position:'top'});
    }
});

document.querySelector("#saveButton").addEventListener("click",function(){
    save(fileName,affResult);
    mdui.snackbar("保存成功", {position:'top'});
})