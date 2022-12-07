import Chart from "chart.js";

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
      // axios.get('/')
    }

    this.loadSupplyChartData();
  }

  loadSupplyChartData() {
    let ctx = $('#supply-chart-chart');
    let loader = $('#supply-chart-chart-loader');

    let options = { }

    let data = {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      datasets: [
        {
          label: 'Amount of coins',
          data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
          fill: true,
          lineTension: 0.1,
        }
      ]
    }

    let chart = new Chart(ctx, {
      type: 'line',
      data: data,
    });

    ctx.show();
    loader.hide();
  }
}

if ($('body').is('.page-stat-index')) {
  new StatIndexPage();
}
