$(document).ready((event) => {
  readData()

})


const readData = () => {
  let countDirect = null
  let countCustomer = null
  $.get({
    url: 'dashboards/chart'
  }).done((res) => {
    const { member, direct } = res
    countDirect = direct[0].count
    countCustomer = member[0].count
    
    const doughnut = $('#doughnut');
    new Chart(doughnut, {
      type: 'doughnut',
      data: {
        labels: ["Direct", "Customer"],
        datasets: [{
          cutout: '85%',
          data: [countDirect, countCustomer],
          backgroundColor: ['#132feb', '#10e8e8'],
          hoverBackgroundColor: ['#2e59d9', '#04baba'],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 2,
          xPadding: 15,
          yPadding: 15,
          displayColors: false
        },
        legend: {
          display: false
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true
            }
          }
        },
        cutoutPercentage: 80
      }
    })
  })
};