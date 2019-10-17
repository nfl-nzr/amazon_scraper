$(document).ready(function () {
    $("#spinner").toggle();
    $(".view-btn").click(function () {
        $("#spinner").toggle();
        const productId = $(this).attr("data-attr-id");
        console.log(productId);
        $.ajax({
            url: `http://localhost:3000/${productId}/timeline`,
            success: function (response) {
                const { dataSet, labels, product, pointBackgroundColor } = response;
                $("#spinner").toggle();
                $(".help-txt").addClass('d-none');
                var ctx = document.getElementById("myChart").getContext("2d");
                drawChart(ctx, labels, dataSet, pointBackgroundColor);
                $(".card-title").text(product.name);
                $(".price-text").text("Lowest price encountered : ₹​ ");
                $(".price").text(Math.min(...dataSet).toLocaleString('en'))
            }
        });
    });
    $("#form").ajaxForm({
        url: "http://localhost:3000/",
        dataType: "json",
        success: (res) => alert(res)
    })
});

function drawChart(ctx, labels, data, pointBackgroundColor) {
    const chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Pricing",
                    data: data,
                    fill: false,
                    borderColor: "#9370db",
                    pointBackgroundColor,
                }
            ]
        },
        options: {
            elements: {
                line: {
                    lineTension: 0
                },
            },
            tooltips: {
                backgroundColor: "#007bff",
                displayColors: false,
                callbacks: {
                    title: function(tooltipItem, data) {
                        return data['labels'][tooltipItem[0]['index']];
                    },
                    label: function(tooltipItem, data) {
                        return `₹​ ${data['datasets'][0]['data'][tooltipItem['index']].toLocaleString('en')}`;
                    },       
                    
                },
            },
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false,
                    }
                }],
                yAxes: [
                    {
                        gridLines: {
                            display: false,
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    }
                ]
            }
        }
    });

}