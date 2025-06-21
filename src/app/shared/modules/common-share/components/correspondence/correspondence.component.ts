import { Component, OnInit, Inject, OnChanges, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommentsService } from '../../services/comments.service';
import { ToastrService } from 'ngx-toastr';
import { ConvertToBase64Service } from '../../services/convert-to-base64.service';
import { EncryDecryService } from 'src/app/shared/services';


@Component({
    selector: 'app-correspondence',
    templateUrl: './correspondence.component.html',
    styleUrls: ['./correspondence.component.scss'],
})
export class CorrespondenceComponent implements OnInit, OnChanges {
    fileData: any;
    selectedFileName: any;
    selectedFileData: any;
    commentsList: any = [];
    commentFileData: any;
    commentFileType: any;
    commentText: any;
    commentFilesDataList: any = [];
    isPageLoading: boolean;
    loggedUserDetails: any;
    dragAreaClass: string;
    dropDownFlag: boolean;
    selectedVendor: any;
    vendors: any = [];
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private commentService: CommentsService,
        private toastrService: ToastrService,
        private convertSer: ConvertToBase64Service,
        private encryDecryService: EncryDecryService
    ) {}

    ngOnInit() {
        this.dragAreaClass = 'dragarea';
        const temp = JSON.parse(
            this.encryDecryService.get('perm', localStorage.getItem('logData'))
        );
        this.loggedUserDetails = temp.details;
        this.isPageLoading = false;
        console.log('data', this.data);
        this.commentsList = [];
        this.dropDownFlag = this.data.dropDownFlag;

        this.getComments(this.data);
        if (this.dropDownFlag) {
            this.getVendorsList();
        }
    }

    getVendorsList() {
        const req = {
            'id': this.data.id
          };

          this.commentService.getVendorsByRfq(req).subscribe( (data: any[] ) => {
               if (Array.isArray(data)) {
                this.vendors = [];
                data.forEach(d => {
                  this.vendors.push(
                    {
                      id: d.id,
                      vendorStatus : d.vendorStatus,
                      vendorResponseDate : d.vendorResponseDate,
                      email: d.email,
                      phone: d.phone,
                      companyName: d.companyName

                    }
                  );
                });
               } else {
                 this.vendors = [];
               }
          });

    }
    filesDropped(event) {
        const fileData = event;
        console.log('event', event);
        const file = event[0];
        this.convertSer.getBase64(file).then((data: string) => {
            const temp = {
                fileName: file.name,
                file: data.split(',')[1],
            };
            this.commentFilesDataList.push(temp);
        });
    }

    fileUploadEvent(files) {
        const fileData = event;
        // console.log('event1', event);
        const file = files[0];
        this.convertSer.getBase64(file).then((data: string) => {
            const temp = {
                fileName: file.name,
                file: data.split(',')[1],
            };

            // For Single files upload
            this.commentFileData = data.split(',')[1];
            this.commentFileType = file.name;

            // For Muliple files upload
            this.commentFilesDataList.push(temp);
        });
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
        this.fileUploadEvent(files);
        }
      }

    removeFile() {
        this.commentFileData = null;
        this.commentFileType = null;
    }

    getComments(data) {
        const rootPath = data.commentRootPath;
        switch (rootPath) {
            case 'RFQ-COMMENTS-MODAL':
                this.getRFQComments();
                break;
            case 'CAT-RFQ-COMMENTS-MODAL':
                this.getCatRFQComments();
                break;
            case 'PR-COMMENTS-MODAL':
                this.getPRComments();
                break;
            case 'QUOTES-COMMENTS-MODAL':
                this.getQuoteComments();
                break;
            case 'PPO-COMMENTS-MODAL':
                this.getPPOComments();
                break;
            case 'PR-INTERNAL-COMMENTS-MODAL':
                this.getPrClientCommentByPr();
                break;
            case 'PO-COMMENTS-MODAL':
                this.getPoComments();
                break;
            case 'DELIVERY-COMMENTS-MODAL':
                this.getDeliveryComments();
                break;
            case 'ASN-COMMENTS-MODAL':
                this.getASNComments();
                break;

            default:
                console.log('default case');
        }
    }
    getPrClientCommentByPr() {
        const obj = {
            pr: {
                id: this.data.id,
            },
            commentby: {
                id: localStorage.getItem('orgId'),
            },
            user: {
                id: this.loggedUserDetails.id,
            },
        };

        this.commentService
            .getPrClientCommentByPr(obj)
            .subscribe((response) => {
                this.commentsList = response || [];
                this.clearCommentData();
            });
    }

    getPPOComments() {
        const obj = {
            ppo: { id: this.data.id },
            commentby: { id: localStorage.getItem('orgId') },
        };
        this.commentService.getPPOComments(obj).subscribe((response) => {
            this.commentsList = response || [];
            this.clearCommentData();
        });
    }

    getPoComments() {
        const obj = {
            po: { id: this.data.id },
            commentby: { id: localStorage.getItem('orgId') },
        };
        this.commentService.getPOComments(obj).subscribe((response) => {
            this.commentsList = response || [];
            this.clearCommentData();
        });
    }


    getDeliveryComments() {
        const obj = {
            delivery: { id: this.data.id },
            commentby: { id: localStorage.getItem('orgId') },
        };
        this.commentService.getDeliveryComments(obj).subscribe((response) => {
            this.commentsList = response || [];
            this.clearCommentData();
        });
    }

    getASNComments() {
        const obj = {
            asn: { id: this.data.id },
            commentby: { id: localStorage.getItem('orgId') },
        };
        this.commentService.getASNComments(obj).subscribe((response) => {
            this.commentsList = response || [];
            this.clearCommentData();
        });
    }

    getQuoteComments() {
        const obj = {
            quotation: {
                id: this.data.id,
            },
            commentby: {
                id: localStorage.getItem('orgId')
            },
        };
        this.commentService.getQuoteComments(obj).subscribe((response) => {
            this.commentsList = response || [];
            this.clearCommentData();
        });
    }
    getPRComments() {
        const obj = {
            pr: {
                id: this.data.id,
            },
            commentby: {
                id: localStorage.getItem('orgId'),
            },
        };
        this.commentService.getPRComments(obj).subscribe((response) => {
            this.commentsList = response || [];
            this.clearCommentData();
        });
    }

    getCatRFQComments() {
        const obj = {
            rfq: {
                id: this.data.id,
            },
            commentby: {
                id: localStorage.getItem('orgId'),
            },
        };
        this.commentService.getRFQComments(obj).subscribe(
            (response) => {
                this.commentsList = response || [];
                this.clearCommentData();
            },
            (error) => {
                this.commentsList = [];
            }
        );
    }

    getRFQComments() {
        console.log('rfqData', this.data);
        const obj = {
            rfq: {
                id: this.data.rfquuid,
            },
            commentby: {
                id: localStorage.getItem('orgId'),
            },
        };
        this.commentService.getRFQCommentsByRFQandVendor(obj).subscribe(
            (response) => {
                this.commentsList = response || [];
                this.clearCommentData();
            },
            (error) => {
                this.commentsList = [];
            }
        );
    }

    saveComment() {
        console.log('filetype', this.commentFileType);

        let fileType = null;
        let index;
        if (this.commentText === '' || this.commentText == null) {
            this.toastrService.error('Please type your comments', 'Warning');
            return;
        }
        if (this.commentFileData) {
            fileType = this.commentFileType.split('.')[1];
            const allowFileTypes = ['txt', 'jpg', 'jpeg', 'png', 'xls', 'xlsx', 'doc', 'docx', 'pdf'];
            index = allowFileTypes.findIndex((item) => item === fileType.toLowerCase());
            if (index > -1) {
            } else {
                this.toastrService.error('File  should be either Excel Sheet(.xls / .xlsx) / Word Document(.doc / .docx) / Image(Jpg/Jpeg/Png), text(.txt/.pdf) document', 'Warning' );
                return;
            }
        }

        const rootPath = this.data.commentRootPath;
        switch (rootPath) {
            case 'RFQ-COMMENTS-MODAL':
                const rfqObj = {
                    rfq: {
                        id: this.data.rfquuid,
                    },
                    commentby: {
                        id: localStorage.getItem('orgId'),
                    },
                    comment: this.commentText,
                    filetype: this.commentFileType,
                    file: this.commentFileData,
                    commentedUser: localStorage.getItem('loggedUser'),
                };
                this.commentService
                    .saveRFQComments(rfqObj)
                    .subscribe((response) => {
                        this.getRFQComments();
                    });
                break;
            case 'CAT-RFQ-COMMENTS-MODAL':
                if (this.selectedVendor == null || this.selectedVendor === undefined || this.selectedVendor === 'undefined' ) {
                     this.selectedVendor = 'all';
                }
                const catrfqObj = {
                    rfq: {
                        id: this.data.id,
                    },
                    commentby: {
                        id: localStorage.getItem('orgId'),
                    },
                    comment: this.commentText,
                    filetype: this.commentFileType,
                    file: this.commentFileData,
                    replyTo:   this.selectedVendor ,
                    commentedUser: localStorage.getItem('loggedUser'),
                };
                this.commentService
                    .saveRFQComments(catrfqObj)
                    .subscribe((response) => {
                        this.getCatRFQComments();
                    });
                break;
            case 'QUOTES-COMMENTS-MODAL':
                const quotObj = {
                    quotation: {
                        id: this.data.id,
                    },
                    commentby: {
                        id: localStorage.getItem('orgId'),
                    },
                    comment: this.commentText,
                    filetype: this.commentFileType,
                    file: this.commentFileData,
                    commentedUser: localStorage.getItem('loggedUser'),
                };
                this.commentService
                    .saveQuoteComments(quotObj)
                    .subscribe((response) => {
                        this.getQuoteComments();
                    });
                break;
            case 'PR-COMMENTS-MODAL':
                const prObj = {
                    pr: {
                        id: this.data.id,
                    },
                    commentby: {
                        id: localStorage.getItem('orgId'),
                    },
                    comment: this.commentText,
                    filetype: this.commentFileType,
                    file: this.commentFileData,
                    commentedUser: localStorage.getItem('loggedUser'),
                };
                this.commentService
                    .savePRComments(prObj)
                    .subscribe((response) => {
                        this.getPRComments();
                    });
                break;
            case 'PR-INTERNAL-COMMENTS-MODAL':
                const prInternalComObj = {
                    pr: {
                        id: this.data.id,
                    },
                    commentby: {
                        id: localStorage.getItem('orgId'),
                    },
                    comment: this.commentText,
                    filetype: this.commentFileType,
                    file: this.commentFileData,
                    commentedUser: localStorage.getItem('loggedUser'),
                    user: {
                        id: this.loggedUserDetails.id,
                    },
                };
                this.commentService
                    .savePrClientComment(prInternalComObj)
                    .subscribe((response) => {
                        this.getPrClientCommentByPr();
                    });
                break;
            case 'PPO-COMMENTS-MODAL':
                const ppoObj = {
                    ppo: {
                        id: this.data.id,
                    },
                    commentby: {
                        id: localStorage.getItem('orgId'),
                    },
                    comment: this.commentText,
                    filetype: this.commentFileType,
                    file: this.commentFileData,
                    commentedUser: localStorage.getItem('loggedUser'),
                };
                this.commentService
                    .savePPOComments(ppoObj)
                    .subscribe((response) => {
                        this.getPPOComments();
                    });
                break;
                case 'PO-COMMENTS-MODAL':
                const poObj = {
                    po: {
                        id: this.data.id,
                    },
                    commentby: {
                        id: localStorage.getItem('orgId'),
                    },
                    comment: this.commentText,
                    filetype: this.commentFileType,
                    file: this.commentFileData,
                    commentedUser: localStorage.getItem('loggedUser'),
                };
                this.commentService
                    .savePOComments(poObj)
                    .subscribe((response) => {
                        this.getPoComments();
                    });
                break;
                case 'DELIVERY-COMMENTS-MODAL':
                  const deliveryObj = {
                      delivery: {
                          id: this.data.id,
                      },
                      commentby: {
                          id: localStorage.getItem('orgId'),
                      },
                      comment: this.commentText,
                      filetype: this.commentFileType,
                      file: this.commentFileData,
                      commentedUser: localStorage.getItem('loggedUser'),
                  };
                this.commentService
                    .saveDeliveryComments(deliveryObj)
                    .subscribe((response) => {
                        this.getDeliveryComments();
                    });
                break;
                case 'ASN-COMMENTS-MODAL':
                    const asnObj = {
                        asn: {
                            id: this.data.id,
                        },
                        commentby: {
                            id: localStorage.getItem('orgId'),
                        },
                        comment: this.commentText,
                        filetype: this.commentFileType,
                        file: this.commentFileData,
                        commentedUser: localStorage.getItem('loggedUser'),
                    };
                  this.commentService
                      .saveASNComments(asnObj)
                      .subscribe((response) => {
                          this.getASNComments();
                      });
                    break;
            default:
                console.log('default case');
        }
        this.selectedVendor = undefined;
    }

    clearCommentData() {
        this.isPageLoading = true;
        this.commentText = '';
        this.commentFileData = null;
        this.commentFileType = null;
    }

    ngOnChanges() {
    }
}
