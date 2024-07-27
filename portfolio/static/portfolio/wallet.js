document.addEventListener('DOMContentLoaded', function() {
    // live_balance();
    live_data();
    graph_1();
    graph_2();

    
});

function graph_1() {
  fetch('/get-orders-data/')
  .then(response => response.json())
  .then(data => {
      
      const buyOrders = data.buy_orders;
      const sellOrders = data.sell_orders;

      // Example: Extract datetime and assetval_usd from buy orders
      const buyData = buyOrders.map(order => ({
          x: new Date(order.datetime).getTime(),
          y: order.assetval_usd
      }));

      // Example: Extract datetime and assetval_usd from sell orders
      const sellData = sellOrders.map(order => ({
          x: new Date(order.datetime).getTime(),
          y: order.assetval_usd
      }));

        var options = {
          chart: {
            type: "bar",
            height: '100%',
            foreColor: "#999",
            stacked: false,
            toolbar: {
              show: true
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
          plotOptions: {
            bar: {
              borderRadius: 10,
            }},
          colors: ['#00E396', '#ff5231'],
          stroke: {
            curve: "smooth",
            width: 3
          },
          dataLabels: {
            enabled: false
          },
          series: [{
            name: 'Buy Volume',
            data: buyData
          }, {
            name: 'Sell Volume',
            data: sellData
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
                return value.toFixed(2);},
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
    .catch(error => {
        console.error('Error fetching orders data:', error);
    });
  
  
}

function graph_2() {
  
  const bidaskElements = document.querySelectorAll('.bidask-i');
  const bidaskDict = {};

  bidaskElements.forEach(element => {
   
    const id = element.id.replace('-i', ''); 
    const value = element.textContent;
    bidaskDict[id] = value;

  });

  const labels = Object.keys(bidaskDict);
  const series = Object.values(bidaskDict).map(Number);
 
  var options = {
    series: series,
    labels: labels,
    chart: {
    type: 'donut',
    height:'100%',
  },
  title: {
    text: 'Balance Distribution',
    align: 'center',
    style: {
        fontSize: '15px',
        color: '#E8E8E8'
    }
  },
  theme: {
     
    monochrome: {
        enabled: false,
        color: '#ee5425',
        shadeTo: 'light',
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

function graph_3() {

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
          show: true
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
        text: 'Total Balance',
        align: 'center',
        style: {
            fontSize: '15px',
            color: '#E8E8E8'
        }
      },
      colors: ['#0090FF'],
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
            return value.toFixed(2);
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
          enabled: true,
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
  
    var chart = new ApexCharts(document.querySelector("#timeline-chart-balance"), options);
  
    chart.render();

  })
}

function transaction(method) {
  let type;
  if (method == "+") {
    type = true;
  } else if (method == "-") {
    type = false;
  }

  const asset = document.getElementById("options").value;

  const selectElement = document.getElementById("options");
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const assetid = selectedOption.id;
  
  const value = document.querySelector('#numberInput').value;
  const usd_val = document.querySelector(`#${assetid}-bid`).textContent;

  console.log(type,asset,value,usd_val);
  
  fetch('/transactions', {
    method: 'PUT',
    body: JSON.stringify({
      type: type,
      asset: asset,
      value: value,
      usd_val:usd_val,
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  })
  .then(data => {
    window.location.reload();
  })
}

function live_data() {
  const ws = new WebSocket('wss://marketdata.tradermade.com/feedadv');

        ws.onopen = function() {
            ws.send('{"userKey":"wsvjrHMTU22lXEWjohBA", "symbol":"GBPUSD,EURUSD,USDJPY,USDCHF,USDCAD,AUDUSD,NZDUSD,USDPLN"}');
        };

        ws.onmessage = function(event) {
            const data = event.data;
            if(data !== "Connected"){
                const parsedData = JSON.parse(data);
                if (Array.isArray(parsedData)) {
                    parsedData.forEach(item => {
                        updatePrices(item);
                        update_bdata();
                    });
                } else {
                    updatePrices(parsedData);
                    update_bdata();
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

        //delete
        function update_bdata() {

          let all = ["USD","GBP","EUR","AUD","NZD","JPY","CHF","CAD","PLN"]
          let list1 = ["USD","GBP","EUR","AUD","NZD"]
          let list2 = ["JPY","CHF","CAD","PLN"]

          all.forEach(currency => {
            // Select the element by ID
            let element = document.querySelector(`#${currency}-h`);
            let balanceElement = document.querySelector(`#${currency}-c`);

            // Check if the element exists
            let multiplier;
            if (element) {
                if (list1.includes(currency)) {
                  let RateElement = document.querySelector(`[name="${currency}-b"]`);
                  let rate = RateElement ? parseFloat(RateElement.textContent) : null; 
                  multiplier = rate;
                  let calculatedValue = parseFloat(element.textContent) * multiplier;

                  if (calculatedValue !== null && !isNaN(calculatedValue)) { 
                    
                    if (parseFloat(balanceElement.textContent)> calculatedValue) {
                      balanceElement.innerHTML = calculatedValue.toFixed(5);
                      balanceElement.style.color = "chocolate";
                    } else if (parseFloat(balanceElement.textContent) < calculatedValue) {
                      balanceElement.innerHTML = calculatedValue.toFixed(5);
                      balanceElement.style.color = "chocolate";
                    } else {
                      balanceElement.innerHTML = calculatedValue.toFixed(5);
                      balanceElement.style.color = "white";
                    }

                  } else {
                      balanceElement.innerHTML = '';
                  }
                  
                } else if (list2.includes(currency)) {
                  let RateElement = document.querySelector(`[name="${currency}-b"]`);
                  let rate = RateElement ? parseFloat(RateElement.textContent) : null; 
                  multiplier = 1/rate;
                  let calculatedValue = parseFloat(element.textContent) * multiplier;

                  if (calculatedValue !== null && !isNaN(calculatedValue)) {
                    if (parseFloat(balanceElement.textContent)> calculatedValue) {
                      balanceElement.innerHTML = calculatedValue.toFixed(5);
                      balanceElement.style.color = "chocolate";
                    } else if (parseFloat(balanceElement.textContent) < calculatedValue) {
                      balanceElement.innerHTML = calculatedValue.toFixed(5);
                      balanceElement.style.color = "chocolate";
                    } else {
                      balanceElement.innerHTML = calculatedValue.toFixed(5);
                      balanceElement.style.color = "white";
                    }

                  } else {
                      balanceElement.innerHTML = '';
                  }
                }  
            }; 
          });

          let total = document.querySelectorAll('.bidask-c');
            let sum = 0;

            total.forEach(element => {
                let value = parseFloat(element.textContent);
                if (!isNaN(value)) {
                    sum += value;
                }
            });

          document.querySelector("#sum").innerHTML = sum.toFixed(5);

          let total_initial = document.querySelectorAll('.bidask-i');
          let initial = 0;

          total_initial.forEach(element => {
              let value_i = parseFloat(element.textContent);
              if (!isNaN(value_i)) {
                  initial += value_i;
              }
          });

          let gain = ((sum - initial)*100/initial).toFixed(4);
          if (gain >= 0) {
            document.querySelector("#gain").innerHTML = `${gain}%`;
            document.querySelector("#gain").style.color = '#00E396';
          } else {
            document.querySelector("#gain").innerHTML = `${gain}%`;
            document.querySelector("#gain").style.color = '#ff5231';
          }
        };
}


// function live_balance() {
//   let all = ["USD","GBP","EUR","AUD","NZD","JPY","CHF","CAD","PLN"]
//   let list1 = ["USD","GBP","EUR","AUD","NZD"]
//   let list2 = ["JPY","CHF","CAD","PLN"]

//   all.forEach(currency => {
//     // Select the element by ID
//     let element = document.querySelector(`#${currency}-h`);
//     let balanceElement = document.querySelector(`#${currency}-c`);

//     // Check if the element exists
//     let multiplier;
//     if (element) {
//         if (list1.includes(currency)) {
//           let RateElement = document.querySelector(`[name="${currency}-b"]`);
//           let rate = RateElement ? parseFloat(RateElement.textContent) : null; 
//           multiplier = rate;
//           let calculatedValue = parseFloat(element.textContent) * multiplier;

//           if (calculatedValue !== null && !isNaN(calculatedValue)) { 
//             balanceElement.innerHTML = calculatedValue.toFixed(3);
//           } else {
//               balanceElement.innerHTML = '';
//           }
          
//         } else if (list2.includes(currency)) {
//           let RateElement = document.querySelector(`[name="${currency}-b"]`);
//           let rate = RateElement ? parseFloat(RateElement.textContent) : null; 
//           multiplier = 1/rate;
//           let calculatedValue = parseFloat(element.textContent) * multiplier;

//           if (calculatedValue !== null && !isNaN(calculatedValue)) {
//             balanceElement.innerHTML = calculatedValue.toFixed(3);
//           } else {
//               balanceElement.innerHTML = '';
//           }
//         }  
//     }; 
//   });

//   let total = document.querySelectorAll('.bidask-c');
//     let sum = 0;

//     total.forEach(element => {
//         let value = parseFloat(element.textContent);
//         if (!isNaN(value)) {
//             sum += value;
//         }
//     });
//   document.querySelector("#sum").innerHTML = sum.toFixed(3);

//   let total_initial = document.querySelectorAll('.bidask-i');
//   let initial = 0;

//   total_initial.forEach(elementi => {
//       let value_i = parseFloat(elementi.textContent);
//       if (!isNaN(value_i)) {
//           initial += value_i;
//       }
//   });

//   let gain = (((sum - initial)/initial)*100).toFixed(3);
//   if (gain >= 0) {
//     document.querySelector("#gain").innerHTML = `${gain}%`;
//     document.querySelector("#gain").style.color = '#00E396';
//   } else {
//     document.querySelector("#gain").innerHTML = `${gain}%`;
//     document.querySelector("#gain").style.color = '#ff5231';
//   }
  
// }