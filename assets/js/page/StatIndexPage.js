import NumberFormat from "../services/NumberFormat";
// import Chart from "chart.js";
import ExplorerApi from "../services/ExplorerApi";

import Highcharts from "highcharts";

const $ = require('jquery');

class StatIndexPage {
  constructor() {
    console.log("Stats Page");

    // this.populateStakingCoins();
    // this.populateSupplyChart();

    try {
      this.getSupplyData();
    } catch (err) {
      console.error('HOY!', err)
    }
  }

  getSupplyData() {
    ExplorerApi.get(
      "/stats/supply",
      {
        size: 100,
        // from:
      },
      function(data) {
        this.loadSupplyChart(data)
      }.bind(this)
    )
    console.log('fetching data ...')
  }

  loadSupplyChart(data) {
    let loader = $('#supply-chart-chart-loader');

    let supplyData = data.elements.map(b => ([b.height, b.supply]))

    Highcharts.chart('supply-chart-chart', {
      chart: {
        zoomType: 'x',
        height: 700,
        events: {
          load: () => {
            loader.hide()
          }
        }
      },

      title: undefined,
      tooltip: {
        valueDecimals: 2
      },
      xAxis: {
        events: {
          afterSetExtremes: this.getSupplyData,
        },
        title: {
          text: 'Block height',
          tickInterval: 100000,
          floor: 0,
        }
      },
      yAxis: {
        title: {
          text: 'Amount of coins',
        },
      },
      legend: {
        enabled: false,
      },
      series: [{
        type: 'line',
        data: supplyData,
        name: 'Spendable supply',
        label: {
          enabled: false,
        }
      }]
    })
  }

  loadChart() {
    let chart = $('#supply-chart');

    let max = 60e6
    let min = 50e6

    let getRandom = (max) => {
      return Math.floor(Math.random() * max)
    }

    let data = [];
    let last = min;
    for (let i = 0; i < 10e3; i++) {
      let next = last + getRandom(1e2);
      last = next
      data.push([ i, next ])
    }

    console.time('load time');
    Highcharts.chart('supply-chart-chart', {
      chart: {
        zoomType: 'x',
        height: 700,
        events: {
          load: () => {
            console.log('THISer', this, testv)
          },
        },
      },

      title: undefined,

      tooltip: {
        valueDecimals: 2
      },

      xAxis: {
        type: 'linear',
        title: {
          text: 'Block height',
        }
      },

      yAxis: {
        type: 'linear',
        title: {
          text: 'Amount of coins',
        }
      },

      series: [{
        data: data,
        lineWidth: 1,
        name: 'Amount of coins'
      }]
    })
    console.timeEnd('load time');
  }

  populateStakingCoins() {
    console.info("populateStakingCoins");
    let stakingCoins = $('#staking-coins-chart');

    let ctx = $("#staking-coins-chart");
    let loader = $("#staking-coins-chart-loader");

    let options = {}

    let data = {
      labes: {},
      datasets: [],
    }

    let myLineChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: options,
    })

    ctx.show()
    loader.hide();
  }

  populateSupplyChart() {
    console.info("populateSupplyChart");
    let supplyChart = $('#supply-chart');
    if (supplyChart.length) {
      console.time('load');
      ExplorerApi.get(
        "/block",
        {
          sort: 'height:asc',
          size: 1000,
          page: 1,
        },
        function(data) {
          console.log({ data });
          let blocks = data.elements.map(block => {
            return {
              height: block.height,
              supply: block.supply_balance.private + block.supply_balance.public,
            }
          });

          this.loadSupplyChartData(blocks);
        }.bind(this)
      )
    }
  }

  loadSupplyChartData(blocks) {

    blocks = []
    for (let i = 0; i < 1e6; i++) {
      blocks.push({
        height: i,
        supply: i,
      })
    }
    console.log(blocks);

    let ctx = $('#supply-chart-chart');
    let loader = $('#supply-chart-chart-loader');

    let options = {
      scales: {
        yAxes: [
          {
            ticks: {
              // NOTE:
              // Figure out a way to load all the millions of data
              // or maybe index it to something else?
              // or create a new endpoint that spits out all the data at once
              //
              // Also maybe look into zoom plugin for chartjs
              //
              // It's also possible that we'd need to use a different
              // chart package for this.
              //
              // Abbreviate millions
              // callback: function(val, idx) {
              //   return NumberFormat.formatSatNav(val);
              // },
              maxTicksLimit: 10,
              // beginAtZero: true,
            }
          }
        ],
        xAxes: [
          {
            ticks: {
              maxTicksLimit: 10,
              beginAtZero: true,
            }
          }
        ]
      }
    }

    let data = {
      labels: blocks.map(b => b.height),
      datasets: [
        {
          label: 'Amount of coins',
          data: blocks.map(b => b.supply),
          fill: true,
          lineTension: 0.1,
          backgroundColor: "rgba(0,0,0,0)",
          borderColor: "rgb(183, 61, 175)",
          borderWidth: 1,
          pointRadius: 0.1,
          pointStyle: 'line',
          pointBackgroundColor: "rgb(183, 61, 175)",
          spanGaps: true,
        }
      ]
    }

    let chart = new Chart(ctx, {
      type: 'line',
      data,
      options,
    });

    ctx.show();
    loader.hide();
    console.timeEnd('load');
  }
}

if ($('body').is('.page-stat-index')) {
  new StatIndexPage();
}
