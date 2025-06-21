import { Injectable } from '@angular/core';

import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';
import { EncryDecryService } from 'src/app/shared/services';
@Injectable({
  providedIn: 'root'
})
export class ExportPdfService {
  loggedUserDetails: any;

  constructor(private encryDecryService: EncryDecryService) {
    this.getLoggedUserDetails();
   }
   getLoggedUserDetails() {
    const temp = JSON.parse(
      this.encryDecryService.get('perm', localStorage.getItem('logData'))
    );
    this.loggedUserDetails = temp.details;
   }

   // For Quote Comparison PDF
   downloadPDFForQuoteComp(vendorColHeaders: any[], itemRowHeaders: any[], itemArrayList: any[], ppoData) {
    this.getLoggedUserDetails();
    const doc = new jsPDF('landscape');
    doc.setFontSize(15);
    doc.page = 1;
    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.text(12, 12, 'Quote Comparison For PPO: ' + ppoData.ppoId);
    autoTable(doc, { html: '#my-table' });
    const tableHeaders = vendorColHeaders.map(ele => (ele.vendorName + '\n' + ele.quoteId));
    const finalRow = [];
    let itemRows = [];
    const itemRows_statis = [];
    itemRowHeaders.forEach((ele: any) => {
      itemRows = [];
      itemRows.push(ele.serialNo);
      let itemFound;
      const vendorCols = [];
      let isInserted = false;
      const isSubInserted = false;
      vendorColHeaders.forEach((v: any) => {


        itemFound = itemArrayList.find((item: any) => {
          if ((item.pritemId === ele.id && ((item.pritemId === ele.id)) && item.quotationId === v.quotationId) || (item.quotationId === v.quotationId && item.serialNo === ele.serialNo)) {
            return item;
          }
        });
        if (!itemFound && v.vendorName === 'qty' || !itemFound && v.vendorName === 'uom') {
        } else {
          if (!isInserted) {
            if (itemFound) {
              itemRows.push(itemFound.description);
              if (!(itemFound.pritemId.includes('quotTotId'))) {
                itemRows.push(itemFound.quantity);
                itemRows.push(itemFound.unitofMeasures);
                itemRows.push(itemFound.unitprice);
              } else {
                itemRows.push(' ');
                itemRows.push(' ');
                if (itemFound.pritemId === 'quotTotId123') {
                  // console.log('unitprice', itemFound)
                  itemRows.push(itemFound.unitprice);
                } else if (itemFound.pritemId === 'quotTotId1234') {
                  // console.log('basicAmount:::::', itemFound)
                  itemRows.push(itemFound['basicAmount']);
                } else if (itemFound.pritemId === 'quotTotId12345') {
                  itemRows.push(itemFound.gstValues);
                }
              }


            } else {
              itemRows.push(' ');
              itemRows.push(' ');
              itemRows.push(' ');
            }

            isInserted = true;
          } else {
            if (itemFound) {
              if (!(itemFound.pritemId.includes('quotTotId'))) {
                itemRows.push(itemFound.unitprice);
              } else {
                if (itemFound.pritemId === 'quotTotId123') {
                  // console.log('unitprice', itemFound)
                  itemRows.push(itemFound.unitprice);
                } else if (itemFound.pritemId === 'quotTotId1234') {
                  // console.log('basicAmount:::::', itemFound)
                  itemRows.push(itemFound['basicAmount']);
                } else if (itemFound.pritemId === 'quotTotId12345') {
                  itemRows.push(itemFound.gstValues);
                }
              }
            }
          }
        }
      });
      finalRow.push(itemRows);
    });
    const bodyData = finalRow;
    tableHeaders.unshift('Item/Vendor');
    tableHeaders.unshift('S.No');
    autoTable(doc, {
      head: [tableHeaders],
      body: bodyData
    });
    const pageHeight = doc.internal.pageSize.height;
    let y = 20;
    console.log('doc.lastAutoTable.finalY', doc.lastAutoTable.finalY, doc.internal.pageSize.height);
    if (doc.lastAutoTable.finalY + 20 > pageHeight - 150) {

      doc.addPage();
      doc.rect(10, 10, doc.internal.pageSize.width - 20, pageHeight - 20);

      const y = 20;
    } else {
      y = doc.lastAutoTable.finalY + 10;
    }
    doc.setFontSize(16);
    doc.text('Terms & Conditions', doc.internal.pageSize.width / 2, y, {
      align: 'center'
    });
    vendorColHeaders.forEach((ele: any) => {
      if (ele.vendorName === 'qty' || ele.vendorName === 'uom') {
        return;
      }
      if (y + 10 > pageHeight - 40) {
        y = 20;

        doc.addPage();
        doc.setLineWidth(0.3);
      }
      doc.setFont('helvetica');
      doc.setFontType('bold');
      doc.setFontSize(12);
      doc.text(ele.vendorName + ' :', 12, y = y + 15);

      doc.setFontType('normal');
      doc.setFontSize(10);
      doc.text('Payment Terms' + ' : ' + (!!ele.paymentTerms ? ele.paymentTerms : '-'), 20, y = y + 8);
      doc.text('Delivery Terms' + ' : ' + (!!ele.deliveryTerms ? ele.deliveryTerms : '-'), 20, y = y + 8);
      doc.text('Other Terms' + ' : ' + (!!ele.otherTerms ? ele.otherTerms : '-'), 20, y = y + 8);

    });
    this.addFooters(doc);
    const fileName: string = 'QUOT_COMP_' + ppoData.ppoId + '_' + this.getDateTime() + '.pdf';
    doc.save(fileName);
  }


  // For PR Details Export PDF
  exportAsPDF_PRDetails(prDetails: any, ppoData: any) {
    this.getLoggedUserDetails();

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true
     });
     const pageHeight = doc.internal.pageSize.height;
     const pageWidth = doc.internal.pageSize.width;


    doc.setFontSize(12);
    doc.page = 1;
    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setTextColor('#0c2146');
    doc.text(12, 16, 'PR Details For PPO: ' + ppoData.ppoId);
    doc.setFontSize(10);
    doc.setTextColor('#000');
    doc.setFontType('normal');

    doc.text('PR ID', 16, 26);
    doc.text(': ' + prDetails.prId, 75, 26);

    doc.text('PR Corresponds', 16, 36);
    doc.text(': ' + prDetails.prCorrespond, 75, 36);

    doc.text('Department name', 16, 46);
    const dept = prDetails.deptName ? prDetails.deptName : ' - ';
    doc.text(': ' + dept, 75, 46);

    doc.text('Project Description', 16, 56);
    doc.text(': ' + prDetails.prDescription, 75, 56);

    doc.text('Single vendor', 16, 66);
    const singleVendor =  !prDetails.singleVendor ? 'No' : 'Yes';
    doc.text(': ' + singleVendor, 75, 66);

    doc.text('suggested vendors', 16, 76);
    const suggestNewVendor =  !prDetails.suggestNewVendor ? 'No' : 'Yes';
    doc.text(': ' +  suggestNewVendor, 75, 76);



    doc.text('Quote/Rate Card Available ?', 16, 86);
    const rateCardAvailable =  !prDetails.rateCardAvailable ? 'No' : 'Yes';
    doc.text(': ' + rateCardAvailable , 75, 86);

    if (prDetails.rateCardAvailable) {
      doc.text('( ' + prDetails.ratecardName + ')', 95, 86);
    }

    doc.text('Future Requirement Plan', 16, 96);
    const futureReq = prDetails.futureRequirement ? prDetails.futureRequirement : ' - ';
    doc.text(': ' + futureReq, 75, 96);

    doc.text('Priority', 16, 106);
    const priority = prDetails.priority ? prDetails.priority : ' - ';
    doc.text(': ' + priority, 75, 106);

    doc.text('Expected Time', 16, 116);
    const date = new Date(prDetails.dueDate);
    const formatedDate = prDetails.dueDate ?  date.getDate() + '-' + (Number(date.getMonth()) + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() : '-';

    doc.text(': ' + formatedDate, 75, 116);

    doc.text('Estimated PR Value (in  INR)', 16, 126);
    doc.text(': ' + prDetails.estimatedPrvalue, 75, 126);
    doc.setFontType('bold');
    doc.setFontSize(12);
    doc.setTextColor('#0c2146');


    // const prVendors = [
    //   {companyName: 'Abdkf', contactPerson: 'abd', phone: 93289983, email: 'sklfajskdl@sdjfk.com' },
    //   {companyName: 'bcdfd', contactPerson: 'abd', phone: 93289983, email: 'sklfajskdl@sdjfk.com' },
    //   {companyName: 'eefg', contactPerson: 'abd', phone: 93289983, email: 'sklfajskdl@sdjfk.com' },
    //   {companyName: 'hjjfghf', contactPerson: 'abd', phone: 93289983, email: 'sklfajskdl@sdjfk.com' },
    //   {companyName: 'hjjfghf', contactPerson: 'abd', phone: 93289983, email: 'sklfajskdl@sdjfk.com' },
    //   {companyName: 'hjjfghf', contactPerson: 'abd', phone: 93289983, email: 'sklfajskdl@sdjfk.com' },
    //   {companyName: 'hjjfghf', contactPerson: 'abd', phone: 93289983, email: 'sklfajskdl@sdjfk.com' },
    //   {companyName: 'hjjfghf', contactPerson: 'abd', phone: 93289983, email: 'sklfajskdl@sdjfk.com' },
    //   {companyName: 'hjjfghf', contactPerson: 'abd', phone: 93289983, email: 'sklfajskdl@sdjfk.com' },
    // ];

    let y = 136;
    if (prDetails.prVendors.length > 0) {
    doc.text('Vendor Details :', 16, 136);
    doc.setFontSize(10);
    doc.setTextColor('#000');
    doc.setFontType('normal');
      let x = 4;
      let ay = 10;
      let z = 7;
      prDetails.prVendors.forEach((ven: any) => {

        doc.rect(15, y + 3, pageWidth - 30, 21);
        // y = y + x;
        // const z = y + ay;
        doc.text('Company Name', 18, y + 10);
        doc.text(' : ' + ven.companyName, 45, y + 10);
        doc.text('Contact Person', 110, y + 10);
        doc.text(' : ' + ven.contactPerson, 139, y + 10);

        doc.text('Email', 18,  y + 20);
        doc.text(' : ' + ven.email, 45, y + 20);
        doc.text('Contact Number', 110, y + 20);
        doc.text(' : ' + ven.phone, 139, y + 20);
        if ( y  > pageHeight - 40) {
          doc.addPage();

          x = 10;
          ay = 20;
          y = 10;
        } else {
          x = x + 20;
          ay = ay + 20;
          z = z + 12;
          y = y + 25;
        }

      });
    }

    if (prDetails.pritems.length > 0) {


      const tableHeaders = ['Product/Service Description', 'Specifications ' , 'UOM', 'Quantity'];
      const bodyData = prDetails.pritems.map((ele: any) => {
        return [ele.description, ele.brand , ele.unitofMeasures, ele.quantity];
      });

      if ( y  > pageHeight - 40) {
        doc.addPage();
        y = 20;
      } else {
        y = y + 10;
      }
      autoTable(doc, {
        head: [tableHeaders],
        body: bodyData, startY: y + 5
      });
      doc.setFontType('bold');
      doc.setTextColor('#0c2146');
      doc.setFontSize(12);
      doc.text('Line Item Details : ', 16, y);
      y = doc.autoTable.previous.finalY;


      // if (y > pageHeight - 40) {
      //   doc.addPage();
      //
      //   y = 20;
      // } else {
      //   y = y + 5 ;
      // }

      // const addresses = [
      //   {city: 'Abdkf', state: 'abd', phone: 93289983, address: 'sklfajskdl@sdjfk.com' },
      //   {city: 'bcdfd', state: 'abd', phone: 93289983, address: 'sklfajskdl@sdjfk.com' },
      //   {city: 'eefg', state: 'abd', phone: 93289983, address: 'sklfajskdl@sdjfk.com' },
      //   {city: 'hjjfghf', state: 'abd', phone: 93289983, address: 'sklfajskdl@sdjfk.com' },
      //   {city: 'hjjfghf', state: 'abd', phone: 93289983, address: 'sklfajskdl@sdjfk.com' },
      // ];
      if (y > pageHeight - 80) {
        doc.addPage();

        y = 5;
      } else {
        y = y + 10;
      }

      if (prDetails.clientdeliverylocation.length > 0) {
        doc.text('Delivery Details : ', 16, y + 15 );
        doc.setFontSize(10);
        doc.setTextColor('#000');
        doc.setFontType('normal');
       prDetails.clientdeliverylocation.forEach((ele: any) => {
          if (y > pageHeight - 70) {
            doc.addPage();

            y = 10;
          } else {
            y = y + 20;
          }

          doc.rect(15, y + 3, pageWidth - 30, 32);
          doc.text('Address  ', 20, y + 10);
          doc.text(': ' + ele.address, 75, y + 10);
         y = y + 10;
          doc.text('City  ', 20, y + 10);
          doc.text(': ' + ele.city, 75, y + 10);
         y = y + 10;
          doc.text('State  ', 20, y + 10);
          doc.text(': ' + ele.state, 75, y + 10);
        });
      }



    }
    this.addFooters(doc);
    const fileName: string = 'PR_DETAILS_' + ppoData.ppoId + '_' + this.getDateTime() + '.pdf';
    doc.save(fileName);
  }


  footer(doc: jsPDF) {

    doc.text(0, 12, 'digitally generated copy ' + doc.page); // print number bottom right
    doc.page++;
  }
  addFooters = doc => {
    const pageCount = doc.internal.getNumberOfPages();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text('Page ' + String(i)  + ' of ' + String(pageCount), doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 7, { // + ' of ' + String(pageCount)
        align: 'center'
      });
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
      const imageData = AppApiConfig.opacityLogoImageData;
      doc.addImage(imageData, 'png', 25, 32, 80, 40,   null, null, 45);
      doc.addImage(imageData, 'png', pageWidth - 50, 32,  80, 40,   null, null, 45);

      doc.addImage(imageData, 'png', ( pageWidth / 2 - 15) , (pageHeight / 2 - 10),  80, 40,  null, null, 45);

      doc.addImage(imageData, 'png', 25, pageHeight - 28,   80, 40,  null, null, 45);
      doc.addImage(imageData, 'png', pageWidth - 50 , pageHeight - 28,   80, 40,  null, null, 45);

      doc.text('Date & Time : ' + this.getDateTime(), pageWidth - 20, pageHeight - 7, {  align: 'right' });
      doc.text('Generated By : ' + this.loggedUserDetails.fullName + ' (' + this.loggedUserDetails.role.description + ')', 20, pageHeight - 7, {  align: 'left' });
      doc.text('This is digitally generated document ', (pageWidth / 2), pageHeight - 1, {  align: 'center' });

    }

  }

  getDateTime() {
    const date = new Date();
    const month =  (Number(date.getMonth()) + 1);
    return date.getDate() + '-' + (( month).toString().length >1 ? month: '0'+month)  + '-' + date.getFullYear() + ' ' + ((date.getHours()).toString().length >1 ?date.getHours(): '0'+date.getHours()) + ':' + (( date.getMinutes()).toString().length >1 ? date.getMinutes(): '0'+ date.getMinutes()) + ':' + (( date.getSeconds()).toString().length >1 ? date.getSeconds(): '0'+ date.getSeconds());
  }

  getDateForGivenDateTime(currentDate:any) {
    const date = new Date(currentDate);
    const month =  (Number(date.getMonth()) + 1);
    return date.getDate() + '-' + (( month).toString().length >1 ? month: '0'+month)  + '-' + date.getFullYear() + ' ' + ((date.getHours()).toString().length >1 ?date.getHours(): '0'+date.getHours()) + ':' + (( date.getMinutes()).toString().length >1 ? date.getMinutes(): '0'+ date.getMinutes()) + ':' + (( date.getSeconds()).toString().length >1 ? date.getSeconds(): '0'+ date.getSeconds());
  }

  utcToIst(utcDateStr: string): string {
    if(!utcDateStr){
        return '';
    }
    const utcDate = new Date(utcDateStr);

    // Convert UTC to IST by adding 5 hours and 30 minutes
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istDate = new Date(utcDate.getTime() + istOffset);

    // Format IST date to readable string
    return istDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  }
}
