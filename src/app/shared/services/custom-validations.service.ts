import { Injectable } from '@angular/core';
import { FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { AppConfig } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class CustomValidationsService {

  constructor() { }

  //For Alphabetic strings Only
  public stringsOnly(control: FormControl) {
    var regex = /^[A-Za-z]+$/
    var isValid = control.value ? regex.test(control.value) : false;
    return isValid ? null : { 'stringsOnly': !isValid, 'message': ' White spaces /  Special characters are not allowed ' }
  }


  //For Number Validation inclusion of  Zero value  also
  public numberOnly(control: FormControl) {
    var val = control.value;
    let isNumber = false;
    let numberFormat = /^[0-9]+$/;
    isNumber = (control.value || control.value == 0) ? numberFormat.test(control.value) : false;
    return isNumber ? null : { 'numbersOnly': !isNumber, 'message': ' Numbers Only Allowed' }
  }

  //For Mobile Number Validation
  public mobileNumber(control: FormControl) {
    var val = control.value;
    let isNumber = false;
    let numberFormat = /^[0-9]+$/;
    isNumber = control.value ? (numberFormat.test(control.value) && control.value.length == 10) : false;
    return isNumber ? null : { 'mobileNumber': !isNumber, 'message': ' Invalid Mobile Number' }
  }


  //For String Validation Without Allowing First Character at as space
  public noWhiteSpace(control: FormControl) {
    let isValid = false;
    let isWhitespace = true;
    isWhitespace = (control.value || '').trim().length === 0 || control.value.charAt(0) == ' ';
    isValid = !isWhitespace;
    return isValid ? null : { 'whiteSpace': !isValid, 'message': 'White space is not allowed' }
  }


  //For Whitespace restriction in entire string value
  public avoidWhiteSpace(control: FormControl) {
    if (control.value) {
      // console.log('trim', (control.value || '').trim())
      let isValid = false;
      let isWhitespace = true;
      isWhitespace = control.value.split(' ').length > 1 ? true : false;
      isValid = !isWhitespace;
      return isValid ? null : { 'restrictWhiteSpace': !isValid, 'message': 'White space is not allowed' }
    } else {
      return { 'restrictWhiteSpace': true, 'message': 'White space is not allowed' }
    }
  }



  public getGridPageInfo(event, gridLen) {
    // console.log('event',event);
    if (event) {
      let pageRecordSize = event.rows;
      let startRow = event.first + 1;
      let endRow = startRow + event.rows - 1;
      let totalRows = gridLen;
      let endRowData = endRow >= gridLen ? gridLen : endRow;
      let paginatoryDetails = "Showing " + startRow + " to " + endRowData + " of " + totalRows + " records";
      return paginatoryDetails;
    } else {
      return;
    }

  }

  public initGetPageInfo(totalRows) {
    // console.log('event',event);
    let pageRecordSize = AppConfig.GRID_PAGE_INFO.initpageSize;
    let startRow = 1;
    let endRow = pageRecordSize > totalRows ? totalRows : pageRecordSize;
    let totalRecords = totalRows;
    let endRowData = endRow >= totalRows ? totalRows : endRow;
    let paginatoryDetails = "Showing " + startRow + " to " + endRow + " of " + totalRecords + " records";
    return paginatoryDetails;
  }

  auditGetPageInfo(totalRows, auditPageSize) {
    // console.log('event',event);
    let pageRecordSize = auditPageSize;
    let startRow = 1;
    let endRow = pageRecordSize > totalRows ? totalRows : pageRecordSize;
    let totalRecords = totalRows;
    let endRowData = endRow >= totalRows ? totalRows : endRow;
    let paginatoryDetails = "Showing " + startRow + " to " + endRow + " of " + totalRecords + " records";
    return paginatoryDetails;
  }


}
