import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[ImageThumbnailUpdate]',
  host: {
    '(error)':'updateImageThumbnail()'
  }
})
export class ImageThumbnailUpdateDirective {

  @Input() productData:any;

  updateImageThumbnail() {
    if(this.productData){
      this.productData.image  = '';
    }
  }
}
