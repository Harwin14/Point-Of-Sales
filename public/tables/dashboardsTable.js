$(document).ready(() => {
    $('#dashboards-table').DataTable({
        "lengthMenu": [[3, 5, 10, 100], [3, 5, 10, 100]],
        "processing": true,
        "serverSide": true,
        "ajax": "/dashboards/datatable",
        "columns": [
            {
                "data": "monthly",
            },
            {
                "rows": "expense",
                render: function (rows) {
                    return currencyFormatter.format(rows)
                }
            },
            {
                "data": "revenue",
                render: function (data) {
                    return currencyFormatter.format(data)
                }
            },
            {
                "data": "earning",
                render: function (data) {
                    return currencyFormatter.format(data)
                }
            }
        ]
    }); 
});     