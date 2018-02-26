class SuperManager {   //главный клаss
    constructor() {
        this.subClass;
        this.sounds = new soundManager();
        this.loadMenu();
        this.mouseX = 0.;
        this.mouseY = 0.;
        this.fonImg = new Image();
        this.fonImg.src="./images/ui/fon.jpg";
    }

    //переход на уровень
    loadGame(n) {
        SuperManager.hideAllMenu();
        this.subClass = new GameManager(n);
        Window.manager = this.subClass;
    }

    //sкрыть меню
    static hideAllMenu() {
        let parent = document.getElementById('uiElements').childNodes;
        for (let i in parent) {
            if (parent[i].nodeType === 1) {
                parent[i].style.visibility = "hidden";
            }
        }
    }

    static openRecordMenu(lvl) {
        $.getJSON("./record_get?level=" + lvl, SuperManager.loadRecords);
    }

    static loadRecords(json) {
        document.getElementById("levelRecords").innerHTML = json['level'];
        let table = document.getElementById("recordTable");
        for (let i in json["records"]) {
            let tr = document.createElement("tr");
            tr.innerHTML = "<td class=\"placePlayer\">" + (parseInt(i) + 1).toString() + "</td>";
            tr.innerHTML += "<td class=\"namePlayer\">" + json["records"][i]["name"] + "</td>";
            tr.innerHTML += "<td class=\"time\">" + json["records"][i]["time"] + "s</td>";
            table.appendChild(tr);
        }
        document.getElementById("recordDiv").style.visibility="visible";
    }

    loadMenu() {
        SuperManager.hideAllMenu();
        this.subClass = null;
        document.getElementById('mainMenu').style.visibility = "visible";
        Window.manager = null;
    }

    addRecord(record,level) {
        $.ajax({
            url: "record_set",
            type: "get",
            data: {
                name: Window.playerName,
                time: record,
                level: level
            }
        });
    }

    drawManager() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.fonImg,0,0);
        if (this.subClass!==null){
            this.subClass.draw();
        }
        requestAnimationFrame(() => {
            Window.SuperManager.drawManager()
        });
    }
}

//ввод имени
function nameField(name) {
    Window.playerName = name.name.value;
    if (Window.playerName != null || Window.playerName != "") {
        Window.SuperManager.loadMenu();
        Window.SuperManager.drawManager();
    }
}

function closeRecords() {
    document.getElementById("recordDiv").style.visibility = "hidden";
    document.getElementById("recordTable").innerHTML = "";
}


var canvas = document.getElementById("canvasId");
var ctx = canvas.getContext('2d');
Window.SuperManager = new SuperManager();
SuperManager.hideAllMenu();
//SuperManager.openRecordMenu(1);
document.getElementById("nameField").style.visibility="visible";
document.onkeyup = (e) => {
    if (Window.SuperManager.subClass!==null){
        Window.SuperManager.subClass.keUpHandler(e);
    }
};

document.onkeydown = (e) => {
    if (Window.SuperManager.subClass!==null){
        Window.SuperManager.subClass.keDownHandler(e);
    }

};
