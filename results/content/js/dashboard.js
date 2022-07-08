/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7823981295925184, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "/cgi-bin/nav.pl?page=menu&in=home"], "isController": false}, {"data": [1.0, 500, 1500, "/Webtours/header.html"], "isController": false}, {"data": [0.0, 500, 1500, "Find_Flights"], "isController": true}, {"data": [1.0, 500, 1500, "/cgi-bin/welcome.pl?signOff=1"], "isController": false}, {"data": [0.0, 500, 1500, "Flights"], "isController": true}, {"data": [1.0, 500, 1500, "/cgi-bin/reservations.pl?page=welcome"], "isController": false}, {"data": [1.0, 500, 1500, "/cgi-bin/nav.pl?page=menu&in=flights"], "isController": false}, {"data": [0.0, 500, 1500, "Logout"], "isController": true}, {"data": [0.0, 500, 1500, "Itinerary"], "isController": true}, {"data": [0.0, 500, 1500, "UC_03"], "isController": true}, {"data": [1.0, 500, 1500, "/cgi-bin/welcome.pl?page=search"], "isController": false}, {"data": [1.0, 500, 1500, "/cgi-bin/welcome.pl?signOff=true"], "isController": false}, {"data": [1.0, 500, 1500, "/WebTours/home.html"], "isController": false}, {"data": [0.0, 500, 1500, "UC_02"], "isController": true}, {"data": [0.0, 500, 1500, "UC_01"], "isController": true}, {"data": [1.0, 500, 1500, "/Webtours/"], "isController": false}, {"data": [0.0, 500, 1500, "Buy"], "isController": true}, {"data": [1.0, 500, 1500, "/cgi-bin/login.pl?intro=true"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": true}, {"data": [1.0, 500, 1500, "/cgi-bin/nav.pl?in=home"], "isController": false}, {"data": [1.0, 500, 1500, "/cgi-bin/reservations.pl"], "isController": false}, {"data": [1.0, 500, 1500, "Start_Page"], "isController": true}, {"data": [0.0, 500, 1500, "Payment"], "isController": true}, {"data": [1.0, 500, 1500, "/cgi-bin/nav.pl?page=menu&in=itinerary"], "isController": false}, {"data": [1.0, 500, 1500, "/cgi-bin/welcome.pl?page=itinerary"], "isController": false}, {"data": [1.0, 500, 1500, "/cgi-bin/login.pl"], "isController": false}, {"data": [1.0, 500, 1500, "/cgi-bin/itinerary.pl"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 13016, 0, 0.0, 38.67171173939748, 0, 99, 32.0, 75.0, 77.0, 83.0, 4.224206168262698, 5.702054159091373, 3.579715720231046], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/cgi-bin/nav.pl?page=menu&in=home", 1037, 0, 0.0, 38.71263259402124, 27, 94, 31.0, 64.0, 71.0, 76.0, 0.3373621597424466, 0.5762172044819718, 0.317974497580069], "isController": false}, {"data": ["/Webtours/header.html", 1039, 0, 0.0, 0.514918190567854, 0, 6, 1.0, 1.0, 1.0, 1.0, 0.33721492924166235, 0.33161663451792384, 0.2703647040111375], "isController": false}, {"data": ["Find_Flights", 290, 0, 0.0, 3543.820689655172, 3038, 4281, 3534.0, 3948.6000000000004, 3987.9, 4032.3599999999997, 0.09659718109439942, 0.2582640918216163, 0.12855173418171195], "isController": true}, {"data": ["/cgi-bin/welcome.pl?signOff=1", 1034, 0, 0.0, 29.443907156673134, 26, 41, 29.0, 32.0, 34.0, 36.0, 0.3367669009595903, 0.3370957748863086, 0.3298083866764722], "isController": false}, {"data": ["Flights", 290, 0, 0.0, 3678.9413793103445, 3190, 4185, 3674.0, 4068.0, 4117.8, 4180.0, 0.09657948758254216, 0.6707747223506249, 0.27948307150995033], "isController": true}, {"data": ["/cgi-bin/reservations.pl?page=welcome", 290, 0, 0.0, 81.5275862068965, 75, 91, 81.0, 85.90000000000003, 88.0, 90.0, 0.09670370418536967, 0.4268561942557333, 0.09280865769506387], "isController": false}, {"data": ["/cgi-bin/nav.pl?page=menu&in=flights", 290, 0, 0.0, 69.69999999999997, 29, 86, 70.0, 75.0, 76.0, 80.26999999999992, 0.0967041878915686, 0.16517150842026707, 0.09271468423498318], "isController": false}, {"data": ["Logout", 1034, 0, 0.0, 3645.3230174081204, 3151, 4162, 3645.0, 4043.5, 4097.0, 4141.0, 0.33640610267999194, 0.9764973675775116, 0.6924713945008989], "isController": true}, {"data": ["Itinerary", 112, 0, 0.0, 3702.0446428571427, 3188, 4175, 3715.0, 4112.6, 4131.7, 4174.87, 0.04026311948583996, 0.4948949925710949, 0.11801663491452355], "isController": true}, {"data": ["UC_03", 744, 0, 0.0, 7514.224462365588, 6570, 8501, 7512.0, 8087.0, 8168.5, 8374.2, 0.2419426433339436, 3.049135755736626, 2.1748965468581765], "isController": true}, {"data": ["/cgi-bin/welcome.pl?page=search", 290, 0, 0.0, 28.099999999999998, 25, 37, 28.0, 31.0, 32.0, 36.0, 0.09670573578392337, 0.07961224147055411, 0.09432163458620615], "isController": false}, {"data": ["/cgi-bin/welcome.pl?signOff=true", 1039, 0, 0.0, 29.43310875842155, 27, 46, 29.0, 32.0, 33.0, 38.0, 0.33721164590764946, 0.33754095415560614, 0.2647638313571779], "isController": false}, {"data": ["/WebTours/home.html", 2073, 0, 0.0, 33.81862035697049, 0, 48, 34.0, 44.0, 46.0, 47.0, 0.6727970278793717, 0.6095698556545296, 0.37722967212991054], "isController": false}, {"data": ["UC_02", 234, 0, 0.0, 14759.692307692309, 13365, 16239, 14779.0, 15480.0, 15741.25, 16179.4, 0.07765281426741041, 1.7253649946713245, 1.0258820314374433], "isController": true}, {"data": ["UC_01", 56, 0, 0.0, 29190.76785714285, 27652, 30614, 29260.5, 30212.7, 30385.75, 30614.0, 0.019971526309632837, 1.0531183922332874, 0.435726434847175], "isController": true}, {"data": ["/Webtours/", 1039, 0, 0.0, 1.092396535129933, 0, 9, 1.0, 2.0, 2.0, 2.0, 0.3372144914600998, 0.21866252180615847, 0.26279019939956993], "isController": false}, {"data": ["Buy", 56, 0, 0.0, 3592.4821428571427, 3051, 4004, 3608.5, 3908.2, 3951.1, 4004.0, 0.020159229111078793, 0.05873892569848129, 0.029578282988958503], "isController": true}, {"data": ["/cgi-bin/login.pl?intro=true", 1037, 0, 0.0, 60.57666345226619, 42, 85, 60.0, 74.0, 75.0, 78.0, 0.3373585379525102, 0.3838112272604242, 0.3163238254424944], "isController": false}, {"data": ["Login", 1037, 0, 0.0, 3707.322082931535, 3189, 4244, 3709.0, 4118.2, 4169.1, 4207.62, 0.33696247661246453, 1.2580653208625263, 0.9833062682250558], "isController": true}, {"data": ["/cgi-bin/nav.pl?in=home", 2073, 0, 0.0, 72.63241678726487, 28, 99, 74.0, 77.0, 79.0, 83.25999999999976, 0.6727906955610744, 1.1525541111917257, 0.5401086669145683], "isController": false}, {"data": ["/cgi-bin/reservations.pl", 402, 0, 0.0, 37.03233830845765, 33, 50, 36.0, 40.69999999999999, 42.0, 46.96999999999997, 0.13409332895695406, 0.3693449547134806, 0.1797618329857581], "isController": false}, {"data": ["Start_Page", 1039, 0, 0.0, 162.4427333974977, 120, 190, 162.0, 170.0, 172.0, 182.0, 0.3371942453047567, 2.0116466165161895, 1.3530577675363726], "isController": true}, {"data": ["Payment", 56, 0, 0.0, 3539.464285714286, 3050, 4023, 3526.0, 3966.7000000000003, 3998.45, 4023.0, 0.020158590511351444, 0.060743643429451405, 0.02549071768901918], "isController": true}, {"data": ["/cgi-bin/nav.pl?page=menu&in=itinerary", 112, 0, 0.0, 71.77678571428571, 64, 87, 71.0, 77.0, 78.35, 86.61000000000001, 0.04032166609124289, 0.06886972069685919, 0.039382955428718315], "isController": false}, {"data": ["/cgi-bin/welcome.pl?page=itinerary", 112, 0, 0.0, 28.08928571428572, 26, 37, 27.0, 31.0, 33.349999999999994, 36.74000000000001, 0.04032226127241216, 0.03221055636800112, 0.04009232650267027], "isController": false}, {"data": ["/cgi-bin/login.pl", 1037, 0, 0.0, 30.93153326904529, 28, 44, 30.0, 34.0, 35.0, 38.0, 0.33736281825806275, 0.2995255891283612, 0.3501715671503285], "isController": false}, {"data": ["/cgi-bin/itinerary.pl", 112, 0, 0.0, 61.30357142857142, 40, 85, 61.0, 75.0, 79.0, 84.74000000000001, 0.04032192738812915, 0.39453737451150167, 0.03871380364481422], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 13016, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
