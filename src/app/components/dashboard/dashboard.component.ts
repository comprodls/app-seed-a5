import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class Dashboard implements OnInit {
  firstName: string = "";
  lastName: string = "";
  bundles: any = []
  showBundleLoader: boolean = false;
  constructor(
    private userService: UserService, 
    private router : Router,
    private productService : ProductService) { }

  ngOnInit(): void {
    this.userService.getUserDetails().subscribe((res:any)=> {
      this.firstName = res.user.firstName
      this.lastName = res.user.lastName
    })
    this.showBundleLoader = true
    this.productService.getAllBundles().subscribe((res:any)=> {
      this.showBundleLoader = false
      this.bundles = res.entities
    })
  }

  getOLPProductCode(products : any) {
    const olpproduct =  products.find((product : any) => product['ext-product'].type === 'OLP')
    return olpproduct && olpproduct['dls-product'].code;
  }

  isAbsoluteUrl(url : string) {
    let pat = /(^https?:\/\/)|(^\/\/)/i;
    return pat.test(url);
  }
}
