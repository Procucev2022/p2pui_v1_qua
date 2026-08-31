import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { AppApiConfig } from "src/app/shared/constants/app-api.config";
import { CorrespondenceComponent } from "src/app/shared/modules/common-share/components/correspondence/correspondence.component";
import { PoCreateComponent } from "src/app/shared/modules/common-share/components/po/po-create/po-create.component";
import { ExcelService } from "src/app/shared/modules/common-share/services/excel.service";
import { PoService } from "src/app/shared/modules/common-share/services/po.service";
import { EncryDecryService } from "src/app/shared/services";
import { CreateInvoiceComponent } from "../../invoices/create-invoice/create-invoice.component";
import { PoCreateAsnComponent } from "../po-create-asn/po-create-asn.component";
import { PoViewDeliveryComponent } from "../po-view-delivery/po-view-delivery.component";
import { ViewAsnModalComponent } from "../view-asn-modal/view-asn-modal.component";
import { ViewPosComponent } from "../view-pos/view-pos.component";
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from "@angular/animations";

@Component({
    selector: "app-pos",
    templateUrl: "./pos.component.html",
    styleUrls: ["./pos.component.scss"],
    animations: [
        trigger("rowExpansionTrigger", [
            state(
                "void",
                style({
                    transform: "translateX(-10%)",
                    opacity: 0,
                })
            ),
            state(
                "active",
                style({
                    transform: "translateX(0)",
                    opacity: 1,
                })
            ),
            transition(
                "* <=> *",
                animate("400ms cubic-bezier(0.86, 0, 0.07, 1)")
            ),
        ]),
    ],
})
export class PosComponent implements OnInit {
    selectedData: any = [];
    poList: any = [];
    pageRecordSize: any;
    pageOptions: any;
    posHeader: any = [
        {
            field: "poId",
            header: "PO ID",
            isLink: false,
            width: "320px",
            fieldType: "text",
            isExceedContent: true,
        },
        {
            field: "companyName",
            header: "Vendor Name",
            isLink: false,
            width: "190px",
            fieldType: "text",
            isExceedContent: true,
        },
        {
            field: "poValue",
            header: "PO Value",
            isLink: false,
            width: "150px",
            fieldType: "text",
            isExceedContent: false,
        },
        {
            field: "podesc",
            header: "Description",
            isLink: false,
            width: "205px",
            fieldType: "text",
            isExceedContent: true,
        },
        {
            field: "poStatus",
            header: "Status",
            isLink: false,
            width: "140px",
            fieldType: "text",
            isExceedContent: false,
        },
        {
            field: "userStatus",
            header: "User Status",
            isLink: false,
            width: "140px",
            fieldType: "text",
            isExceedContent: false,
        },
        {
            field: "createdTS",
            header: "Creation Date",
            isLink: false,
            width: "180px",
            fieldType: "date",
            isExceedContent: false,
        },
    ];
    paginatoryDetails: any;
    loggedUserPermissions: any;
    loggedUserDetails: any;
    defaultPermissions;
    ppoItemsById: any;
    roleName: any;
    selectedPoData: any;
    poId: any;

    deliveryHeadersData: {};
    selectedDeliveryId: any;
    deliveryItemsData: {};
    deliveryAsnsData: {};
    deliveryASNInvoiceData: any;
    excelData: any[] = [];
    expandedRows: {} = {};

    constructor(
        private modalDialog: MatDialog,
        private toaster: ToastrService,
        private poService: PoService,
        private encryDecryService: EncryDecryService,
        private excelService: ExcelService
    ) {}

    ngOnInit() {
        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
        const temp = JSON.parse(
            this.encryDecryService.get(localStorage.getItem("logData"))
        );
        this.loggedUserDetails = temp.details;

        this.loggedUserPermissions = this.loggedUserDetails.listofPermission;
        this.pageRecordSize = AppApiConfig.GRID_PAGE_INFO.initpageSize;
        this.pageOptions = AppApiConfig.GRID_PAGE_INFO.pageOptions;
        if (this.loggedUserDetails.role.roleName !== "ClientApprover") {
            this.posHeader = [];
            this.posHeader = [
                {
                    field: "poId",
                    header: "PO ID",
                    isLink: true,
                    width: "280px",
                    fieldType: "text",
                    isExceedContent: false
                },
                {
                    field: "companyName",
                    header: "Vendor Name",
                    isLink: false,
                    width: "190px",
                    fieldType: "text",
                    isExceedContent: true
                },
                {
                    field: "poValue",
                    header: "PO Value",
                    isLink: false,
                    width: "150px",
                    fieldType: "text",
                    isExceedContent: true
                },
                {
                    field: "podesc",
                    header: "Description",
                    isLink: false,
                    width: "205px",
                    fieldType: "text",
                    isExceedContent: true
                },
                {
                    field: "poStatus",
                    header: "Status",
                    isLink: false,
                    width: "140px",
                    fieldType: "text",
                    isExceedContent: false
                },
                {
                    field: "createdTS",
                    header: "Creation Date",
                    isLink: false,
                    width: "180px",
                    fieldType: "date",
                    isExceedContent: false
                },
            ];
        }
        this.getAllPOs();
    }

    getAllPOs() {
        this.poList = [];
        this.roleName =
            this.loggedUserDetails.role.roleName === "Registration"
                ? "Vendor"
                : this.loggedUserDetails.role.roleName;
        switch (this.roleName) {
            case "Vendor":
                console.log(this.posHeader.length);
                this.posHeader.length === 6 ? this.posHeader.splice(1, 1) : "";
                this.poService
                    .getPosByVendor({ id: this.loggedUserDetails.org.id })
                    .subscribe((res) => {
                        if (Array.isArray(res) || res["errorCode"] === 204) {
                            const resArray = Array.isArray(res) ? res : [];
                            this.poList = [...resArray];
                            this.poList.forEach((ele: any) => {
                                if (ele["userStatus"]["uiDisplay"]) {
                                    ele["userStatus"] =
                                        ele["userStatus"]["uiDisplay"];
                                } else {
                                    ele["userStatus"] = "";
                                }
                            });
                        }
                    });
                break;
            case "ClientInitiator":
                this.poService
                    .getPosByClient({ id: this.loggedUserDetails.org.id })
                    .subscribe((res) => {
                        if (Array.isArray(res) || res["errorCode"] === 204) {
                            const resArray = Array.isArray(res) ? res : [];
                            this.poList = [...resArray];
                            this.poList.forEach(
                                (ele: any) =>
                                    (ele["userStatus"] =
                                        ele["userStatus"]["uiDisplay"])
                            );
                        }
                    });
                break;
            case "CategoryManager":
                this.poService.getAllPos().subscribe((res) => {
                    if (Array.isArray(res) || res["errorCode"] === 204) {
                        const resArray = Array.isArray(res) ? res : [];
                        this.poList = [...resArray];
                        this.poList.forEach(
                            (ele: any) =>
                                (ele["userStatus"] =
                                    ele["userStatus"]["uiDisplay"])
                        );
                    }
                });
                break;
            case "PRApprover":
                this.poService
                    .getPosByPrApprover({
                        id: localStorage.getItem("loggedId"),
                        org: { id: localStorage.getItem("orgId") },
                    })
                    .subscribe((res) => {
                        if (Array.isArray(res) || res["errorCode"] === 204) {
                            const resArray = Array.isArray(res) ? res : [];
                            this.poList = [...resArray];
                            this.poList.forEach((ele: any) => {
                                if (ele["userStatus"].uiDisplay) {
                                    ele["userStatus"] =
                                        ele["userStatus"]["uiDisplay"];
                                } else {
                                    ele["userStatus"] = "";
                                }
                            });
                        }
                    });
                break;
            default:
        }
    }

    poActions(po_action) {}

    viewPO(rowData) {
        this.poService.getPoById({ id: rowData.id }).subscribe((res) => {
            if (res["id"]) {
                const dialog = this.modalDialog.open(ViewPosComponent, {
                    width: "80%",
                    minHeight: "400px",
                    maxWidth: "none",
                    data: res,
                });
                dialog.afterClosed().subscribe((result) => {
                    console.log("result.event", result.event);
                    if (result && result.event === "close") {
                        this.getAllPOs();
                    }
                });
            } else {
                this.toaster.warning("Please try again later", "Warning");
            }
        });
    }

    editPO(rowData) {
        if (rowData.status.uiDisplay === "Accepted") {
            this.toaster.warning(
                `Sorry!, PO already approved by Vendor`,
                "Warning"
            );
            return;
        }
        this.poService.getPoById({ id: rowData.id }).subscribe((res) => {
            if (res["id"]) {
                const dialog = this.modalDialog.open(PoCreateComponent, {
                    width: "80%",
                    minHeight: "400px",
                    maxWidth: "none",
                    data: {
                        isPoCreate: false,
                        poData: res,
                    },
                });
                dialog.afterClosed().subscribe((result) => {
                    console.log("result.event", result.event);
                    if (result && result.event === "close") {
                        this.getAllPOs();
                    }
                });
            } else {
                this.toaster.warning("Please try again later", "Warning");
            }
        });
    }

    getCloseRowDetails() {
        this.expandedRows = {};
    }

    getRowDetails(rowData, event) {
        this.expandedRows = {};
        const thisRef = this;
        thisRef.expandedRows[rowData.id] = 1;
        this.poId = null;
        this.selectedData = [rowData];
        this.selectedPoData = Object.assign({}, rowData);
        this.getDeliveryHeaders(rowData);
    }

    viewCorresspondance(rowData, path) {
        rowData["commentRootPath"] = path;
        const dialog = this.modalDialog.open(CorrespondenceComponent, {
            data: rowData,width: '60%', maxWidth: '40%',
            minHeight: 297 , maxHeight: '70vh'
        });

        dialog.afterClosed().subscribe((result) => {
            if (path === "PO-COMMENTS-MODAL") {
                this.getAllPOs();
            }
        });
    }

    onClickCommonGrid(event) {
        console.log("event", event);
        this[event.eventName](event.rowData);
    }

    // Delivery Headers Component
    getDeliveryHeaders(poData) {
        this.poId = null;
        this.deliveryHeadersData = null;
        this.selectedDeliveryId = null;
        this.deliveryItemsData = null;
        this.deliveryAsnsData = null;
        const gridHeaders = [
            {
                field: "deliveryId",
                header: "Delivery Id",
                isLink: true,
                width: "280px",
                fieldType: "text",
            },
            {
                field: "deliveryDate",
                header: "Delivery Date",
                isLink: false,
                width: "190px",
                fieldType: "date",
            },
            {
                field: "isSingleDelivery",
                header: "Single Delivery?",
                isLink: false,
                width: "200px",
                fieldType: "text",
            },
            {
                field: "status",
                header: "Status",
                isLink: false,
                width: "160px",
                fieldType: "text",
            },
            {
                field: "remarks",
                header: "Remarks",
                isLink: false,
                width: "140px",
                fieldType: "text",
            },
            {
                field: "createdTS",
                header: "Creation Date",
                isLink: false,
                width: "180px",
                fieldType: "date",
            },
        ];
        const actionEvents = [
            {
                name: "View Delivery",
                className: "/assets/images/new/view-doc.png",
                eventName: "viewDelivery",
                iconType: "image",
            },
            {
                name: "View Comments",
                className: "/assets/images/new/comments-write.png",
                eventName: "commentsOnDelivery",
                iconType: "image",
            },
        ];

        if (this.loggedUserDetails.role.roleName === "Vendor") {
            actionEvents.push({
                name: "Create ASN",
                className: "create-Asn-icon",
                eventName: "createASN",
                iconType: "regular",
            });
        }
        if (this.loggedUserDetails.role.roleName === "ClientInitiator") {
            actionEvents.push({
                name: "Revise Date",
                className: "/assets/images/new/date-revised.png",
                eventName: "revisedDelivery",
                iconType: "image",
            });
        }

        this.poService.getDeliveryHeadersByPOId({ id: poData.id }).subscribe(
            (res) => {
                if (Array.isArray(res) || res["errorCode"] === 204) {
                    const resArray = Array.isArray(res) ? res : [];
                    resArray.forEach((element) => {
                        element["isSingleDelivery"] = element["single"]
                            ? "Yes"
                            : "No";
                        element["status"] =
                            element["clientStatus"]["uiDisplay"];
                        element["remarks"] = element["remarks"]
                            ? element["remarks"]
                            : "N/A";
                        element["showSpecialIcon"] =
                            element["status"] === "Revise date requested" &&
                            this.loggedUserDetails.role.roleName ===
                                "ClientInitiator"
                                ? true
                                : false;
                    });
                    this.deliveryHeadersData = {
                        actionEvents: [...actionEvents],
                        gridTopButtonActions: [],
                        gridColumnData: resArray || [],
                        gridHeaders: [...gridHeaders],
                        gridTitle: "",
                        displayParentLabel: "PO : ",
                        displayParentId: poData.poId,
                        rowEventClickEventName: "getAsnsAndItemsByDeliveryId",
                        editableCells: [],
                        gridSelectionCheckbox: {
                            showSelction: true,
                            allowMultipleSelection: false,
                        },
                    };
                }
                this.poId = poData.id;
            },
            (err) => {
                this.poId = poData.id;
            }
        );
    }

    editDelivery(deliveryData) {
        console.log("editDelivery", deliveryData);
    }

    viewDelivery(deliveryData) {
        console.log("viewDelivery", deliveryData);
        this.poService
            .getDeliveryById({ id: deliveryData.id })
            .subscribe((response) => {
                console.log("dData", response);

                const dialog = this.modalDialog.open(PoViewDeliveryComponent, {
                    width: "80%",
                    minHeight: "400px",
                    maxWidth: "none",
                    data: {
                        data: response,
                        loggedUserRole: this.loggedUserDetails.role.roleName,
                    },
                });
                dialog.afterClosed().subscribe((result) => {
                    console.log("result.event", result.event);
                    if (result && result.event === "close") {
                        this.getDeliveryHeaders(this.selectedPoData);
                    }
                });
            });
    }

    revisedDelivery(deliveryData) {
        if (deliveryData.clientStatus.status === "CLIENT_ACCEPTED") {
            this.toaster.warning(
                `Already, you approved this delivery`,
                `Sorry! Now, You Can't do this action`
            );
            return;
        }
        this.poService
            .reviseDeliveryDate({ id: deliveryData.id })
            .subscribe((res) => {
                if (res["status"] === "Success") {
                    this.toaster.success("Request sent to vendor", "Success");
                    this.getDeliveryHeaders(this.selectedPoData);
                } else {
                }
            });
    }

    commentsOnDelivery(deliveryData) {
        this.viewCorresspondance(deliveryData, "DELIVERY-COMMENTS-MODAL");
        console.log("commentsOnDelivery", deliveryData);
    }

    getAsnsAndItemsByDeliveryId(deliveryData) {
        this.deliveryItemsData = null;
        this.getAsnsByDeliveryId(deliveryData);
        console.log("rowClickEvent", deliveryData);
        this.selectedDeliveryId = null;
        const gridHeaders = [
            {
                field: "description",
                header: "Description",
                isLink: false,
                width: "300px",
                fieldType: "text",
            },
            {
                field: "brand",
                header: "Specification",
                isLink: false,
                width: "120px",
                fieldType: "text",
            },
            {
                field: "quantity",
                header: "Quantity",
                isLink: false,
                width: "120px",
                fieldType: "text",
            },
            {
                field: "unitofMeasures",
                header: "UOM",
                isLink: false,
                width: "100px",
                fieldType: "text",
            },
            {
                field: "excludetaxamount",
                header: "Basic Amount",
                isLink: false,
                width: "130px",
                fieldType: "text",
            },
            {
                field: "gstValue",
                header: "GST Value",
                isLink: false,
                width: "125px",
                fieldType: "text",
            },
        ];
        const actionEvents = [];

        this.poService.getItemsByDeliveryId({ id: deliveryData.id }).subscribe(
            (res) => {
                if (Array.isArray(res) || res["errorCode"] === 204) {
                    const resArray = Array.isArray(res) ? res : [];
                    this.deliveryItemsData = {
                        actionEvents: [...actionEvents],
                        gridTopButtonActions: [],
                        gridColumnData: resArray || [],
                        gridHeaders: [...gridHeaders],
                        gridTitle: "",
                        displayParentLabel: "Delivery ID : ",
                        displayParentId: deliveryData.deliveryId,
                        rowEventClickEventName: "",
                        editableCells: [],
                        gridSelectionCheckbox: {
                            showSelction: false,
                            allowMultipleSelection: false,
                        },
                    };
                }
                this.selectedDeliveryId = deliveryData.deliveryId;
            },
            (err) => {
                this.selectedDeliveryId = deliveryData.deliveryId;
            }
        );
    }

    createASN(deliveryData) {
        if (deliveryData.clientStatus.status !== "CLIENT_ACCEPTED") {
            this.toaster.warning(
                `Please check with Client, Delivery not yet accepted`,
                `Sorry! Can't be allow to create ASN`
            );
            return;
        }
        const dialog = this.modalDialog.open(PoCreateAsnComponent, {
            width: "80%",
            minHeight: "400px",
            maxWidth: "none",
            data: {
                deliveryData: deliveryData,
                poData: this.selectedPoData,
                loggedUserRole: this.loggedUserDetails.role.roleName,
            },
        });
        dialog.afterClosed().subscribe((result) => {
            console.log("result.event", result.event);
            if (result && result.event === "close") {
                // calll getASNs this.getDeliveryHeaders(this.selectedPoData);
                this.getAsnsAndItemsByDeliveryId(deliveryData);
            }
        });
    }

    getAsnsByDeliveryId(deliveryData) {
        this.deliveryAsnsData = null;
        const gridHeaders = [
            {
                field: "asnId",
                header: "ASN Id",
                isLink: false,
                width: "220px",
                fieldType: "text",
            },
            {
                field: "asndesc",
                header: "Description",
                isLink: false,
                width: "150px",
                fieldType: "text",
            },
            {
                field: "dispatchDate",
                header: "Dispatch Date",
                isLink: false,
                width: "175px",
                fieldType: "date",
            },
            {
                field: "expectedDate",
                header: "Expected Date",
                isLink: false,
                width: "175px",
                fieldType: "date",
            },
            {
                field: "statusUiDisplay",
                header: "Status",
                isLink: false,
                width: "155px",
                fieldType: "text",
            },
            {
                field: "createdTS",
                header: "Creation Date",
                isLink: false,
                width: "155px",
                fieldType: "date",
            },
        ];
        const actionEvents = [
            {
                name: "View ASN",
                className: "fa fa-eye view",
                eventName: "viewASN",
                iconType: "regular",
            },
            {
                name: "View Comments",
                className: "/assets/images/new/comments-write.png",
                eventName: "commentsOnASNs",
                iconType: "image",
            },
        ];

        if (this.loggedUserDetails.role.roleName === "Vendor") {
            actionEvents.push({
                name: "Create Invoice",
                className: "create-Invoice-icon",
                eventName: "createInvoice",
                iconType: "regular",
            });
        }

        this.poService
            .getAsnsByDeliveryId({ id: deliveryData.id })
            .subscribe((response) => {
                if (Array.isArray(response) || response["errorCode"] === 204) {
                    const resArray = Array.isArray(response) ? response : [];
                    resArray.forEach((element) => {
                        element["statusUiDisplay"] =
                            element["clientStatus"]["uiDisplay"];
                    });
                    this.deliveryAsnsData = {
                        actionEvents: [...actionEvents],
                        gridTopButtonActions: [],
                        gridColumnData: resArray || [],
                        gridHeaders: [...gridHeaders],
                        gridTitle: "",
                        displayParentLabel: "Delivery ID : ",
                        displayParentId: deliveryData.deliveryId,
                        rowEventClickEventName: "getInvoicesByASNId",
                        editableCells: [],
                        gridSelectionCheckbox: {
                            showSelction: false,
                            allowMultipleSelection: false,
                        },
                    };
                }
            });
    }

    createInvoice(rowData) {
        if (rowData.clientStatus.status !== "CLIENT_ASN_ACCEPTED") {
            this.toaster.warning(
                `Please check with Client, ASN not yet accepted`,
                `Sorry! you Can't be allow to create INVOICE`
            );
            return;
        }
        const dialog = this.modalDialog.open(CreateInvoiceComponent, {
            width: "80%",
            minHeight: "400px",
            maxWidth: "none",
            data: {
                asnData: rowData,
                poData: this.selectedPoData,
                loggedUserRole: this.loggedUserDetails.role.roleName,
            },
        });
        dialog.afterClosed().subscribe((result) => {
            console.log("result.event", result.event);
            if (result && result.event === "close") {
            }
        });
    }

    commentsOnASNs(asnData) {
        this.viewCorresspondance(asnData, "ASN-COMMENTS-MODAL");
    }

    viewASN(rowData) {
        this.poService.getASNById({ id: rowData.id }).subscribe((res) => {
            if (res["id"]) {
                res["deliveryIdFromParent"] = this.selectedDeliveryId;
                const dialog = this.modalDialog.open(ViewAsnModalComponent, {
                    width: "80%",
                    minHeight: "400px",
                    maxWidth: "none",
                    data: res,
                });
                dialog.afterClosed().subscribe((result) => {
                    if (result["event"] === "close") {
                        this.getAsnsByDeliveryId({ id: rowData.deliveryId });
                    }
                });
            } else {
                this.toaster.warning("Please try again later", "Warning");
            }
        });
    }
    exportAsXLSX(): void {
        this.excelData = [];
        this.poList.forEach((data, i) => {
            const obj = {
                "PO ID": data.poId,
                "Vendor Name": data.companyName,
                "PO Value": data.poValue,
                Description: data.podesc,
                Status: data.status.uiDisplay,
                "Created Time": data.createdTS,
            };
            this.excelData.push(obj);
        });
        this.excelService.exportAsExcelFile(this.excelData, "PO's_Data");
    }
}
