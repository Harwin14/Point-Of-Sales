$(document).ready(() => {
    $('#customer-table').DataTable({
        "lengthMenu": [[3, 5, 10, 100], [3, 5, 10, 100]],
        "processing": true,
        "serverSide": true,
        "ajax": "/customers/datatable",
        "columns": [
            { "data": "customerid" },
            { "data": "name" },
            { "data": "address" },
            { "data": "phone" },
            {
                "data": "customerid",
                render: function (data) { 
                    return`
                    <div class="d-grid gap-2 d-md-block">
                            <a type="button"
                                class="btn btn-success rounded-circle" title="Edit"
                                href="/customers/edit/${data}"><i class="fas fa-solid fa-pen"href="/edit"></i></a>
                            <a type="button"
                                class="btn btn-danger  rounded-circle"onclick="$('#modal-delete${data}').modal('show')"
                                title="Delete" ><i
                                    class="fas fa-solid fa-trash"></i></a>
                        </div>
                            <div class="modal fade" id="modal-delete${data}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">Deleted confirmation</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"onclick="$('#modal-delete').modal('hide')">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <p>Are you sure, you want to delete it?</p>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-dismiss="modal"onclick="$('#modal-delete').modal('hide')">No</button>
                                            <a id="btn-delete" type="button" class="btn btn-primary" id="btn-deleted" href="customers/delete/${data}">Yes</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                }
            }
        ]
    });
});