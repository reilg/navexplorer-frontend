import NumberFormat from "../services/NumberFormat";
import Chart from "chart.js";
import ExplorerApi from "../services/ExplorerApi";

const $ = require('jquery');

class StatIndexPage {
  constructor() {
    console.log("Stats Page");
    // this.populateStakingCoins();
    this.populateSupplyChart();
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
      // get n blocks from explorer api
      // populate chart with data
      ExplorerApi.get(
        "/block",
        {
          sort: 'height:asc',
          size: 1000,
        },
        function (blocks) {
          console.log({ blocks })
          const data = blocks.elements.map(block => {
            return {
              height: block.height,
              supply: block.supply_balance.private + block.supply_balance.public,
            }
          })

          this.loadSupplyChartData(data)
        }.bind(this)
      )
    }
  }

  loadSupplyChartData(blocks) {
    let ctx = $('#supply-chart-chart');
    let loader = $('#supply-chart-chart-loader');

    let options = {
      scales: {
        yAxes: [
          {
            ticks: {
              // Abbreviate millions
              callback: function(value, idx, values) {
                return NumberFormat.formatNav(value);
              },
            }
          }
        ],
        xAxes: [
          {
            ticks: {
              stepSize: 100
            }
          }
        ]
      }
    }

    // let filteredBlocks = blocks.filter(b => {
    //   b.height
    // })

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
  }
}

if ($('body').is('.page-stat-index')) {
  new StatIndexPage();
}
