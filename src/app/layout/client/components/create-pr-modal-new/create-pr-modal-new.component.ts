import {
    Component,
    Inject,
    Optional,
    OnInit,
    ViewEncapsulation,
    Input,
    Output,
    EventEmitter, HostListener
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, NgForm, FormGroup, FormArray } from '@angular/forms';
import { CreatePrModelService } from '../../services/create-pr-model.service';
import { ConvertToBase64Service } from 'src/app/shared/modules/common-share/services/convert-to-base64.service';
import { ToastrService } from 'ngx-toastr';
import { EncryDecryService } from 'src/app/shared/services';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { swalConfirm } from 'src/app/shared/helpers/swal-confirm';
import { ClientService } from '../../services/client-service.service';
import { ViewChild } from '@angular/core';

// export interface CreatePRFormList {
//   description: string;
//   brand: string;
//   unitofMeasures: number;
//   quantity: number;
// }

@Component({
    selector: 'app-create-pr-modal-new',
    templateUrl: './create-pr-modal-new.component.html',
    styleUrls: ['./create-pr-modal-new.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CreatePrModalNewComponent implements OnInit {
    @Input('dialogData') dialogData;
    @Output() closeCreatePR = new EventEmitter();
    @ViewChild('tabGroup1') tabGroup1;
    selectedIndex = 0;
    selectedFilesArray: any[];
    documentsArray: any[] = [];
    regId: any;
    createModel: any;
    documentsToBase64: any[] = [];
    estimatedPrvalue: any;
    estimatedItemValue: any;
    singleVendor: boolean;
    suggestNewVendor: boolean;
    rateCardAvailable: boolean;
    ratecardName: string;
    rateCardArray: any[] = [];
    todayDate: Date = new Date();
    minDate: any;
    prCorrespond;
    prDescription;
    futureRequirement;
    totalSqft:any;
    priority;
    dueDate;
    descriptionRef;
    pruuid = '';
    dragAreaClass: string;
    dropdownSettings: IDropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true,
    };
    selectedCostCentreItems: any[] = [];
    costCentreList: any[] = [];
    priorities = ['High', 'Low', 'Medium'];
    loggedUserData: any;
    deptName: Date;
    BOQDocument: any;
    BOQDocToBase64: any = [];
    rateCardDocToBase64: any = [];
    rateCardDoc: any;
    prDocumentsBase64: any[] = [];
    rateCardDocument: any;
    rateCardFieldName: any;
    dueDate1;
    savedPRData: any;
    editPrId: any;
    editPRData: any;
    items = [
        {label: 'STEP '},
        {label: 'STEP '},
        {label: 'STEP '},
        {label: 'STEP '}
    ];
    excelData: any[];
    selectedCapexVendors: any[];

    numberOnly(event): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    alphaOnly(event) {
        const key = event.keyCode;
        return (key >= 65 && key <= 90) || key === 8;
    }

    public singleVendorform: any[] = [
        {
            companyName: '',
            contactPerson: '',
            email: '',
            phone: '',
        },
    ];

    public createPRformList: any[] = [];

    public deliveryLocationList: any[] = [
        {
            address: '',
            city: '',
            state: '',
        },
    ];

    prItemsFromInvoice: any[] = [];

    constructor(
        public createPrService: CreatePrModelService,
        private convertSer: ConvertToBase64Service,
        private toaster: ToastrService,
        private encryDecryService: EncryDecryService,
        private clientService: ClientService,
        @Inject(MAT_DIALOG_DATA) public dd: any
    ) {}
    ngOnInit() {
        this.dragAreaClass = 'dragarea';
        this.loggedUserData = JSON.parse(
            this.encryDecryService.get(localStorage.getItem('logData'))
        );
        this.deptName =
            this.loggedUserData.details.department == null
                ? ''
                : this.loggedUserData.details.department.department;
        if (this.dialogData && this.dialogData.prId) {
            console.log(this.dialogData);
            this.pruuid = this.dialogData.prId;
            const payload = {
                approverId: {
                    id: localStorage.getItem('loggedId'),
                },
                id: this.dialogData.prId,
            };
            this.clientService.getPrById(payload).subscribe((res: any) => {
                this.editPRData = res;
                console.log('res--------', res);
                this.editPrId =  res.prId;
                this.clientService.setToEditPRModal(res);
                this.prCorrespond = res.prCorrespond;
                this.prDescription = res.prDescription;

                this.singleVendor = res.singleVendor;

                if (this.singleVendor === true) {
                    this.singleVendorform = [];
                    res.prVendors.forEach((vendor) => {
                        this.singleVendorform.push({
                            companyName: vendor.companyName,
                            contactPerson: vendor.contactPerson,
                            email: vendor.email,
                            phone: vendor.phone,
                        });
                    });
                }

                this.suggestNewVendor = res.suggestNewVendor;
                this.rateCardAvailable = res.rateCardAvailable;

                this.futureRequirement = res.futureRequirement;
                this.totalSqft = res.totalSqft;
                this.priority = res.priority;
                this.dueDate = new Date(Date.parse(res.dueDate));

                this.selectedCostCentreItems = res.clientcostcentre;
                this.estimatedPrvalue = res.estimatedPrvalue;

                if (res.boq === true) {
                } else {
                    // this.createPRformList.shift();
                    this.createPRformList = [];
                    res.pritems.forEach((item) => {
                        this.createPRformList.push(
                            {
                            description: item.description,
                            brand: item.brand,
                            unitofMeasures: item.unitofMeasures,
                            quantity: item.quantity,
                            category: item.category,
                            itemcode: item.itemcode,
                        }
                        );
                    });
                }
                this.deliveryLocationList.shift();
                res.clientdeliverylocation.forEach((location) => {
                    this.deliveryLocationList.push({
                        address: location.address,
                        city: location.city,
                        state: location.state,
                    });
                });

                res.prDocuments.forEach((document) => {
                    const imageBlob = this.dataURItoBlob(document.file);
                    const file = new File([imageBlob], document.fileName);
                    this.documentsArray.push(file);
                });
                this.getPrDocuments();
                console.log('response obj--->', res);
                if (res.rateCardDocument) {
                    const imageBlob = this.dataURItoBlob(res.rateCardDocument);
                    const file = new File([imageBlob], res.ratecardName);
                    this.convertSer.getBase64(file).then((data: string) => {
                        const temp = {
                            fileName: file.name,
                            file: data.split(',')[1],
                        };
                        this.rateCardDocToBase64.push(temp);
                    });
                    this.rateCardFieldName = res.ratecardName;
                }
                console.log('ratecarddoc---', this.rateCardDocToBase64);
                console.log('doc arr---', this.documentsArray);
                setTimeout(() => {
                    this.prItemsFromInvoice = res.pritems;
                }, 1000);
            });
        } else {
            this.savedPRData = null;
            this.clientService.setToEditPRModal(null);
        }
        this.getClientCostCentreByorgId();
        const date = new Date();

        // add a day
        date.setDate(date.getDate() + 1);
        const tomorrow = date.toLocaleDateString();
        this.minDate = new Date(tomorrow);
    }
    dataURItoBlob(dataURI) {
        const byteString = window.atob(dataURI);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([int8Array], { type: 'image/png' });
        return blob;
    }

    editPr(payload: any) {
        this.createPrService.editPr(payload).subscribe((res: any) => {
            console.log('response---', res);
        });
    }
    getClientCostCentreByorgId() {
        const req = {
            organization: {
                id: this.loggedUserData.details.org.id,
            },
        };

        this.createPrService
            .getClientCostCentreByorgId(req)
            .subscribe((res: any) => {
                if (res) {
                    this.costCentreList = res;
                }
            });
    }

    onItemSelect(item: any) {
        console.log(item);
    }
    onSelectAll(items: any) {
        console.log(items);
    }
    addItem() {
        if (this.createPRformList.length < 10) {
            this.createPRformList.push({
                description: '',
                brand: '',
                unitofMeasures: '',
                quantity: '',
                category: '',
                itemCode: '',
            });
        } else {
            this.toaster.error('You can add maximum 10 items only', 'Error');
        }
    }
    removeItem(i: number) {
        this.createPRformList.splice(i, 1);
    }

    addLocation() {
        if (this.deliveryLocationList.length < 10) {
            this.deliveryLocationList.push({
                address: '',
                city: '',
                state: '',
            });
        } else {
            this.toaster.error(
                'You can add maximum 10 locations only',
                'Error'
            );
        }
    }
    removeLocation(i: number) {
        this.deliveryLocationList.splice(i, 1);
    }

    addNewVendor() {
        if (this.singleVendorform.length < 5) {
            this.singleVendorform.push({
                companyName: '',
                contactPerson: '',
                email: '',
                phone: '',
            });
        } else {
            this.toaster.error('You can add maximum 5 vendors only', 'Error');
        }
    }
    removing(i: number) {
        this.singleVendorform.splice(i, 1);
    }

    closeDialog(event) {
        // this.dialogRef.close({ event: event });
    }

    // file upload
    uploadDocuments(files) {
        console.log('files', files);
        Array.from(files).forEach((file) => {
            this.documentsArray.push(file);
        });
        this.getPrDocuments();
    }
     @HostListener('dragover', ['$event']) onDragOver(event: any) {
        this.dragAreaClass = 'droparea';
        event.preventDefault();
      }
      @HostListener('dragenter', ['$event']) onDragEnter(event: any) {
        this.dragAreaClass = 'droparea';
        event.preventDefault();
      }
      @HostListener('dragend', ['$event']) onDragEnd(event: any) {
        this.dragAreaClass = 'dragarea';
        event.preventDefault();
      }
      @HostListener('dragleave', ['$event']) onDragLeave(event: any) {
        this.dragAreaClass = 'dragarea';
        event.preventDefault();
      }
      @HostListener('drop', ['$event']) onDrop(event: any) {
        console.log('in the ondrop');
        this.dragAreaClass = 'dragarea';
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files) {
          const files: FileList = event.dataTransfer.files;
        this.uploadDocuments(files);
        }
      }
    deleteAttachment(index, type) {
        this[type].splice(index, 1);
        this.getPrDocuments();
    }

    removeFile(index) {
        this.selectedFilesArray.splice(index, 1);
    }

    getPrDocuments() {
        this.prDocumentsBase64 = [];
        this.documentsArray.forEach((element) => {
            console.log('elem', element);

            this.convertSer.getBase64(element).then((data: string) => {
                const temp = {
                    fileName: element.name,
                    file: data.split(',')[1],
                };
                this.prDocumentsBase64.push(temp);
            });
        });

        console.log('pr docs', this.prDocumentsBase64);
    }

    exportAsXLSX():void {
        this.excelData = []
        // this.itemList.forEach((data,i) => {
        //   let obj = {
        //     "Customer Name" : data.clientName,
        //     "Item Description" : data.description,
        //     "Specification" : data.specification,
        //     "UOM" : data.uom,
        //     "Procucev Item Code" : data.procucevItemCode,
        //   }
        //   this.excelData.push(obj)
        // })
        // this.excelService.exportAsExcelFile(this.excelData, 'Item_List');
    }


    onSubmit(form: NgForm) {
        if (this.savedPRData && this.deliveryLocationList[0].address.length &&  form.value.dueDate && form.value.prCorrespond) {
            const newCreatePRformList: any[] = [];
            this.createPRformList.forEach((data) => {
                data['unitofMeasures'] = data.uom;
                data['brand'] = data.specification ? data.specification : data.brand;
                data['linkedItemPrice'] = data.linkedItemPrice ? data.linkedItemPrice : parseInt(data.price);
                newCreatePRformList.push(data);
            });

            swalConfirm.open({
                title: '<h5>Please Confirm!!<h5>',
                html: '<h3>Are you sure you want to submit?</h3>',
                confirmButtonText: 'Yes',
                confirmButtonColor: '#006dd5',
                cancelButtonColor: '#d63636',
                showCancelButton: true,
                reverseButtons: true,
            }).then((result) => {
                if (result.value) {
                    setTimeout(() => {
                        console.log('form value--', form.value);
                        console.log('rate value--', this.rateCardDocToBase64[0]);
                        const objdata: any = {
                            prCorrespond: form.value.prCorrespond,
                            deptName: this.deptName,
                            prDescription: form.value.prDescription,
                            singleVendor: form.value.singleVendor,
                            suggestNewVendor: form.value.suggestNewVendor
                                ? form.value.suggestNewVendor
                                : false,
                            rateCardAvailable: form.value.rateCardAvailable,
                            rateCardDocument: form.value.rateCardAvailable
                                ? this.rateCardDocToBase64[0].file
                                : '',
                            ratecardName: form.value.rateCardAvailable
                                ? this.rateCardDocToBase64[0].fileName
                                : '',
                            futureRequirement: form.value.futureRequirement,
                            totalSqft: form.value.totalSqft,
                            priority: form.value.priority,
                            estimatedPrvalue: this.estimatedPrvalue,
                            estimatedItemValue: this.estimatedItemValue,
                            pritems: newCreatePRformList,
                            clientdeliverylocation: this.deliveryLocationList,
                            clientcostcentre: this.selectedCostCentreItems,
                            dueDate: form.value.dueDate,
                            prDocuments: this.prDocumentsBase64,
                            boqfile: this.BOQDocToBase64.length
                                ? this.BOQDocToBase64[0].file
                                : '',
                            boqFileName: this.BOQDocToBase64.length
                                ? this.BOQDocToBase64[0].fileName
                                : '',
                            org: {
                                id: localStorage.getItem('orgId'),
                            },
                            prVendors: this.singleVendorform[0].companyName.length ? this.singleVendorform : undefined,
                            initiator: {
                                id: localStorage.getItem('loggedId'),
                            },
                            createdBy: localStorage.getItem('userFullName')
                        };
                        if (this.pruuid) {
                            objdata.id = this.pruuid;
                        }
                        if (this.editPrId) {
                            objdata.prId = this.editPrId;
                            objdata.createdTS = (new Date().toISOString()).split('Z')[0];
                        }
                        const finalObject =  this.savedPRData ? {...this.savedPRData, ...objdata} : {...objdata};
                        this.createPrService
                            .submitPrdetails(finalObject)
                            .subscribe((res: any) => {
                                if (
                                    res.status === 'Success' ||
                                    res.status === 'success'
                                ) {
                                    this.toaster.success(res.message, 'Success');
                                    this.backToCreatePR();
                                    // this.createPRformList = []
                                    // this.createPRformList = res.pritems
                                    this.createPRformList.forEach((data, i) => {
                                        data['serialNo'] = res.pritems[i].serialNo;
                                    });
                                    this.closeDialog('submit');
                                } else if (
                                    res.status === 'Failure' ||
                                    res.status === 'failure'
                                ) {
                                    this.toaster.error(res.message, 'Failure');
                                }
                                console.log(res);
                            });
                    }, 500);
                }
            });
        } else {
            this.toaster.warning('Please Enter Required Fields', 'Warning');
        }
    }

    uploadRateCard($event) {
        this.rateCardDocToBase64 = [];
        this.rateCardDoc = $event.target.files[0];
        this.convertSer.getBase64(this.rateCardDoc).then((data: string) => {
            const temp = {
                fileName: this.rateCardDoc.name,
                file: data.split(',')[1],
            };

            this.rateCardDocToBase64.push(temp);
            this.rateCardFieldName = '';
        });
    }
    dropRateCard($event) {
        console.log($event);
    }

    deleteRateCard(i) {}

    uploadLineItemFile($event) {
        this.BOQDocument = $event.target.files[0];
        this.convertSer.getBase64(this.BOQDocument).then((data: string) => {
            const temp = {
                fileName: this.BOQDocument.name,
                file: data.split(',')[1],
            };
            this.BOQDocToBase64.push(temp);
        });
    }

    uploadBOQFile($event) {
        this.BOQDocument = $event.target.files[0];
        this.convertSer.getBase64(this.BOQDocument).then((data: string) => {
            const temp = {
                fileName: this.BOQDocument.name,
                file: data.split(',')[1],
            };
            this.BOQDocToBase64.push(temp);
        });
    }
    next(form: NgForm) {
        console.log('tabindex', this.tabGroup1.selectedIndex);
        console.log('pr corresponds ' + form.value.prCorrespond);
        let works = false;
        if (

            form.value.prDescription !== undefined &&
            form.value.prDescription !== '' &&
            form.value.dueDate !== undefined &&
            form.value.dueDate !== '' &&
            form.value.prCorrespond !== undefined &&
            form.value.totalSqft !== '' &&  form.value.totalSqft !== undefined
        ) {
            this.selectedIndex = this.tabGroup1.selectedIndex + 1;
            works = true;
        }
        if (this.createPRformList.length > 0 && works) {
            this.selectedIndex = this.tabGroup1.selectedIndex + 1;
            works = true;
        } else if (
            form.value.brand_0 !== undefined &&
            form.value.brand_0 !== '' &&
            form.value.quantity_0 !== undefined &&
            form.value.quantity_0 !== '' &&
            form.value.description_0 !== undefined &&
            form.value.description_0 !== '' &&
            form.value.unitofMeasures_0 !== undefined &&
            form.value.unitofMeasures_0 !== ''
        ) {
            this.selectedIndex = 2;
            works = true;
        }
        if (
            form.value.city_0 !== undefined &&
            form.value.city_0 !== '' &&
            form.value.address_0 !== undefined &&
            form.value.address_0 !== '' &&
            form.value.state_0 !== undefined &&
            form.value.state_0 !== '' &&
            works
        ) {
            this.selectedIndex = this.tabGroup1.selectedIndex + 1;
            works = true;
        }

        if (!form.value.prDescription) {
            this.toaster.warning('Please Enter PR Description', 'Warning');
            return;
        } else if (!form.value.dueDate) {
            this.toaster.warning('Please select Expacted Date', 'Warning');
            return;
        } else if (!form.value.prCorrespond) {
            this.toaster.warning('Please select Pr Corresponds', 'Warning');
            return;
        }else if(!form.value.totalSqft){
            this.toaster.warning('Please Enter Square Feet', 'Warning');
            return;
        }
        this.formSave(form);
        // if(form.value.estimatedPrvalue!=undefined && form.value.estimatedPrvalue!="")
        // {
        //     this.selectedIndex++;
        // }

        //   console.log(form.value)
        //   form.value['regId'] = this.regId;
        // this.createPrService.saveCreatePr(form.value.description, form.value.materialSpecifications,
        //     form.value.unit_of_Measures, form.value.quantity,form.value.fileupload);
    }

    back() {
        this.selectedIndex--;
    }

    backToCreatePR() {
        this.closeCreatePR.emit({});
    }

    formSave(form: NgForm) {
        if (!form.value.prDescription) {
            this.toaster.warning('Please Enter PR Description', 'Warning');
            return;
        }

        const prItemsList = this.createPRformList.filter((ele) => !ele.isBoqItem);
        const boqPRItemList = this.createPRformList.filter((ele) => ele.isBoqItem);
        prItemsList.forEach((ele) => {
            delete ele.id;
            ele['unitofMeasures'] = ele.uom;
            ele['brand'] = ele.specification ? ele.specification : ele.brand;
            ele['linkedItemPrice'] = ele.linkedItemPrice ? ele.linkedItemPrice : parseInt(ele.price);
        });
        boqPRItemList.forEach((ele) => {
            delete ele.id;
        });
        const objdata: any = {
            "capexFlag":true,
            prCorrespond: form.value.prCorrespond,
            deptName: this.deptName,
            prDescription: form.value.prDescription,
            singleVendor: form.value.singleVendor,
            suggestNewVendor: form.value.suggestNewVendor
                ? form.value.suggestNewVendor
                : false,
            rateCardAvailable: form.value.rateCardAvailable,
            rateCardDocument: form.value.rateCardAvailable
                ? this.rateCardDocToBase64[0].file
                : '',
            ratecardName: form.value.rateCardAvailable
                ? this.rateCardDocToBase64[0].fileName
                : '',
            futureRequirement: form.value.futureRequirement,
            totalSqft: form.value.totalSqft,
            priority: form.value.priority,
            estimatedPrvalue: this.estimatedPrvalue,
            estimatedItemValue: this.estimatedItemValue,
            pritems: prItemsList,
            boqPrItems: boqPRItemList,
            boq: false,
            clientdeliverylocation: this.deliveryLocationList,
            clientcostcentre: this.selectedCostCentreItems,
            dueDate: form.value.dueDate,
            prDocuments: this.prDocumentsBase64,
            prCapexVendors: this.selectedCapexVendors,
            // boqfile: this.BOQDocToBase64.length
            //     ? this.BOQDocToBase64[0].file
            //     : '',
            // boqFileName: this.BOQDocToBase64.length
            //     ? this.BOQDocToBase64[0].fileName
            //     : '',
            org: {
                id: localStorage.getItem('orgId'),
            },
            prVendors: this.singleVendorform[0].companyName.length ? this.singleVendorform : undefined,
            initiator: {
                id: localStorage.getItem('loggedId'),
            },
        };
        if (this.pruuid) {
            objdata.id = this.pruuid;
        }
        if (this.editPrId) {
            objdata.prId = this.editPrId;
            objdata.createdTS = (new Date().toISOString()).split('Z')[0];
        }

        let finalObject =  this.savedPRData ? {...this.savedPRData, ...objdata} : {...objdata};
        if(this.editPRData && this.tabGroup1.selectedIndex == 0 && this.editPRData.pritems){
            finalObject = {...finalObject, ...{'pritems': this.editPRData.pritems}}
        }
        console.log('savedPRDData,', finalObject);
        this.createPrService.savePR(finalObject)
        .subscribe((res: any) => {
            if (res.id) {
                this.toaster.success(res.message, 'Success');
                this.savedPRData = Object.assign({}, res);
                // this.createPRformList = []
                // this.createPRformList = res.pritems
                this.createPRformList.forEach((data, i) => {
                    data['serialNo'] = res.pritems[i].serialNo;
                });
            } else if (
                res.status === 'Failure' ||
                res.status === 'failure'
            ) {
                this.toaster.error(res.message, 'Failure');
            }
            console.log(res);
        });
    }

    onChangeVendor(eve) {
        this.singleVendorform = [{
            companyName: '',
            contactPerson: '',
            email: '',
            phone: '',
        }];
    }

    updatePRList(event) {
        this.selectedCapexVendors =[]
        this.selectedCapexVendors = event.prCapexVendors? event.prCapexVendors: [];
        this.createPRformList = [];
        if (event.prItemsList && event.prItemsList.length > 0) {
            event.prItemsList.forEach(element => {
                if (element.id) {
                    delete element['id'];
                }
                this.createPRformList.push(element);

            });
        }
        if (event.estimatedPRValue > 0 ) {
            this.estimatedPrvalue = event.estimatedPRValue;
        }
        if (event.estimatedItemValue > 0 ) {
            this.estimatedItemValue = event.estimatedItemValue;
        }
    }
    onChangeCostCenter() {
        console.log(this.selectedCostCentreItems);

    }
    ngOnDestroy() {
        this.clientService.$_prData.next(null);
      }
}
