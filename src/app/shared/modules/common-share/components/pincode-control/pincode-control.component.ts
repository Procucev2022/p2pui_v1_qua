import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-pincode-control',
  templateUrl: './pincode-control.component.html',
  styleUrls: ['./pincode-control.component.scss']
})
export class PincodeControlComponent {
  @Input() className: string = '';
  @Input() placeholder: string = 'Enter PIN code';
  @Input() required: boolean = false;
  @Input() inputFormControlName: string = '';
  @Input() labelClassName: string = '';
  @Input() label: string = 'PIN Code';
  @Input() parentFormGroup: FormGroup = new FormGroup({});
  @Output() updatePincodeValidationStatus: EventEmitter<any> = new EventEmitter<any>();
  @Input() buttonClassName: string = 'btn btn-primary';
  @Input() inputValue: string = '';
  isValid: boolean = false;
  constructor(private commentsService: CommentsService, private toaster: ToastrService) {
  }

  onChangePinCode() {
    this.isValid = false;
    this.updatePincodeValidationStatus.emit({pincodeIsValid: false});
  }

  validatePincode() {
    if(this.parentFormGroup === undefined || this.parentFormGroup === null  || Object.keys(this.parentFormGroup).length === 0){
        if(this.isValid){
         
          this.updatePincodeValidationStatus.emit({pincodeIsValid: false});
          this.isValid = false; 
          return;
      }
      if(this.inputValue === undefined || this.inputValue === null || this.inputValue.length !== 6){
          this.toaster.error('Please enter a valid 6-digit PIN code.');
           this.updatePincodeValidationStatus.emit({pincodeIsValid: false});
           return;
      }

      this.commentsService.getValidatePincode({ pincode: this.inputValue}).subscribe((response:any) => {
        if(response && !!response.id){ 
          this.isValid = true; 
          this.toaster.success('Success', 'Validated PIN code.');
           this.updatePincodeValidationStatus.emit({pincodeIsValid: true, city: response.city, state: response.state});
        } else {
          this.toaster.error('Failure', response.errorMessage);
           this.updatePincodeValidationStatus.emit({pincodeIsValid: false});
        } 
      });
    }
  
    if (this.parentFormGroup.get(this.inputFormControlName)?.errors === null) {
      if(this.isValid){
          this.parentFormGroup.get(this.inputFormControlName)?.enable();
          this.updatePincodeValidationStatus.emit({pincodeIsValid: false});
          this.isValid = false; 
          return;
      }
 
      console.log('PIN code submitted:', this.parentFormGroup.value[this.inputFormControlName]);
      this.commentsService.getValidatePincode({ pincode: this.parentFormGroup.value[this.inputFormControlName] }).subscribe((response:any) => {
        if(response && !!response.id){ 
          this.isValid = true;
          this.parentFormGroup.get(this.inputFormControlName)?.setErrors(null);
          this.parentFormGroup.get(this.inputFormControlName)?.disable();
          this.toaster.success('Success', 'Validated PIN code.');
           this.updatePincodeValidationStatus.emit({pincodeIsValid: true, city: response.city, state: response.state});
        } else {
          this.toaster.error('Failure', response.errorMessage);
           this.updatePincodeValidationStatus.emit({pincodeIsValid: false});
        } 
      });
    } else {
      this.toaster.error('Please enter a valid 6-digit PIN code.');
       this.updatePincodeValidationStatus.emit({pincodeIsValid: false});
    }
  }


  createPincodeControl(): FormControl {
    return new FormControl('', [Validators.required, Validators.pattern(/^\d{4}$/)]);
  }

  numberOnly(event): boolean {
    this.isValid = false;
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
