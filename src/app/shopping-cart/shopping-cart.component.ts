import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

import { CommonService } from '../shared/common.service';
import { GridService } from '../shared/grid.service';

@Component({
    selector: 'app-shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

    show_spinner: boolean = true;
    rows: any;
    sum: any;
    wrong_quantity: boolean = false;

    has_plan: boolean = false;

    product_cat_array: any = [];
    book_quant: number = 0;
    toy_quant: number = 0;

    already_book: number = 0;
    already_toy: number = 0;

    final_book_quant: number = 0;
    final_toy_quant: number = 0;

    allowed_book: number = 0;
    allowed_toy: number = 0;

    constructor(
        private grid_service: GridService,
        private common_service: CommonService,
        private activated_route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        let count = {};
        let _request_list_me = this.grid_service.setGridData("me");
        _request_list_me.then((success: any) => {
            
            this.already_book = success.book_quantity;
            this.already_toy = success.toy_quantity;
            this.has_plan = success.has_plan;

            this.allowed_book = success.quantity_configuration.allowed_book;
            this.allowed_toy = success.quantity_configuration.allowed_toy;

            let _request_list = this.grid_service.setGridData("product/view-cart");
            _request_list.then((success_cart: any) => {
                this.rows = success_cart.rows;
                for(let i_obj = 0; i_obj < this.rows.length; i_obj++) {
                    this.product_cat_array.push(this.rows[i_obj].product_category);
                }
                
                let unnique = this.myCounter(this.product_cat_array);
                
                // this.product_cat_array.forEach(function(i) { count[i] = (count[i]||0) + 1;});
                if (typeof unnique[1] !== "undefined") {
                    this.book_quant = unnique[1];
                }

                if (typeof unnique[2] !== "undefined") {
                    this.toy_quant = unnique[2];
                }

                let book_array = [];
                let book_obj_cnt = this.findByMatchingProperties(this.rows, { product_category: 1 });
                for (let j_cnt = 0; j_cnt < book_obj_cnt.length; j_cnt++) {
                    book_array.push(book_obj_cnt[j_cnt].quantity);
                }
                let book_quant_val = book_array.reduce(function(a, b) { return a + b; }, 0);
                
                let toy_array = [];
                let toy_obj_cnt = this.findByMatchingProperties(this.rows, { product_category: 2 });
                for (let j_cnt = 0; j_cnt < toy_obj_cnt.length; j_cnt++) {
                    toy_array.push(toy_obj_cnt[j_cnt].quantity);
                }
                let toy_quant_val = toy_array.reduce(function(a, b) { return a + b; }, 0);
                
                this.final_book_quant = Number(this.already_book) + Number(book_quant_val);
                this.final_toy_quant = Number(this.already_toy) + Number(toy_quant_val);
                
                this.sum = success_cart.total_cart_price;
                this.common_service.showSpinner.subscribe((val: boolean) => {
                    this.show_spinner = val;
                });
            });
        });
    }

    myCounter(inputWords) {        
        return inputWords.reduce( (countWords, word) => {
            countWords[word] = ++countWords[word] || 1;
            return countWords;
        }, {});
    }

    findByMatchingProperties(set, properties) {
        return set.filter(function (entry) {
            return Object.keys(properties).every(function (key) {
                return entry[key] === properties[key];
            });
        });
    }

    updateCart() {
        let obj_data = {};
        let rows = this.rows;
        for (let i = 0; i < this.rows.length; i++) {
            obj_data[rows[i].product_id] = parseInt((<HTMLInputElement>document.getElementById("prod_" + i)).value);
        }

        this.common_service.makePostRequest("product/update-cart", { quantity: obj_data })
            .subscribe(
                (response: any) => {
                    this.common_service.commonSnackBarMessage(response.message);
                    this.ngOnInit();
                },
                (error) => {
                    console.log(error);
                    let error_data = error.json();
                }
            )
    }

    restrictzero(val) {
        if (val <= 0) {
            this.wrong_quantity = true;
        } else {
            this.wrong_quantity = false;
        }
    }

    makePayment() {
        let payment_object = {
            amount: this.sum
        };
        let dialogRef = this.dialog.open(CheckoutDialog, {
            width: 'auto',
            data: {
                "response": payment_object,
                "amount": this.sum
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.ngOnInit();
        });
    }

    redirectToPlan() {
        this.router.navigate([
            "/pricing"
        ]);
    }

    removeFromCart(cart_id) {
        this.common_service.makeDeleteRequest("product/" + cart_id + "/cart-delete")
            .subscribe(
                (response: any) => {
                    this.common_service.commonSnackBarMessage(response.message);
                    this.ngOnInit();
                },
                (error) => {
                    console.log(error);
                    let error_data = error.json();
                }
            )
    }

}

// @Component({
//     selector: 'payment-process-dialog',
//     templateUrl: 'payment-process-dialog.html',
// })
// export class PaymentProcessDialog {

//     paramList: any = this.data.response.paramList;
//     checksum: any = this.data.response.checksum;
//     call_url: any = this.data.response.CALL_URL;

//     auth_mode: any = "3D";
//     payment_type_id: any = "DC";
//     card_type: any = "VISA";
//     payment_mode_only: any = "Yes";

//     constructor(
//         public dialogRef: MatDialogRef<PaymentProcessDialog>,
//         @Inject(MAT_DIALOG_DATA) public data: any,
//         private common_service: CommonService
//     ) { }

//     ngOnInit() {
//         let form: any = document.getElementById("f1");
//         setTimeout(() => {
//             form.submit();
//             this.closeDialog();
//         }, 2000);
//     }

//     closeDialog(): void {
//         this.dialogRef.close();
//     }

// }

@Component({
    selector: 'checkout-dialog',
    templateUrl: 'payment-process-dialog.html',
})
export class CheckoutDialog {

    paramList: any = this.data.response.paramList;
    checksum: any = this.data.response.checksum;
    call_url: any = this.data.response.CALL_URL;

    auth_mode: any = "3D";
    payment_type_id: any = "DC";
    card_type: any = "VISA";
    payment_mode_only: any = "Yes";
    final_amount: any = this.data.amount;

    selected_city: string = "";
    valid_address: boolean = false;

    current_address_selected: boolean = false;

    step = 0;
    show_address: boolean = false;

    address_obj: any;

    @ViewChild('address') address:ElementRef; 
    @ViewChild('land_mark') land_mark:ElementRef; 
    @ViewChild('zipcode') zipcode:ElementRef; 
    @ViewChild('city') city:ElementRef; 
    @ViewChild('state') state:ElementRef; 
    @ViewChild('country') country:ElementRef;

    constructor(
        public dialogRef: MatDialogRef<CheckoutDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private common_service: CommonService,
        private grid_service: GridService
    ) { }

    ngOnInit() {
        let _request_list_address = this.grid_service.setGridData("shipping-address");
        _request_list_address.then((success: any) => {
            this.address_obj = success;
        });
        // this.common_service.makePostRequest("payment-process", this.data.response)
        //     .subscribe(
        //         (response: any) => {
        //             let dialogRef = this.dialog.open(PaymentProcessDialog, {
        //                 width: 'auto',
        //                 data: {
        //                     "response": response
        //                 }
        //             });

        //             dialogRef.afterClosed().subscribe(result => {

        //             });
        //         },
        //         (error) => {
        //             console.log(error);
        //             let error_data = error.json();
        //         }
        //     )

        // let form: any = document.getElementById("f1");
        // setTimeout(() => {
        //     form.submit();
        //     this.closeDialog();
        // }, 2000);
    }

    setStep(index: number) {
        this.step = index;
    }

    nextStep() {
        if (this.show_address) {
            let address = this.address.nativeElement.value;
            let land_mark = this.land_mark.nativeElement.value;
            let zipcode = this.zipcode.nativeElement.value;
            let city = this.selected_city;
            let state = "Gujarat";
            let country = "India";
            if (address != "" && zipcode != "" && city != "") {
                this.valid_address = true;
                let address_obj = {
                    address: address,
                    land_mark: land_mark,
                    zipcode: zipcode,
                    city: city,
                    state: state,
                    country: country
                };
                this.common_service.makePostRequest("add-shipping-address", address_obj)
                .subscribe(
                    (response: any) => {
                        this.common_service.commonSnackBarMessage(response.message);
                    },
                    (error) => {
                        console.log(error);
                        let error_data = error.json();
                    }
                )
            } else {
                this.valid_address = false;
            }
        } else {
            if (this.current_address_selected) {
                this.valid_address = true;
            } else {
                this.valid_address = false;
            }
        }
        if (this.show_address && this.selected_city != "") {
            this.step++;
        } else {
            if (this.current_address_selected) {
                this.step++;
            }
        }
    }

    prevStep() {
        this.step--;
    }

    changeCity(value) {
        this.selected_city = value;
    }

    getSelectedAddress(val) {
        if (val.val != "") {
            this.current_address_selected = true;
        } else {
            this.current_address_selected = false;
        }
    }

    showHideAddress(event) {
        if (event.value == 2) {
            this.show_address = true;
        } else {
            this.show_address = false;
        }
    }

    checkoutProduct() {
        let empty_obj = {};
        this.common_service.makePostRequest("checkout-product", empty_obj)
        .subscribe(
            (response: any) => {
                this.common_service.commonSnackBarMessage(response.message);
                this.closeDialog();
            },
            (error) => {
                console.log(error);
                let error_data = error.json();
            }
        )
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

}