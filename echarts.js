/**
 * Created with PyCharm.
 * User: jibt
 * Date: 13-11-18
 * Time: 下午8:28
 * To change this template use File | Settings | File Templates.
 */
function drawChart() {
    require(
        [
            'echarts'  ,
            'echarts/chart/bar'  ,
            'echarts/chart/line'
        ],
        function (ec) {
            var myChart = ec.init(document.getElementById('chartArea'));
            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: [  '蒸发量'  , '降水量'  ]
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: true,
                        dataView: {readOnly: false  },
                        magicType: [  'line'  , 'bar'  ],
                        restore: true,
                        saveAsImage: true
                    }
                },
                calculable: true,
                dataZoom: {
                    show: true,
                    realtime: true,
                    //orient: 'vertical',   // 'horizontal'
                    //x: 0,
                    y: 36,
                    //width: 400,
                    height: 20,
                    backgroundColor: 'rgba(221,160,221,0.5)',
                    dataBackgroundColor: 'rgba(138,43,226,0.5)',
                    fillerColor: 'rgba(38,143,26,0.6)',
                    handleColor: 'rgba(128,43,16,0.8)',
                    //xAxisIndex:[],
                    //yAxisIndex:[],
                    start: 40,
                    end: 60
                },
                xAxis: [
                    {
                        type: 'category',
                        data: [  '1月'  , '2月'  , '3月'  , '4月'  , '5月'  , '6月'  , '7月'  , '8月'  , '9月'  , '10月'  , '11月'  , '12月'  ]
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitArea: {show: true  }
                    }
                ],
                series: [
                    {
                        name: '蒸发量',
                        type: 'bar',
                        data: [  2.0  , 4.9  , 7.0  , 23.2  , 25.6  , 76.7  , 135.6  , 162.2  , 32.6  , 20.0  , 6.4  , 3.3  ]
                    },
                    {
                        name: '降水量',
                        type: 'bar',
                        data: [  2.6  , 5.9  , 9.0  , 26.4  , 28.7  , 70.7  , 175.6  , 182.2  , 48.7  , 18.8  , 6.0  , 2.3  ]
                    }
                ]
            };

            myChart.setOption(option);
        }
    );
}
