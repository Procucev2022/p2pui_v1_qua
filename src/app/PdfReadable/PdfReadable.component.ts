import { LoaderService } from 'src/app/shared/services/loader.service';
import { Component, OnInit } from '@angular/core';
import { ConvertToBase64Service } from '../shared/modules/common-share/services/convert-to-base64.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppApiConfig } from '../shared/constants/app-api.config';

@Component({
    selector: 'app-PdfReadable',
    templateUrl: './PdfReadable.component.html',
    styleUrls: ['./PdfReadable.component.scss']
})
export class PdfReadableComponent implements OnInit {
    boqSelectedUser: any;
    selectedOrgData: any;
    boqFile: { fileName: any; file: string; };
    BOQDocument: any;
    fileData:any;
    boqDataList :any = null;
    // boqDataList =
    // {
    //     "General Information": {
    //         "Version": "1.2",
    //         "Effective date": "02/09/2023",
    //         "Previous Date": "20/10/2021",
    //         "Product Name": "NOVUS CE1691L"
    //     },
    //     "sectionsList": [
    //         {
    //             "sectionTitle": "SECTION 1:Identification of the substance/mixture and of the company/undertaking",

    //             "dataList": [
    //                 {
    //                     "data": {
    //                         "title": "somethig data",
    //                         "text": "Veolia Water Technologies & Solutions Middle East FZE   P.O. Box 261939  Plot S20143   Jebel Ali Free Zone South   Dubai , UAE   Tel : +971 48101700 or +971 48101742 Fax : +971 4 224 7922   e-mail : emea.productregulatory@veolia.com ",
    //                         "type": "textarea"
    //                     }
    //                 }
    //             ],
    //             "subSectionList": [
    //                 {
    //                     "subSectionTitle": "1.1. Product identifier",
    //                     "dataList": [{
    //                         "data": {
    //                             "title": "Trade name or designation of the mixture",
    //                             "text": "PETROFLO 20Y114",
    //                             "type": "text"
    //                         }
    //                     }
    //                     ]
    //                 },
    //                 {
    //                     "subSectionTitle": "1.2. Relevant identified uses of the substance or mixture and uses advised agains",
    //                     "dataList": [
    //                         {
    //                             "data": {
    //                                 "title": "Identified uses",
    //                                 "text": "Antifoulant",
    //                                 "type": "text"
    //                             }
    //                         },
    //                         {
    //                             "data": {
    //                                 "title": "Uses advised against ",
    //                                 "text": "None known.",
    //                                 "type": "text"
    //                             }
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     "subSectionTitle": "1.3. Details of the supplier of the safety data sheet",
    //                     "dataList": [
    //                         {
    //                             "data": {
    //                                 "title": "",
    //                                 "text": "Veolia Water Technologies & Solutions Middle East FZE   P.O. Box 261939  Plot S20143   Jebel Ali Free Zone South   Dubai , UAE   Tel : +971 48101700 or +971 48101742 Fax : +971 4 224 7922   e-mail : emea.productregulatory@veolia.com ",
    //                                 "type": "textarea"
    //                             }
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     "subSectionTitle": "1.4. Emergency telephone number",
    //                     "dataList": [
    //                         {
    //                             "data": {
    //                                 "title": "",
    //                                 "text": "Multilingual emergency number (24/7)  Europe, Middle East, Africa (Europe and English language   speaking countries):  +44(0)1235 239670       Middle East & Africa (speaking Arabic):  +44(0)1235 239671 VEOLIAWATERTECH29003-NCEC",
    //                                 "type": "textarea"
    //                             }
    //                         }
    //                     ]
    //                 }
    //             ]
    //         },

    //         {
    //             "sectionTitle": "SECTION 4: First aid measures",

    //             "dataList": [
    //                 {
    //                     "data": {
    //                         "title": "General information",
    //                         "text": "Ensure that medical personnel are aware of the material(s) involved, and take precautions to protect themselves",
    //                         "type": "textarea"
    //                     }
    //                 }
    //             ],
    //             "subSectionList": [
    //                 {
    //                     "subSectionTitle": "4.1. Description of first aid measures",
    //                     "dataList": [
    //                         {
    //                             "data": {
    //                                 "title": "Inhalation",
    //                                 "text": "Move to fresh air. Call a physician if symptoms develop or persist.",
    //                                 "type": "textarea"
    //                             },
    //                         },
    //                         {
    //                             "data": {
    //                                 "title": "Skin contact",
    //                                 "text": "Wash off with soap and water. Get medical attention if irritation develops and persists.",
    //                                 "type": "textarea"
    //                             },
    //                         },
    //                         {
    //                             "data": {
    //                                 "title": "Eye contact",
    //                                 "text": "Immediately flush eyes with plenty of water for at least 15 minutes. Remove contact lenses, if present and easy to do. Continue rinsing. If eye irritation persists: Get medical advice/attention",
    //                                 "type": "textarea"
    //                             }
    //                         },
    //                         {
    //                             "data": {
    //                                 "title": "Ingestion",
    //                                 "text": "Rinse mouth. Get medical attention if symptoms occur.",
    //                                 "type": "textarea"
    //                             }
    //                         }
    //                     ]
    //                 }
    //             ]
    //         }
    //     ]
    // };
    isToggleEditIcon: boolean = true;

    constructor(private loaderService: LoaderService, private converSer: ConvertToBase64Service,
        private toaster: ToastrService, private httpService:HttpClient) { }

    ngOnInit() {
    }

    onUploadFile() {

        this.loaderService.isLoading.next(true);
        this.getPDFData({file: this.boqFile.file}).subscribe((res:any)=>{
            this.loaderService.isLoading.next(false);
            this.boqDataList =res?{...res}: null;
        })
    }

    removeFile() {
        this.boqFile = null;
    }


    getPDFData(requestBody: any): Observable<any> {
        return this.httpService.post(AppApiConfig.apiEndpoint + '/sds/upload', requestBody, {})
    }
    uploadBOQFile($event) {
        this.BOQDocument = $event.target.files[0];
        if ((this.BOQDocument.name.split('.').pop()).toLowerCase() !== 'pdf') {
            this.toaster.warning('Please check file format, only allowed pdf extension files', 'Warning');
            return;
        }
        this.converSer.getBase64(this.BOQDocument).then((data: string) => {
            const temp = {
                fileName: this.BOQDocument.name,
                file: data.split(',')[1]
            };
            this.boqFile = Object.assign({}, temp);
            console.log('data', this.boqFile)
        });
    }

    onEditSection( ){
        this.isToggleEditIcon = !this.isToggleEditIcon;

    }
}
