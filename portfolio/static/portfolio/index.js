document.addEventListener('DOMContentLoaded', function() {

  
  load_graph_2();
  live_data();


});

function load_graph_1() {

  fetch('daily-balances/')
  .then(response => response.json())
  .then(data => {

    var options = {
      chart: {
        type: "area",
        height: '100%',
        foreColor: "#999",
        stacked: false,
        toolbar: {
          autoSelected: "pan",
          show: false
        },
        dropShadow: {
          enabled: true,
          enabledSeries: [0],
          top: -2,
          left: 2,
          blur: 5,
          opacity: 0.06
        }
      },
      title: {
        text: 'Wallet Balance',
        align: 'center',
        style: {
            fontSize: '15px',
            color: '#E8E8E8'
        }
      },
      colors: ['#00E396', '#0090FF'],
      stroke: {
        curve: "smooth",
        width: 3
      },
      dataLabels: {
        enabled: false
      },
      series: [{
        name: 'Balance',
        data: data.dates.map((date, index) => {
          return {
              x: new Date(date).getTime(),
              y: data.balances[index]
          };
      })
      }],
      markers: {
        size: 0,
        strokeColor: "#fff",
        strokeWidth: 3,
        strokeOpacity: 1,
        fillOpacity: 1,
        hover: {
          size: 6
        }
      },
      xaxis: {
        type: "datetime",
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value.toFixed(1);
        },
          offsetX: 14,
          offsetY: -5
        },
        tooltip: {
          enabled: true
        }
      },
      grid: {
        padding: {
          left: -5,
          right: 5
        },
        yaxis: {
          lines: {
            show: false
          }
        }
      },
      tooltip: {
          enabled: false,
          theme: "dark",
        x: {
          format: "dd MMM yyyy"
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left'
      },
      fill: {
          gradient: {
              enabled: true,
              opacityFrom: 0.55,
              opacityTo: 0
          }
      }
    };
  
    var chart = new ApexCharts(document.querySelector("#timeline-chart"), options);
  
    chart.render();



  })

  

}
    
function load_graph_2() {

  fetch('/transactions')
  .then(response => response.json())
  .then(data => {
    const wallet = data.data;
    const labels = Object.keys(wallet);
    const series = Object.values(wallet).map(Number);

    if (series.length) {
      var options = {
        series: series,
        labels: labels,
        chart: {
        type: 'donut',
        height:'100%',
      },
      theme: { 
        monochrome: {
            enabled: true,
            color: '#ee5425',
            shadeTo: 'dark',
            shadeIntensity: 0.9
        },
    },
    title: {
      text: 'Holdings',
      align: 'center',
      style: {
          fontSize: '15px',
          color: '#E8E8E8'
      }
    },
    legend: {
        labels: {
          colors: '#A0A0A0' 
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true
            }
          },
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: '100%'
          },
          legend: {
            position: 'bottom',
          }
        }
      }]
      };

      var chart = new ApexCharts(document.querySelector("#pie"), options);
      chart.render();

    } else {
      var options = {
        series: [1],
        labels: ["Welcome"],
        chart: {
        type: 'donut',
        height:'100%',
      },
      theme: { 
        monochrome: {
            enabled: true,
            color: '#ee5425',
            shadeTo: 'dark',
            shadeIntensity: 0.9
        },
    },
    legend: {
        labels: {
          colors: '#A0A0A0' 
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true
            }
          },
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: '100%'
          },
          legend: {
            position: 'bottom',
          }
        }
      }]
      };

      var chart = new ApexCharts(document.querySelector("#pie"), options);
      chart.render();
    }

    
  });
}

function live_data() {
  const ws = new WebSocket('wss://marketdata.tradermade.com/feedadv');

        ws.onopen = function() {
            ws.send('{"userKey":"wsvjrHMTU22lXEWjohBA", "symbol":"GBPUSD,EURUSD,USDJPY"}');
        };

        ws.onmessage = function(event) {
            const data = event.data;
            if(data !== "Connected"){
                const parsedData = JSON.parse(data);
                if (Array.isArray(parsedData)) {
                    parsedData.forEach(item => {
                        updatePrices(item);
                    });
                } else {
                    updatePrices(parsedData);
                }
            }
        };

        function updatePrices(data) {
          function updatePrice(elementId, newPrice) {
              const element = document.getElementById(elementId);
              const currentPrice = parseFloat(element.textContent);
              
              if (newPrice < currentPrice) {
                  element.style.color = "#FF1919";
              } else if (newPrice > currentPrice) {
                  element.style.color = "#46F0A8";
              } else {
                  element.style.color = "white";
              }
      
              element.textContent = newPrice;
          }
          let sym = data.symbol;
          updatePrice(`${sym}-bid`, data.bid);
          updatePrice(`${sym}-ask`, data.ask);

          // if (data.symbol === "GBPUSD") {
          //     updatePrice("GBPUSD-bid", data.bid);
          //     updatePrice("GBPUSD-ask", data.ask);
          // } else if (data.symbol === "EURUSD") {
          //     updatePrice("EURUSD-bid", data.bid);
          //     updatePrice("EURUSD-ask", data.ask);
          // } else if (data.symbol === "USDJPY") {
          //     updatePrice("USDJPY-bid", data.bid);
          //     updatePrice("USDJPY-ask", data.ask);
          // }
      }
      

        ws.onerror = function(error) {
            console.error('WebSocket error:', error);
        };

        ws.onclose = function() {
            console.log('WebSocket connection closed');
        };
}