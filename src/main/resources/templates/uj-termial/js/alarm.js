
let relieveIcon = [
  {
      label: '解除锁机',
      path: './imgs/uj-jc.png',
      key: 101,
  }
]
let errorList = [
  {
      label: '更换了新刀',
      path: './imgs/uj-gh.png',
      key: 204,
  },
  {
      label: '刚开机',
      path: './imgs/uj-kj.png',
      key: 202,
  },
  {
      label: '误报警',
      path: './imgs/uj-wb.png',
      key: 201,
  }
]
let unusualList = [
  {
      label: '崩刃',
      path: './imgs/uj-br.png',
      key: 301,
  },
  {
      label: '毛坯/装夹异常',
      path: './imgs/uj-mp.png',
      key: 304,
  },
  {
      label: '断刀',
      path: './imgs/uj-dd.png',
      key: 302,
  },
  {
      label: '空加工',
      path: './imgs/uj-kjg.png',
      key: 305,
  },
  {
      label: '磨损',
      path: './imgs/uj-ms.png',
      key: 303,
  },
  {
      label: '其它',
      path: './imgs/uj-qt.png',
      key: 306,
  },
  {
      label: '调试',
      path: './imgs/uj-ts.png',
      key: 308,
  },
  {
      label: '返修',
      path: './imgs/uj-fg.png',
      key: 309,
  },
]
let alarm_detail_list = [];
let alarm_detail_msg = {};
let history_list = [];
let history_msg = {};
let alarm_type = null;
let totalCount = 0;
let ws = null;

let header = {'Content-Type':'application/json','applicationId':'-1','token':''};

//地址栏获取参数方法
function GetQueryString(name) 
{ 
   var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); 
   var r = window.location.search.substr(1).match(reg); 
   if(r!=null)return unescape(r[2]); return null; 
} 


$(function () {
    header.orgId = orgId;

    window.location.protocol !== 'file:' ? isCloud = 1 : isCloud = 0;
    
    if(isCloud){
        // ws = new WebSocket("ws://192.168.0.246:8787/alarmWebSocket/"+orgId);
        ws = new WebSocket("ws://192.168.0.132:8787/alarmWebSocket/"+orgId);
    }else{
        getUserIP(function(ip){
            ws = new WebSocket("ws://"+ip+":7999");
        });
    }
    let imgHtml = '';
    let errorHtmlList = '';
    let relieveHtml = '';
    relieveIcon.map(item => {
        let str = `<div class="col-mg-12 col-md-12 col-sm-12 text-center fl pb-10 cardBox">
                        <div class="card" data-id="${item.key}">
                        <img class="card-img-top img-show" src="${item.path}" alt="" style="width:100%">
                        <img class="card-img-top img-qr" src="./imgs/uj-qr.png" alt="" style="width:100%;display:none;">
                        </div>
                    <span>${item.label}</span></div>`;
        relieveHtml += str;
    })
    errorList.map(item => {
        let str = `<div class="col-mg-12 col-md-12 col-sm-12 text-center fl pb-10 cardBox">
                        <div class="card" data-id="${item.key}">
                        <img class="card-img-top img-show" src="${item.path}" alt="" style="width:100%">
                        <img class="card-img-top img-qr" src="./imgs/uj-qr.png" alt="" style="width:100%;display:none;">
                        </div>
                    <span>${item.label}</span></div>`;
        errorHtmlList += str;
    })
    unusualList.map(item => {
        let str = '';
        if (item.key === 306) {
            str = `<div class="col-mg-4 col-md-4 col-sm-4 text-center fl pb-10 cardBox">
                        <div class="card" data-id="${item.key}" data-toggle="modal" data-target="#myModal">
                        <img class="card-img-top img-show" src="${item.path}" alt="" style="width:100%">
                        <img class="card-img-top img-qr" src="./imgs/uj-qr.png" alt="" style="width:100%;display:none;">
                        </div>
                        <span>${item.label}</span></div>
                      </span>`;
        } else {
            str = `<div class="col-mg-4 col-md-4 col-sm-4 text-center fl pb-10 cardBox">
                        <div class="card" data-id="${item.key}">
                        <img class="card-img-top img-show" src="${item.path}" alt="" style="width:100%">
                        <img class="card-img-top img-qr" src="./imgs/uj-qr.png" alt="" style="width:100%;display:none;">
                        </div>
                    <span>${item.label}</span></div>`;
        }
        imgHtml += str;
    })
    // relieveHtml
    $('#imgBox3').html(relieveHtml);
    $('#imgBox2').html(errorHtmlList);
    $('#imgBox').html(imgHtml);

    $("#img-out-box").on('click', '.cardBox .card', function () {
        console.log($(this).data("id"));
        alarm_type = $(this).data("id");
        console.log(alarm_type);
        $(this).parents('#img-out-box').find('.cardBox .img-show').show();
        $(this).parents('#img-out-box').find('.cardBox .img-qr').hide();
        $(this).find('.img-show').hide();
        $(this).find('.img-qr').show();
    })

    $('#saveRemarks').on('click', function() {
        var forms = document.forms["Remarks"];
        save_submit('feed_history',forms.remake.value)
        // console.log(forms.remake.value)
    });
    //  关闭后弹框
    $('#modal_reasonlist').on('hide.bs.modal', function () {
        $("#imgBox").find('.cardBox .img-show').show();
        $("#imgBox").find('.cardBox .img-qr').hide();
    })
    function save_submit(val) {
        if(alarm_type === null){
            return alert('请选择反馈类型');
        }
        let feedBackItem = {...alarm_detail_msg};
        feedBackItem.cmd = 1;  //反馈指令
        feedBackItem.actionType = 2;
        feedBackItem.confirmResult = alarm_type;    //反馈类型
        feedBackItem.confirmUserId = orgId;
        feedBackItem.remark = '';     //操作人
        feedBackItem.confirmTime = Date.parse(new Date())/1000; //反馈时间
        if(alarm_type === 306 && val){
            $('#myModal').modal('hide');
            $('#myModal').on('hide.bs.modal',function() {
                document.getElementById("Remarks").reset();
            });
            $('#myModal').on('show.bs.modal',function() {
                document.getElementById("Remarks").reset();
            });
            feedBackItem.remark = val;
        }
        // history_msg存在时为修改反馈
        if(history_msg){
            console.log(history_msg);
            let params = {
                actionType:1,
                eventUuid : history_msg.eventUuid,
                confirmResult:alarm_type
            };
            if(alarm_type === 306 && val){
                params.remark = val;
            }
            let url = '/graph/graph-rest/save-alarm-confirm';
            $.ajax({
                url: baseUrl+url,
                type: "POST",
                dateType:'json',
                headers:header,
                data:JSON.stringify(params),
                success: function (res) {
                    if(res.code === 0){
                        alert('反馈成功');
                        history_msg = {};
                        $('#modal_reasonlist').modal('hide');
                    }else{
                        alert(res.resultMsg)
                    }
                    console.log(res);
                },
                error: function (xhr) {
                }
            });
            return;
        }
        if(isCloud == 1){
            // 测试数据
            feedBackItem.toolId = '1';
            feedBackItem.tmCode = 'TEST01006020';
            feedBackItem.confirmTime = Date.parse(new Date())/1000;
            feedBackItem.confirmUserId = orgId;
            let url = '/graph/graph-rest/save-alarm-confirm';
            $.ajax({
                url: baseUrl+url,
                type: "POST",
                dateType:'json',
                headers:header,
                data:JSON.stringify(feedBackItem),
                success: function (res) {
                    if(res.code === 0){
                        alert('反馈成功');
                    }else{
                        alert(res.resultMsg)
                    }
                    console.log(res);
                },
                error: function (xhr) {
                }
            });
        }else{
            feedBackItem.orgId = 2;
            //解锁的时候先发反馈指令  再发解锁指令
            ws.send(JSON.stringify(feedBackItem));
            if(alarm_type === 101){  //alarm_type === 101 为解锁指令
                let removeLock = {
                    "cmd":2, //解锁指令
                    "controlType" : 3,
                    "param" : 0,
                    "ncId" : ""
                };
                removeLock.mchId = alarm_detail_msg.mchId;
                removeLock.ncChannel = alarm_detail_msg.ncChannel;
                //发送解锁指令
                ws.send(JSON.stringify(removeLock));
                // alert(JSON.stringify(removeLock));
            }
        }
        // return;
        let index = alarm_detail_list.findIndex((item) =>(item.eventUuid === alarm_detail_msg.eventUuid))
        // debugger;
        alarm_detail_list.splice(index,1);
        totalCount--;
        if(alarm_detail_list.length < 1){
            $('#modal_reasonlist').modal('hide');
            return;
        }else{
            $('.bk-color').remove();
            $("#showBox tr").first().addClass('bk-color');
        }
        document.getElementById('showBox_count').innerHTML = totalCount;
        writeAlarmDetail(alarm_detail_list[0]);
    }
    // 提交反馈
    $('#submitBtn').on('click',function() {
        save_submit();
    });

    //时间查询选项
    window.filterFocus = function (id, type) {
        $('.time_fliter').removeClass("time_fliter_focus");
        $('#' + id).addClass("time_fliter_focus");
        $('#timePeriod').val(type)
    }


    //原因查询切换效果
    window.reasonfilterFocus = function (id, type) {
        $('.btn_reason_filter').removeClass("time_fliter_focus");
        $('#' + id).addClass("time_fliter_focus");
        $('#confirmResult').val(type)
    }


    // 表格数据渲染
    function inqComplete(result) {
        result = result || [];
        var str = '';
        var str_th = '';
        var len = result.length;
        var data = result;
        var $tableBox = $('.table-bordered');
        var $tableBody = $tableBox.find('tbody');
        var $tableThead = $tableBox.find('thead');

        //生成table头
        // if ($('#alarmResource').val() == "1") {
        //     str_th = str_th + '<tr class="tr">' +
        //         '<th>序号</th>' +
        //         '<th>通道</th>' +
        //         '<th>程序号</th>' +
        //         '<th>刀具号</th>' +
        //         '<th>加工序号</th>' +
        //         '<th>信号</th>' +
        //         '<th>报警时间</th>' +
        //         '<th>报警类型</th>' +
        //         '<th>报警结果</th>' +
        //         '<th>反馈结果</th>' +
        //         '<th>反馈时间</th>' +
        //         '<th>反馈人</th>' +
        //         '<th>操作</th>' +
        //         '</tr>';
        // } else {
        //     str_th = str_th + '<tr style="height:40px;">' +
        //         '<th>序号</th>' +
        //         '<th>通道</th>' +
        //         '<th>刀具号</th>' +
        //         '<th>反馈结果</th>' +
        //         '<th>反馈时间</th>' +
        //         '<th>反馈人</th>' +
        //         '</tr>';
        // }
        str_th = str_th + '<tr class="tr">' +
                '<th>序号</th>' +
                '<th>通道</th>' +
                '<th>程序号</th>' +
                '<th>刀具号</th>' +
                '<th>加工序号</th>' +
                '<th>信号</th>' +
                '<th>报警时间</th>' +
                '<th>报警类型</th>' +
                '<th>报警结果</th>' +
                '<th>反馈结果</th>' +
                '<th>反馈时间</th>' +
                '<th>反馈人</th>' +
                '<th>操作</th>' +
                '</tr>';

        $tableThead.html(str_th);

        if (len) {
            for (var i = 0; i < len; i++) {
                var optionStr = '';
 
                //当为自动报警记录时，才允许修改和查看
                if (data[i].eventUuid != null && data[i].eventUuid != "") {
                    // var tempDate = data[i].eventStartTime.substring(0, 10)||'';
                    var tempDate = 1;
                    if (data[i].confirmResult == 0) {
                        optionStr = optionStr + '<a class="btn btn-operate" id="' + data[i].eventUuid +
                            '" name="' + data[i].mmType +
                            '" data-status="2" data-eventUuid="'+data[i].eventUuid+'"  onclick="feedbackview(this.id);">反馈</a>'
                    } else {
                        optionStr = optionStr + '<a class="btn btn-operate" id="r_' + data[i].eventConfirmId +
                            '" data-eventUuid="' + data[i].eventUuid +
                            '" data-status="2" onclick="feedbackview(this.id,this.eventUuid);">修改</a>';
                    }
                    optionStr = optionStr + '&nbsp;<a class="btn btn-operate" id="' + data[i]
                        .eventUuid + '" name="' + data[i].mmType +
                        '" onclick="showDrawing(this.id)">查看</a>';

                    var signalCodeText = data[i].signalCodeText;
                    if (!signalCodeText) {
                        signalCodeText = data[i].signalCodeDesc;
                    }
                    var realAlarmReasonText = data[i].realAlarmReasonText;
                    str = str + '<tr class="tr_' + i + '">' +
                        '<td>' + data[i].eventConfirmId + '<input type="hidden" value="' + data[i].eventUuid +
                        '">' + '</td>' +
                        '<td>' + (data[i].chnId == null ? '' : data[i].chnId) + '</td>' +
                        '<td>' + data[i].programNo + '</td>' +
                        '<td>' + (data[i].toolId == null ? '' : data[i].toolId) + '</td>' +
                        '<td>' + data[i].batchNo + '</td>' +
                        '<td>' + data[i].sigCode + '</td>' +
                        '<td>' + formatDate(data[i].alarmTime*1000,"yyyy-MM-dd hh:mm:ss") + '</td>' +
                        '<td>' + (data[i].alarmTypeName != null ? data[i].alarmTypeName : '') + '</td>' +
                        '<td>' + (data[i].alarmResultName  != null ? data[i].alarmResultName : '') +
                        '</td>' +
                        '<td>' + (data[i].confirmResultName != null ? data[i].confirmResultName :
                            '') + '</td>' +
                        '<td>' + formatDate(data[i].confirmTime*1000,"yyyy-MM-dd hh:mm:ss") + '</td>' +
                        '<td>'+data[i].confirmUserId+'</td>' +
                        '<td>' + optionStr + '</td>' +
                        '</tr>';
                } else {
                    str = str + '<tr class="tr_' + i + '">' +
                        '<td>' + data[i].eventConfirmId+ '</td>' +
                        '<td>' + (data[i].chnId == null ? '' : data[i].chnId) + '</td>' +
                        '<td>' + (data[i].toolId == "null" ? '' : data[i].toolId) + '</td>' +
                        '<td>' + (data[i].confirmResultName != null ? data[i].confirmResultName :
                            '') + '</td>' +
                        '<td>' + data[i].confirmTime+ '</td>' +
                        '<td>'+data[i].confirmUserId+'</td>'
                        +
                        '</tr>';
                }
            }
            $tableBody.html(str);
            $('#data_tip').html('');
        } else {
            $tableBody.html('');
            $('#data_tip').html('没有符合条件的事件记录');
        }

    }
    inqComplete();
    // 点击查看
    window.showDrawing = function(id){
        $('#alarmDrawing').attr('src','');
        // programNo toolNo
        let item = history_list.find((item) =>(item.eventUuid === id));
        if(item){
            $('#show_programNo').text(item.programNo);
            $('#toolNo').text(item.toolId);
        }
        let params = {
            eventUuid:item.eventUuid,
            isZoom:1,
            mchId:item.mchId,
            monitorStartTime:0,
            orgId:item.orgId,
            seqNo:'131310',
            signalCode:item.sigCode,
            terminalCode:terminalCode,
        }
        // let url = `http://graph.ujoin.tech/#/alarmDrawing`;
        // let url = `http://192.168.0.109:8000/#/alarmDrawing`;
        let url = `http://graph.ujoin.tech/#/alarmDrawing?eventUuid=${item.eventUuid}&mchId=${item.mchId}&orgId=${item.orgId}&signalCode=${item.sigCode}&terminalCode=${terminalCode}`;
        console.log(url);
        $('#alarmDrawing').attr('src',url);
        $('#modal_drawing').modal({
            backdrop: 'static',
            keyboard: false
        });
    }
    //点击反馈
    window.feedbackview = function(id) {
        history_msg = history_list.find((item) =>(item.eventUuid === id));
        $('#modal_reasonlist').modal({
            backdrop: 'static',
            keyboard: false
        });
        writeAlarmDetail(history_msg)
    }
    //点击事件的确定操作，弹出报警确认界面
    window.showalarmview = function(id) {
        let item = alarm_detail_list.find((item) =>(item.eventUuid === id));
        alarm_detail_msg = item;
        writeAlarmDetail(item);
        $('#'+id).parent().find('.bk-color').removeClass('bk-color');
        $('#'+id).addClass('bk-color');
    }

    //点击事件的查看，弹出事件画图界面
    function showeventview(eventid, mmtype, tempDate) {
        //强制弹出窗口不能点击空白处关闭
        $('#modal_reasonlist').modal({
            backdrop: 'static',
            keyboard: false
        });

        var mchid = mchid;
        var html = "";
        var params = "?mchId=" + mchid + "&eventUuid=" + eventid + "&mmType=" + mmtype + "&selDate=" +
            tempDate;
        html = basePath + "page/eventDetail.do" + params;
        $("#iframe_event_detail").attr("src", html)
    }
    // 更多选项
    $('#searchBox_btn').click(function () {
        $('#searchBox').toggle();
    })
    inquiry()
    // 请求列表数据
    function inquiry(pageNo){
        if(!pageNo){
            pageNo = 1;
        }
        let url = '/graph/graph-rest/alarm-confirm-list';
        let timePeriod = $('#timePeriod').val();
        let eventType = $('#eventType').val();
        let confirmResult = $('#confirmResult').val();
        let warningState = $('#warningState').val();
        let warningResult = $('#warningResult').val();
        let selectMMType = $('#selectMMType').val();
        let signalCode = $('#signalCode').val();
        let programNo = $('#programNo').val();
        let toolId = $('#toolId').val();

        let param = {
            mchId:mchId,
            orgId:orgId,
            pageIndex:pageNo,
            pageSize:10,
            timePeriod:timePeriod,
            eventType:eventType,
            confirmResult:confirmResult,
            alarmResult:warningResult,
            signalCode:signalCode,
            mmtype:selectMMType,
            toolId:toolId,
            programNo:programNo,
        }
        $.ajax(
            {
            url: baseUrl+url,
            type: "POST",
            dateType:'json',
            headers:header,
            data:JSON.stringify(param),
            success: function (res) {
                history_list = res.data;
                inqComplete(res.data);
                if(res.totalPage == 0){
                    res.totalPage = 1;
                }
                setPage(res.currentPage, res.totalPage, inquiry)
            },
            error: function (xhr) {
            }
        });

    };
    // 分页
    function setPage(pageCurrent, pageSum, callback) {
        $(".pagination").bootstrapPaginator({
            bootstrapMajorVersion: 3,//bootstrap版本
            // 显示第几页
            currentPage: pageCurrent,
            // 总页数
            totalPages: pageSum,
            numberOfPages: '5',//一页显示几个按钮
            alignment: 'right',    //靠右
            itemTexts: function (type, page, current) {
                switch (type) {
                 case "first": return "首页";
                 case "prev": return "上一页";
                 case "next": return "下一页";
                 case "last": return "末页";
                 case "page": return page;
                }
            },
            //当单击操作按钮的时候, 执行该函数, 调用ajax渲染页面
            onPageClicked: function (event,originalEvent,type,page) {
                // 把当前点击的页码赋值给currentPage, 调用ajax,渲染页面
                currentPage = page
                callback && callback(currentPage)
            }
        })
    };

    function getSigal(){ 
        let url = '/graph/graph-rest/alarm-confirm-params';
        let param = {
            "orgId":orgId,
            "mchId":mchId,
          };
        $.ajax(
                {
                url: baseUrl+url,
                type: "POST",
                dateType:'json',
                headers:header,
                data:JSON.stringify(param),
                success: function (res) {
                    let str1 = '';
                    let str2 = '';
                    let str3 = '';
                    let str4 = '';
                    let data = res.data;

                    // 通道
                    data.mmTypeNameSet.map(item => {
                        if(!item.label){
                            item.label = item.value;
                        }
                        let str = `<option value="${item.value}">${item.label}</option>`;
                        str1 += str;
                    })

                    // 信号
                    data.signalTextSet.map(item => {
                        if(!item.label){
                            item.label = item.value;
                        }
                        let str = `<option value="${item.value}">${item.label}</option>`;
                        str2 += str;
                    })
                    // 程序号
                    data.progreamNoSet.map(item => {
                        let str = `<option value="${item}">${item}</option>`;
                        str3 += str;
                    })
                    // 刀具号
                    data.toolIdSet.map(item => {
                        let str = `<option value="${item}">${item}</option>`;
                        str4 += str;
                    })
                    $('#selectMMType').append(str1);
                    $('#signalCode').append(str2);
                    $('#programNo').append(str3);
                    $('#toolId').append(str4);

                },
                error: function (xhr) {
                }
            });
    }
    getSigal();

    $('#searchBtn').click(function () {
        inquiry();
     })

    function WebSocketTest() {
        // 打开一个 web socket
        ws.onopen = function () {
        };

        ws.onmessage = function (evt) {
            let res = evt.data;
            if( res != 'client websocket connected'){
                let data = JSON.parse(res);
                // cmd == 4时为解除报警，或者 res.actionType不为0时为解除报警，其他为报警通知
                if(data.cmd === 4 || data.actionType){
                    //解除报警通知
                    let index = alarm_detail_list.findIndex((item) =>(item.eventUuid === data.eventUuid));
                    if( index >- 1){
                        $('.bk-color').remove();
                        $("#showBox tr").first().addClass('bk-color');
                        alarm_detail_list.splice(index,1);
                        totalCount--;
                        document.getElementById('showBox_count').innerHTML = totalCount;
                        writeAlarmDetail(alarm_detail_list[0]);
                        if(alarm_detail_list.length < 1){
                            $('#modal_reasonlist').modal('hide');
                        }
                    }
                }else{
                    // 报警通知
                    totalCount++;
                    $('#modal_reasonlist').modal({
                        keyboard: false,
                        backdrop: 'static',
                    })
                    setMessageInnerHTML(data,totalCount)
                    if(totalCount === 1){
                        writeAlarmDetail(data);
                        alarm_detail_msg = data;
                        //第一条增加选中状态
                        // $(`r_${data.eventUuid}`).addClass('bk-color');
                        $("#showBox tr").first().addClass('bk-color');
                    }
                    alarm_detail_list.push(data);
                }
            }
        };
        ws.onerror = function () {
            WebSocketTest();

        }

        ws.onclose = function () {
            // 关闭 websocket
        };
    }
    setTimeout(() =>{
        WebSocketTest();
    },1000)
    // 未报警确认表格
    let showBox_head_html = `<tr class="tr"><th style="width:60px;">设备</th><th>报警时间</th></tr>`;
    $('#showBox_head').html(showBox_head_html);
    function setMessageInnerHTML(data,totalCount) {
        // i++;
        document.getElementById('showBox').innerHTML += `<tr class="tr" id="${data.eventUuid}" onclick="showalarmview(this.id);"><td style="width:30px;">${data.mchId}</td><td>${formatDate(data.alarmTime*1000,"yyyy-MM-dd hh:mm:ss")}</td></tr>`;
        document.getElementById('showBox_count').innerHTML = totalCount;

    }
    // 判断是否本地终端打开
    if(window.location.protocol == 'file:'){
        $('.head-box').addClass('none')
        $('.content-box').removeClass('content-box');
    }else{
        $('.head-box').show();
        $('.content-box').addClass('content-box');
    }
   


})
// 报警弹框信息
function writeAlarmDetail(data){
    $('#alarm_value1').text(data.ncChannel || data.chnId);
    $('#alarm_value2').text(data.programNo);
    $('#alarm_value3').text(data.sigCode);
    $('#alarm_value4').text(data.toolId);
    $('#alarm_value5').text(data.alarmType);
    $('#alarm_value6').text(data.alarmResult);
    $('#alarm_value7').text(data.alarmResult);
    $('#alarm_value8').text(formatDate(data.alarmTime*1000,"yyyy-MM-dd hh:mm:ss"));
    // $('#alarm_value9').text(formatDate(data.alarmTime*1000,"yyyy-MM-dd hh:mm:ss"));
    $('#alarm_value10').text(data.orgId);
}
function formatDate(time, fmt) {
    // debugger;
    let date = new Date(time);
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    let o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + "";
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? str : padLeftZero(str)
        );
      }
    }
    return fmt;
}

function padLeftZero(str) {
    return ("00" + str).substr(str.length);
} 

//获取本机IP方法
function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
       iceServers: []
   }),
   noop = function() {},
   localIPs = {},
   ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
   key;

   function iterateIP(ip) {
       if (!localIPs[ip]) onNewIP(ip);
       localIPs[ip] = true;
  }

    //create a bogus data channel
   pc.createDataChannel("");

   // create offer and set local description
   pc.createOffer().then(function(sdp) {
       sdp.sdp.split('\n').forEach(function(line) {
           if (line.indexOf('candidate') < 0) return;
           line.match(ipRegex).forEach(iterateIP);
       });
       
       pc.setLocalDescription(sdp, noop, noop);
   }).catch(function(reason) {
       // An error occurred, so handle the failure to connect
   });

   //sten for candidate events
   pc.onicecandidate = function(ice) {
       if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
       ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
   };
}