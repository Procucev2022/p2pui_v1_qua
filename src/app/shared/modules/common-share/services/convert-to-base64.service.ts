import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConvertToBase64Service {

  constructor() { }
  
  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  
}
