import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { CommonService } from '../../shared/common.service';
import { GridService } from '../../shared/grid.service';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

    constructor(
        private activated_route: ActivatedRoute,
        private common_service: CommonService,
        private grid_service: GridService,
        private router: Router
    ) { }

    add_review: FormGroup;
    rating: FormControl;
    review: FormControl;

    row: any;
    show_spinner: boolean = true;
    total_item: number = 1;
    product_id: string;

    auth_tokn: boolean = false;
    review_data: Array<any>;

    has_plan: boolean = false;
    total_quantity_purchase: number = 0;
    books_quantity: number = 0;
    toys_quantity: number = 0;
    quantity_configuration: any;
    can_rent: boolean = false;

    ngOnInit() {
        if (localStorage.getItem("X-Auth-Token") != null) {
            this.auth_tokn = true;
        }

        this.review = new FormControl('', [
            Validators.required
        ]);
        this.rating = new FormControl('', [
            Validators.required
        ]);

        this.add_review = new FormGroup({
            review: this.review,
            rating: this.rating
        });

        let params = this.activated_route.snapshot.params;
        this.product_id = params.prod_id;
        if (this.auth_tokn) {
            let _request_list_me = this.grid_service.setGridData("me");
            _request_list_me.then((success: any) => {

                this.has_plan = success.has_plan;
                this.quantity_configuration = success.quantity_configuration;
                this.total_quantity_purchase = success.total_quantity;
                this.toys_quantity = success.toy_quantity;
                this.books_quantity = success.book_quantity;

                if (success.has_plan) {
                    if (this.toys_quantity < this.quantity_configuration.allowed_toy || this.books_quantity < this.quantity_configuration.allowed_book) {
                        this.can_rent = true;
                    }
                } else {
                    this.can_rent = false;
                }

                let _request_list_view = this.grid_service.setGridData("product/"+params.prod_id+"/view");
                _request_list_view.then((success: any) => {
                    this.row = success;
                    this.common_service.showSpinner.subscribe((val: boolean) => {
                        this.show_spinner = val;
                    });

                    let review_list = this.grid_service.setGridData("product/"+params.prod_id+"/get-review");
                    review_list.then((success: any) => {
                        this.review_data = success;
                    });
                });
                
            });
        } else {
            let _request_list_view = this.grid_service.setGridData("product/"+params.prod_id+"/view");
                _request_list_view.then((success: any) => {
                    this.row = success;
                    this.common_service.showSpinner.subscribe((val: boolean) => {
                        this.show_spinner = val;
                    });

                    let review_list = this.grid_service.setGridData("product/"+params.prod_id+"/get-review");
                    review_list.then((success: any) => {
                        this.review_data = success;
                    });
                });
        }
    }

    goToAmazon(link) {
        window.open(link, '_blank');
    }

    decreaseQuantoty() {
        if (this.total_item > 1) {
            this.total_item = this.total_item - 1;
        }
    }

    increaseQuantoty() {
        this.total_item = this.total_item + 1;
    }

    addToCart() {
        this.common_service.makePostRequest("product/"+this.product_id+"/add-cart", {quantity: this.total_item})
            .subscribe(
                (response: any) => {
                    this.common_service.commonSnackBarMessage(response.message);
                    this.router.navigate([
                        "/shopping-cart"
                    ]);
                },
                (error) => {
                    console.log(error);
                    let error_data = error.json();
                }
            )
    }

    addReview(form) {
        if(form.valid) {
            let resp_data = {
                rating: form.value.rating,
                review: form.value.review,
                product_id: this.product_id
            };

            this.common_service.makePostRequest("product/add-review", resp_data)
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

}
