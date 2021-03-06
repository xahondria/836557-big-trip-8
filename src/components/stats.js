import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from "moment";

function setChart(statsElement, data) {
  const moneyCtx = statsElement.querySelector(`.statistic__money`);
  const transportCtx = statsElement.querySelector(`.statistic__transport`);
  const timeSpendCtx = statsElement.querySelector(`.statistic__time-spend`);

  // Сортировка
  const tripPointsSortedByTripType = data.sort((left, right) => {
    if (left.getState().tripType > right.getState().tripType) {
      return 1;
    }
    if (left.getState().tripType < right.getState().tripType) {
      return -1;
    }
    return 0;
  });

  // Группировка
  let chartTransportData = {
    transportLabels: [],
    transportTypeCounts: [],
  };

  if (tripPointsSortedByTripType.length) {
    chartTransportData = tripPointsSortedByTripType.reduce((memo, current) => {
      const transportTypes = new Set([
        `taxi`,
        `bus`,
        `train`,
        `ship`,
        `transport`,
        `drive`,
        `flight`,
      ]);

      if (transportTypes.has(current.getState().tripType)) {
        const transportLabel = `${current.getState().icon} ${current.getState().tripType}`;
        if (!Object.entries(memo).length) {
          memo = {
            transportLabels: [transportLabel],
            transportTypeCounts: [1],
          };
        } else {
          const prevLabel = memo.transportLabels[memo.transportLabels.length - 1];

          if (prevLabel === transportLabel) {
            memo.transportTypeCounts[memo.transportTypeCounts.length - 1] += 1;

          } else {
            memo.transportLabels.push(transportLabel);
            memo.transportTypeCounts.push(1);
          }
        }
      }
      return memo;
    }, {});
  }

  let chartsData = {
    labels: [],
    moneySpent: [],
    timeSpent: [],
  };
  if (tripPointsSortedByTripType.length) {
    chartsData = tripPointsSortedByTripType.reduce((memo, current) => {
      const label = `${current.getState().icon} ${current.getState().tripType}`;
      const duration = current.getState().endTime - current.getState().startTime;
      if (!Object.entries(memo).length) {
        memo = {
          labels: [label],
          moneySpent: [parseInt(current.fullPrice, 10)],
          timeSpent: [parseInt(moment.duration(duration).format(`H`), 10)],
        };
      } else {
        const prevLabel = memo.labels[memo.labels.length - 1];

        if (prevLabel === label) {
          memo.moneySpent[memo.moneySpent.length - 1] += parseInt(current.fullPrice, 10);
          memo.timeSpent[memo.timeSpent.length - 1] += parseInt(moment.duration(duration).format(`H`), 10);

        } else {
          memo.labels.push(label);
          memo.moneySpent.push(parseInt(current.fullPrice, 10));
          memo.timeSpent.push(parseInt(moment.duration(duration).format(`H`), 10));
        }
      }
      return memo;
    }, {});
  }
  // Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
  const BAR_HEIGHT = 55;
  const barsQuantity = chartsData.labels ? chartsData.labels.length : 0;
  moneyCtx.height = BAR_HEIGHT * barsQuantity;
  transportCtx.height = BAR_HEIGHT * barsQuantity;
  timeSpendCtx.height = BAR_HEIGHT * barsQuantity;

  window._moneyChart = new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: [...chartsData.labels],
      datasets: [{
        data: [...chartsData.moneySpent],
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
  window._transportChart = new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: [...chartTransportData.transportLabels],
      datasets: [{
        data: [...chartTransportData.transportTypeCounts],
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
  window._timeSpendChart = new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: [...chartsData.labels],
      datasets: [{
        data: [...chartsData.timeSpent],
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val} hours`
        }
      },
      title: {
        display: true,
        text: `TIME SPEND`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });

}

export default setChart;
