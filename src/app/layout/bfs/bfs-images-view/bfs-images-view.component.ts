import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BfsItemsService } from '../bfs-items.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
    selector: 'app-bfs-images-view',
    templateUrl: './bfs-images-view.component.html',
    styleUrls: ['./bfs-images-view.component.scss']
})
export class BfsImagesViewComponent implements OnInit {

    @Input('selectedId') selectedId: any;
    imgBaseUrl: string = 'data:image/';
    @ViewChild('viewImagesPanel') viewImagesPanel: any;
    selectedRowData: any;
    constructor(private bfsService: BfsItemsService, private toaster: ToastrService, private dialog: MatDialog) { }

    ngOnInit() {
    }

    openImagesView() {
        if (!this.selectedId) {
            this.toaster.warning("Buyer/Seller Id details not available", "Warning");
            return
        }

        this.bfsService.getBFSImage({ id: this.selectedId }).subscribe((res: any) => {
            if (Array.isArray(res) && res.length > 0) {
                this.selectedRowData = res;
                const dialogConfig = new MatDialogConfig();
                // dialogConfig.disableClose = true;
                dialogConfig.autoFocus = true;
                dialogConfig.data = null;
                dialogConfig.minWidth = 400;
                dialogConfig.minHeight = 800;
                dialogConfig.maxWidth = 'none';
                dialogConfig.width = '85%';
                const dialogRef = this.dialog.open(this.viewImagesPanel, dialogConfig).afterClosed().subscribe(result => {

                });
            } else {
                this.toaster.error('No Images available!', "Error");
                this.selectedRowData = null;
            }
        })

    }

    getImageUrl(imgData: any) {
        const img = (imgData['fileName'].split('.'))[((imgData['fileName'].split('.')).length) - 1]
        return this.imgBaseUrl + img + ";base64," + imgData['file']
    }
}
