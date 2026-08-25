 export class PO {
    poValue: number;
    desc: string;
    advanceAmount: number;
    clientPONum: string;
    podesc: string;
    otherTerms: string;
    paymentTerms: string;
    deliveryTerms: string;
    vendorAddress: any;
    note: string;
    frieghtTerms: string;
    warranty: string;

    /** Returns a plain snapshot for tests / serialization. */
    toPlainObject() {
      return {
        poValue: this.poValue,
        desc: this.desc,
        advanceAmount: this.advanceAmount,
        clientPONum: this.clientPONum,
        podesc: this.podesc,
        otherTerms: this.otherTerms,
        paymentTerms: this.paymentTerms,
        deliveryTerms: this.deliveryTerms,
        vendorAddress: this.vendorAddress,
        note: this.note,
        frieghtTerms: this.frieghtTerms,
        warranty: this.warranty,
      };
    }
}
