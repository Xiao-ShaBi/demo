// let baseUrl = 'http://192.168.0.248:8777';
let baseUrl = "https://api.ujoin.tech";

function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

let terminalCode = getUrlParam("terminalCode");

let menu_li = document.querySelectorAll(".menu-box-li");
let iframe_main = document.getElementById("iframe_main");
let alarm_wrap_box = document.getElementById("alarm_wrap_box");
// 获取机床信息
let machInfo = {};
let mchId = null;
let orgId = null;
let IF = null;
let asyncFunc = async function() {
  await getMachInfo();
  machInfo = JSON.parse(window.localStorage.getItem("machInfo"));

  $("#machInfo").text(machInfo.mchName);
  mchId = machInfo.mchId;
  orgId = machInfo.orgId;
  // 默认实时监控
  iframe_main.src = `http://graph.ujoin.tech/#/monitorIndex?mchId=${machInfo.mchId}&orgId=${machInfo.orgId}&terminalCode=${machInfo.terminalCode}`;
  
  let pathname = window.location.pathname;
let path = pathname.substr(0, pathname.lastIndexOf("/"));

IF = function(id, type) {
  let _this = this;
  this.id = id;
  this.type = type;

  for (i = 0; i < menu_li.length; i++) {
    if (menu_li[i].className.search("menu-li-focus") != -1) {
      menu_li[i].className = "text-center menu-box-li";
    }
  }
  if (this.type == 0) {
    iframe_main.style.display = "block";
    alarm_wrap_box.style.display = "none";
    iframe_main.src = `http://graph.ujoin.tech/#/monitorIndex?mchId=${machInfo.mchId}&orgId=${machInfo.orgId}&terminalCode=${machInfo.terminalCode}`;
    document.getElementById(this.id).className += " menu-li-focus";
  } else if (this.type == 1) {
    // iframe_main.src = path + '/alarmWeb/index.html';
    document.getElementById(this.id).className += " menu-li-focus";
    iframe_main.style.display = "none";
    alarm_wrap_box.style.display = "block";
  } else if (this.type == 2) {
    iframe_main.style.display = "block";
    alarm_wrap_box.style.display = "none";
    iframe_main.src = `http://oee.ujoin.tech/#/equipmentDetail?mchId=${machInfo.mchId}&orgId=${machInfo.orgId}`;
    document.getElementById(this.id).className += " menu-li-focus";
  } else if (this.type == 3) {
    iframe_main.style.display = "block";
    alarm_wrap_box.style.display = "none";
    iframe_main.src = "http://www.ujoin.tech/single/UJ-PMS";
    document.getElementById(this.id).className += " menu-li-focus";
  }
};
};
asyncFunc();

// 获取机床信息
function getMachInfo() {
  let url = "/oauth/oauth-rest/terminal-list";
  let param = {
    terminalCode: terminalCode,
    pageIndex: 1,
    pageSize: 5,
    status: 1
  };
  $.ajax({
    url: baseUrl + url,
    type: "POST",
    dateType: "json",
    headers: {
      "Content-Type": "application/json",
      applicationId: "-1",
      token: ""
    },
    data: JSON.stringify(param),
    success: function(res) {
      let data = res.data || [{ test: "测试" }];
      window.localStorage.setItem("machInfo", JSON.stringify(data[0]));
    }
  });
}
