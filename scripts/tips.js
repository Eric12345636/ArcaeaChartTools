var tips = [
    "O-oooooooooo AAAAE-A-A-I-A-U- JO-oooooooooooo AAE-O-A-A-U-U-A-",
    "E-eee-ee-eee AAAAE-A-E-I-E-A- JO-ooo-oo-oo-oo EEEEO-A-AAA-AAAA",
    "/a b30",
    "If you can~",
    "在那一等星的喧嚣光芒下 请让我与你一同来跳舞吧？",
    "不好吃，卖饺子的骗我",
    "佬，我亲爱的佬 你怎么就是个纸片人啊",
    "她真的好可爱，她真的好会唱，她为什么偏偏竟然是纸片人啊",
    "好开心，好高兴，好开心，好高兴，好开心，好高兴，好开心，好高兴",
    "-0.01",
    "Darkest night, I'll confront you here....",
    "对立活了吗？",
    "你干嘛~~~哈哈~~~~~哎哟~~~~",
    "咕咕咕咕咕咕咕咕咕",
    "我精神状态挺好的呀，我神状好挺态精的呀",
    "上勾拳！下勾拳！左勾拳！扫堂腿！回旋踢！龙卷风摧毁停车场！",
    "BMS：不为所动，做更专业的自己",
    "I don't know, go RANDOM!",
    "616sb",
    "任何邪恶终将绳之以法！",
    "Zero Zero Zero Zero",
    "你说的对，但是我们这个压缩毛巾",
    "我们在大量私货中发现了一点tips",
    "肯德基疯狂星期四vivo50",
    "点击访问sasakure.uk",
    "PURE MEMORY 10'002'221",
    "超越一切 震慑凡人 带来终结 机械降神 风暴之力 充满全身 最后一击 核心共振",
    "别盯着Tips看了",
    "**,*",
    "我去，是吴奇隆",
    "rm -rf /*",
    "shutdown -s -t 0",
    "Can't keep up! Is the server overloaded? Running 114514 ticks or 1919810 ms behind",
    "让我猜一猜，现在是早上",
    "让我猜一猜，现在是上午",
    "让我猜一猜，现在是中午",
    "让我猜一猜，现在是下午",
    "让我猜一猜，现在是晚上",
    "这是你第一次看到这条tips",
    "这是你第二次看到这条tips",
    "这是你第三次看到这条tips",
    "这是你第四次看到这条tips",
    "这是你第五次看到这条tips",
    "?",
    "!",
    "啥！砂！杀！沙！纱！煞！鲨！刹！痧！霎！榝！殺！歃！硰！",
    "你没有看tips对吧（心虚）",
    "关于该工具，作者有以下六点见解：……",
    "你知道吗？18岁成年人6年前还在上小学！",
    "告诉你个秘密，其实███是██的█，而且这个██作者并不██，所以██的话你最好██。",
    "感谢落穆潇潇贡献的数条精美沙雕tips",
    "IE是世界上最好的浏览器",
    "你的下一台电脑，何必是电脑",
    "sasakure.UK x TJ.hangneil"
];

var lastTip = -1;

function randomTip(){
    let tipNum = Math.floor(Math.random()*tips.length);
    while(tipNum==lastTip){
        tipNum = Math.floor(Math.random()*tips.length);
    }
    document.querySelector("#tips").textContent=tips[tipNum];
    lastTip = tipNum;
}

randomTip();
setInterval(randomTip, 5000);
