import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EncryDecryService } from 'src/app/shared/services';
import { RfqService } from '../../vendor/services/rfq.service';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Component({
    selector: 'app-rfq-support-query',
    templateUrl: './rfq-support-query.component.html',
    styleUrls: ['./rfq-support-query.component.scss']
})
export class RfqSupportQueryComponent implements OnInit {
    filtered_rfqList: any = [];
    rfqList: any = [];
    defaultPermissions: any;
    loggedUserPermissions: any;
    loggedUserDetails: any;
    loggedUserName: any;
    messageObj: any = {
        rfqId: '',
        subject: '',
        message: ''
    }
    constructor(private dialog: MatDialog,
        private encryDecryService: EncryDecryService,
        private rfqservice: RfqService,
        private toastrService: ToastrService) { }

    ngOnInit() {
        this.defaultPermissions = AppApiConfig.DEFAULT_PERMISSIONS;
        const temp = JSON.parse(this.encryDecryService.get('perm', localStorage.getItem('logData')));
        this.loggedUserPermissions = temp.details.listofPermission;
        this.loggedUserDetails = temp.details;
        this.loggedUserName = this.loggedUserDetails.username;
        this.rfqservice.getAllRFQSByClientInitiatorGMT({ id: this.loggedUserDetails.id }).subscribe((res: any) => {
            if (Array.isArray(res)) {
                this.rfqList = res || [];
                this.filtered_rfqList = [];
            }
        })
    }

    filterAutoCompleteData(event, inputArrayName, outputArrayName, isStringType) {

        this[outputArrayName] = [];
        const query = event.query ? event.query.toLowerCase() : '';

        this[outputArrayName] = this[inputArrayName].filter(ele => ele != null && (ele.toLowerCase().includes(query)));

        console.log('x', this[outputArrayName])
    }

    sendSupportRequest() {
        if (!this.messageObj.rfqId || !this.messageObj.subject || !this.messageObj.message) {
            this.toastrService.warning("Please Fill the all the required details", "Warning")
            return false;
        }
        const obj = {
            "rfqId": this.messageObj.rfqId,
            "subject": this.messageObj.subject,
            "message": this.messageObj.message,
            "id": this.loggedUserDetails.id

        }
        this.rfqservice.querySupportMailByClientIntiatory(obj).subscribe((res: any) => {
            if (res && res.status == 'Success') {
                this.toastrService.success(res.message, "Success");
                this.resetForm();
            } else {

            }
        })
    }

    resetForm() {
        this.messageObj = {
            rfqId: '',
            subject: '',
            message: ''
        }

    }

}
