'use strict';
(function ($) {
    $.fn.CreateMultipleClient = function (options) {
        //Class for Widget Handling the CreateMultipleClient
        var defaultSetting = {
            DivID: "#ClientContainer",
            MaxFileSize: 52428800,
            UploadBtn: "#LoadTester",
            NoofClients: 5,
            ServiceURL: "",
            ActionType: "GET",
            PayLoadData: "",
            IsPayLoadneeded:false
        }
        var responseData = [],response=[];
        var setting = $.extend(defaultSetting, options);
        var container = $('<div/>', { 'class': "tabbable tabs-left" });
        var selectedFile = $('<div/>', {
            class: "inline-form-control"
        });
        var row = $('<div/>', {
            "class": "row"
        }).append($('<div/>', {
            id: "error",
            style: "color:red;"
        }));
        container.append(selectedFile);
        var StartExecution = function () {
            responseData = [];
            response = [];
            try {
                for (var i = 0; i < setting.NoofClients; i++) {
                    (function (i) {
                        ExecuteRequests(i);
                    })(i);
                }
               
            }
            catch (e) {
               
            }
        }
        var ExecuteRequests = function (ID) {
            var start_time = new Date().getTime();
            var requestId = parseInt(Math.random() * 100000000000);
            responseData.push({
                ID: requestId,
                start_time: start_time
            });

            try {
                var ajaxOptions = {
                    url: setting.ServiceURL,
                    type: setting.ActionType,
                    headers: {
                        "accept": "application/json;odata=verbose",
                        "customHeader": requestId
                    },
                    success: function (data,status,xhr,req) {
                    },
                    error: function (err) {
                        console.log('failed');
                        console.log(err);

                        console.log(this.headers.customHeader);
                        var responseObj = responseData.filter(x => x.ID == this.headers.customHeader);
                        if (responseObj) {
                            var obj = responseObj[0];
                            var request_time = new Date().getTime();
                            var totalTime = request_time - obj.start_time;
                            obj.response_time = request_time;
                            obj.totalTime = totalTime;
                            obj.url = this.url;
                            obj.status = "failed";
                            response.push(obj);
                        }
                          
                    }, complete: function () {

                        console.log(this.headers.customHeader);
                        var responseObj = responseData.filter(x => x.ID == this.headers.customHeader);
                        if (responseObj) {
                            var obj = responseObj[0];
                            var request_time = new Date().getTime();
                            var totalTime = request_time - obj.start_time;
                            obj.response_time = request_time;
                            obj.totalTime = totalTime;
                            obj.url = this.url;
                            obj.status = "success";
                            //row.html(JSON.stringify(responseData, null, 4));
                            response.push(obj);
                            row.html(
                                renderjson.set_show_by_default(true)
                                    //.set_show_to_level(2)
                                    //.set_sort_objects(true)
                                    //.set_icons('+', '-')
                                    .set_max_string_length(100)(response));
                        }
                    }
                };
                if (setting.ActionType != 'GET' && setting.PayLoadData != (null || "") && setting.IsPayLoadneeded) {
                    ajaxOptions.data = setting.PayLoadData;
                }
                $.ajax(ajaxOptions);
            }
            catch (e) {
                console.log(e);
            }
        }
        $(setting.UploadBtn).removeAttr("disabled");
        $(setting.UploadBtn).on('click', StartExecution);
        row.append(container);
        $(setting.DivID).append(row);
    }
})(jQuery)
var validation = {
    isEmailAddress: function (str) {
        var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return pattern.test(str);  // returns a boolean
    },
    isNotEmpty: function (str) {
        var pattern = /\S+/;
        return pattern.test(str);  // returns a boolean
    },
    isNumber: function (str) {
        var pattern = /^\d+\.?\d*$/;
        return pattern.test(str);  // returns a boolean
    },
    isSame: function (str1, str2) {
        return str1 === str2;
    }
};

$(document).ready(function () {
    $("#PayLoad").attr('disabled', true);
    $("#IsNeeded").on('change', function (o) {
        if (o.target.checked) {
            $("#PayLoad").removeAttr('disabled');
        }
        else {
            $("#PayLoad").val('');
            $("#PayLoad").attr('disabled', true);
        }
    });
    $("#LoadTester").on('click', function () {
        var ServiceURL = $("#ServiceURL").val();
        var NofoClients = $("#NoofClients").val();
        var payLoadData = $("#PayLoad").val();
        var ActionType = $("#ActionType").val();
        var IsNeeded = $("#IsNeeded");
        var isPayLoadneeded = IsNeeded[0].checked;
        if (ServiceURL == (null || "")) {
            alert('Please enter a valid service URL');
            return;
        }
        if (NofoClients != (null || "") && !validation.isNumber(NofoClients)) {
            alert('Please enter a valid No of Clients');
            return;
        }
        if (ActionType != 'GET' && isPayLoadneeded) {
            if (payLoadData == (null || "")) {
                alert('Please enter a valid PayLoad Data');
                return;
            }
            else{
                try {
                    JSON.parse(payLoadData.trim());
                }
                catch (e) {
                    console.log(e);
                    alert("Please enter correct JSON");
                    return;
                }
            }
        }
        var newSetting = {
            DivID: "#ClientContainer",
            MaxFileSize: 52428800,
            UploadBtn: "#TestExecutor",
            NoofClients: NofoClients == (null || "") ? 5 : parseInt(NofoClients),
            ServiceURL: ServiceURL,
            ActionType: ActionType,
            PayLoadData: payLoadData,
            IsPayLoadneeded: isPayLoadneeded
        }
        if ($.fn.CreateMultipleClient != undefined) {
            $(setting.UploadBtn).off('click');
            $.fn.CreateMultipleClient = null;
        }
        $.fn.CreateMultipleClient(newSetting);
    });
});
