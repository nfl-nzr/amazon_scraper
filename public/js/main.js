
let chart;
$(document).ready(function () {
    $("#spinner").toggle();
    $(".view-btn").click(function () {
        $("#spinner").toggle();
        const productId = $(this).attr("data-attr-id");
        $.ajax({
            url: `http://pryspy.openode.io/${productId}/timeline`,
            success: function (response) {
                const { priceData, labels, product, pointBackgroundColor } = response;
                $("#spinner").toggle();
                $(".help-txt").addClass('d-none');
                if (priceData.length > 0 && labels.length > 0) {
                    $('#graph').show()
                    const ctx = document.getElementById("graph").getContext("2d");
                    drawChart(ctx, labels, priceData, pointBackgroundColor);
                    $(".card-title").text(product.name);
                    $(".price-text").text("Lowest price encountered : ₹​ ");
                    $(".price").text(Math.min(...priceData).toLocaleString('en'));
                    $(".current-price-text").text("Current price : ₹​ ");
                    $(".current-price").text(priceData[priceData.length - 1].toLocaleString('en'));
                } else {
                    $('#graph').hide()
                    $(".card-title").text(product.name);
                    $(".price-text").text("No price data available yet. ");
                    $(".price").text('')
                }
            }
        });
    });
    $("#form").on('submit', function (e) {
        e.preventDefault();
        const formData = $('form').serialize();
        $.ajax({

            type: 'post',
            data: formData,
            url: 'http://pryspy.openode.io/',
            dataType: 'json',
            encode: true,
            success: function (response) {
                $('#exampleModalCenter').modal('hide');
            },
            error: function (error) {
                alert(error.responseJSON.message)
                $('#exampleModalCenter').modal('hide')
            }

        });
    });
});

function drawChart(ctx, labels, data, pointBackgroundColor) {
    if (chart) chart.destroy()
    chart = new Chart(ctx, {
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
                    title: function (tooltipItem, data) {
                        return data['labels'][tooltipItem[0]['index']];
                    },
                    label: function (tooltipItem, data) {
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