$(document).ready(() => {

    //==================DATA TABLE USERS========================
    $('#users-table').DataTable({
        "lengthMenu": [[3, 5, 10, 100], [3, 5, 10, 100]],
        "processing": true,
        "serverSide": true,
        "ajax": "/users/datatable",
        "columns": [
            { "data": "userid" },
            { "data": "email" },
            { "data": "name" },
            { "data": "role" },
            {
                "data": "userid",
                render: function (data) {
                    return `
                    <div class="d-grid gap-2 d-md-block">
                                                        <a type="button"
                                                            class="btn btn-success rounded-circle" title="Edit"
                                                            href="/users/edit/${data}"><i class="fas fa-solid fa-pen"href=/users/edit/${data}"></i></a>
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
                                                                        <a id="btn-delete" type="button" class="btn btn-primary" id="btn-deleted" href="users/delete/${data}">Yes</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                    `
                }
            }
        ]
    });
    //==================DATA TABLE UNITS========================
    $('#units-table').DataTable({
        "lengthMenu": [[3, 5, 10, 100], [3, 5, 10, 100]],
        "processing": true,
        "serverSide": true,
        "ajax": "/units/datatable",
        "columns": [
            { "data": "unit" },
            { "data": "name" },
            { "data": "note" },
            {
                "data": "unit",
                render: function (data) {
                    return `
                    <div class="d-grid gap-2 d-md-block">
                                                        <a type="button"
                                                            class="btn btn-success rounded-circle" title="Edit"
                                                            href="/units/edit/${data}"><i class="fas fa-solid fa-pen"href="/units/edit/${data}"></i></a>
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
                                                                        <a id="btn-delete" type="button" class="btn btn-primary" id="btn-deleted" href="units/delete/${data}">Yes</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                    `
                }
            }
        ]
    });
    //==================DATA TABLE GOODS========================
    $('#goods-table').DataTable({
        "lengthMenu": [[3, 5, 10, 100], [3, 5, 10, 100]],
        "processing": true,
        "serverSide": true,
        "ajax": "/goods/datatable",
        "columns": [
            { "data": "barcode" },
            { "data": "name" },
            { "data": "stock" },
            { "data": "unit" },
            {
                "data": "purchaseprice",
                render: function (data) {
                    return currencyFormatter.format(data)
                }
            },
            {
                "data": "sellingprice",
                render: function (data) {
                    return currencyFormatter.format(data)
                }
            },
            {
                "data": "picture",
                render: function (data) {
                    return `
                <img src="/images/upload/${data}" alt="Your preview" width="100">
                `
                }
            },
            {
                "data": "barcode",
                render: function (data) {
                    return `
                <div class="d-grid gap-2 d-md-block">
                                                    <a type="button"
                                                        class="btn btn-success rounded-circle" title="Edit"
                                                        href="/goods/edit/${data}"><i class="fas fa-solid fa-pen"href="/edit"></i></a>
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
                                                                    <a id="btn-delete" type="button" class="btn btn-primary" id="btn-deleted" href="goods/delete/${data}">Yes</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                `
                }
            }
        ]
    });
    //==================DATA TABLE SUPPLIERS========================
    $('#suppliers-table').DataTable({
        "lengthMenu": [[3, 5, 10, 100], [3, 5, 10, 100]],
        "processing": true,
        "serverSide": true,
        "ajax": "/suppliers/datatable",
        "columns": [
            { "data": "name" },
            { "data": "address" },
            { "data": "phone" },
            {
                "data": "supplierid",
                render: function (data) {
                    return `
                <div class="d-grid gap-2 d-md-block">
                                                    <a type="button"
                                                        class="btn btn-success rounded-circle" title="Edit"
                                                        href="/suppliers/edit/${data}"><i class="fas fa-solid fa-pen"href="/edit"></i></a>
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
                                                                    <a id="btn-delete" type="button" class="btn btn-primary" id="btn-deleted" href="suppliers/delete/${data}">Yes</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                `
                }
            }
        ]
    });
    //==================DATA TABLE CUSTOMERS========================
    $('#customers-table').DataTable({
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
                    return `
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
    //  //==================DATA TABLE PURCHASES========================

    // let getidUser = `${user.userid}`
    // console.log(getidUser)
    // $('#purchases-table').DataTable({
    //     "lengthMenu": [[3, 5, 10, 100], [3, 5, 10, 100]],
    //     "processing": true,
    //     "serverSide": true,
    //     "ajax": "/purchases/datatable",
    //     "columns": [
    //         { "data": "invoice" },
    //         {
    //             "data": "time",
    //             render: function (data) {
    //                 return ` ${moment(data).format('DD MMM YYYY HH:mm:s')}`
    //             }
    //         },
    //         {
    //             "data": "totalsum",
    //             render: function (data) {
    //                 return currencyFormatter.format(data)
    //             }
    //         },
    //         { "data": "name" },
    //         {
    //             "data": "invoice",
    //             render: function (data) {
    //                 return ` 
    //         <div class="d-grid gap-2 d-md-block">
    //                                             <a type="button"
    //                                                 class="btn btn-success rounded-circle" title="Edit"
    //                                                 href="/purchases/show/${data}"><i class="fas fa-solid fa-pen"href="/edit"></i></a>
    //                                             <a type="button"
    //                                                 class="btn btn-danger rounded-circle" onclick="$('#modal-delete${data}').modal('show')"
    //                                                 title="Delete" ><i
    //                                                     class="fas fa-solid fa-trash"></i></a>
    //                                         </div>
    //                                             <div class="modal fade" id="modal-delete${data}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    //                                                 <div class="modal-dialog" role="document">
    //                                                     <div class="modal-content">
    //                                                         <div class="modal-header">
    //                                                             <h5 class="modal-title">Deleted confirmation</h5>
    //                                                             <button type="button" class="close" data-dismiss="modal" aria-label="Close"onclick="$('#modal-delete').modal('hide')">
    //                                                                 <span aria-hidden="true">&times;</span>
    //                                                             </button>
    //                                                         </div>
    //                                                         <div class="modal-body">
    //                                                             <p>Are you sure, you want to delete it?</p>
    //                                                         </div>
    //                                                         <div class="modal-footer">
    //                                                             <button type="button" class="btn btn-secondary" data-dismiss="modal"onclick="$('#modal-delete').modal('hide')">No</button>
    //                                                             <a id="btn-delete" type="button" class="btn btn-primary" id="btn-deleted" href="/purchases/delete/${data}">Yes</a>
    //                                                     </div>
    //                                                 </div>
    //                                             </div>
    //                                         </div>

    //         `
    //             }
    //         }
    //     ],
    // "rowCallback": function (row, data, index) {
    //         console.log(data.operator)
    //         if (data.operator != getidUser) {
    //             $('td', row).eq(4).css({

    //                 'background-color': 'grey',
    //                 'pointer-events': 'none',
    //                 'cursor': 'default',
    //                 'color': 'white',
    //                 'border-style': 'solid',
    //                 'border-color': '#bdbdbd'
    //             })
    //         }
    //     },
    // });
    // });
    //==================DATA TABLE SALES========================
    // $('#sales-table').DataTable({
    //     "lengthMenu": [[3, 5, 10, 100], [3, 5, 10, 100]],
    //     "processing": true,
    //     "serverSide": true,
    //     "ajax": "/sales/datatable",
    //     "columns": [
    //         { "data": "invoice" },
    //         {
    //             "data": "time",
    //             render: function (data) {
    //                 return ` ${moment(data).format('DD MMM YYYY HH:mm:s')}`
    //             }
    //         },
    //         {
    //             "data": "totalsum",
    //             render: function (data) {
    //                 return currencyFormatter.format(data)
    //             }
    //         },
    //         { "data": "pay" },
    //         { "data": "change" },
    //         { "data": "name" },
    //         {
    //             "data": "invoice",
    //             render: function (data) {
    //                 return `
    //             <div class="d-grid gap-2 d-md-block">
    //                                                 <a type="button"
    //                                                     class="btn btn-success rounded-circle" title="Edit"
    //                                                     href="/sales/show/${data}"><i class="fas fa-solid fa-pen"href="/edit"></i></a>
    //                                                 <a type="button"
    //                                                     class="btn btn-danger rounded-circle" onclick="$('#modal-delete${data}').modal('show')"
    //                                                     title="Delete" ><i
    //                                                         class="fas fa-solid fa-trash"></i></a>
    //                                             </div>
    //                                                 <div class="modal fade" id="modal-delete${data}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    //                                                     <div class="modal-dialog" role="document">
    //                                                         <div class="modal-content">
    //                                                             <div class="modal-header">
    //                                                                 <h5 class="modal-title">Deleted confirmation</h5>
    //                                                                 <button type="button" class="close" data-dismiss="modal" aria-label="Close"onclick="$('#modal-delete').modal('hide')">
    //                                                                     <span aria-hidden="true">&times;</span>
    //                                                                 </button>
    //                                                             </div>
    //                                                             <div class="modal-body">
    //                                                                 <p>Are you sure, you want to delete it?</p>
    //                                                             </div>
    //                                                             <div class="modal-footer">
    //                                                                 <button type="button" class="btn btn-secondary" data-dismiss="modal"onclick="$('#modal-delete').modal('hide')">No</button>
    //                                                                 <a id="btn-delete" type="button" class="btn btn-primary" id="btn-deleted" href="/sales/delete/${data}">Yes</a>
    //                                                         </div>
    //                                                     </div>
    //                                                 </div>
    //                                             </div>
    //             `
    //             }
    //         }
    //     ]
    // });
    //================== DATA TABLE DASHBOARD - REPORT ========================

    $('#dashboards-table').DataTable({
        "lengthMenu": [[3, 5, 10, 100], [3, 5, 10, 100]],
    });
});     
