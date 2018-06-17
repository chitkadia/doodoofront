import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CommonService } from '../shared/common.service';
import { GridService } from '../shared/grid.service';

import { environment } from '../../environments/environment';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

    constructor(
        private activated_route: ActivatedRoute,
        private grid_service: GridService,
        private common_service: CommonService,
        private router: Router
    ) { }

    rows: Array<any> = [];
    cur_page: number;
    page_size: number;
    total_pages: number;
    total_records: number;
    range: number;
    pageSize = 25;
    order_by: string = "id";
    order: string = "desc";
    site_name = environment.site_name_title;
    selectedValue = environment.selectedValue;
    default_url: string = "product/list?";
    show_spinner: boolean = true;
    i_class: string = "";
    current_col: string;
    search_key_word: string;
    page_from: number;
    page_to: number;

    category_id: number;
    age_rows: any;
    age_cat: any = "";
    sub_cat_rows: any;
    sub_cat: any = "";
    product_category_id: any;

    ngOnInit() {
        let setUrl: string;
        let params = this.activated_route.snapshot.params;
        let query_params_array = [];
        let main_route = this.router.url.split(";");

        if (Object.keys(params).length > 0) {
            let order_by_val: string;
            let order_val: string;
            if (params.order_by != null && params.order_by != "") {
                order_by_val = params.order_by;
            } else {
                order_by_val = this.order_by;
            }

            if (params.order != null && params.order != "") {
                order_val = params.order;
            } else {
                order_val = this.order;
            }

            query_params_array.push("order_by=" + order_by_val);
            query_params_array.push("order=" + order_val);

            if (params.query != null && params.query != "") {
                query_params_array.push("query=" + encodeURIComponent(params.query));
            }

            if (params.page != null && params.page != "") {
                query_params_array.push("page=" + params.page);
            }

            if (params.per_page != null && params.per_page != "") {
                query_params_array.push("per_page=" + params.per_page);
            }
            if (main_route[0] == '/books') {
                query_params_array.push("category=" + 1);
                this.category_id = 1;
            } else {
                query_params_array.push("category=" + 2);
                this.category_id = 2;
            }
            if (params.age_cat != null && params.age_cat != "") {
                query_params_array.push("age_cat=" + params.age_cat);
                this.age_cat = params.age_cat;
            } else {
                this.age_cat = "";
            }
            if (params.sub_cat != null && params.sub_cat != "") {
                query_params_array.push("sub_cat=" + params.sub_cat);
                this.sub_cat = params.sub_cat;
            } else {
                this.sub_cat = "";
            }
            setUrl = this.default_url + query_params_array.join("&");
        } else {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            if (this.search_key_word != null && this.search_key_word != "") {
                query_params_array.push("query=" + encodeURIComponent(this.search_key_word));
            }
            if (this.cur_page != null) {
                query_params_array.push("page=" + this.cur_page);
            }

            if (main_route[0] == '/books') {
                query_params_array.push("category=" + 1);
                this.category_id = 1;
            } else {
                query_params_array.push("category=" + 2);
                this.category_id = 2;
            }

            query_params_array.push("order_by=" + this.order_by);
            query_params_array.push("order=" + this.order);

            setUrl = this.default_url + query_params_array.join("&");
        }

        let _request_list = this.grid_service.setGridData(setUrl);
        _request_list.then((success: any) => {
            if (params.age_cat == "" || params.age_cat == null || params.sub_cat == "" || params.sub_cat == null) {
                for (let i = 0; i < success.rows.length; i++) {
                    this.rows.push(success.rows[i]);
                }
            } else {
                this.rows = success.rows;
            }
            this.product_category_id = this.rows[0].product_category_id;
            this.cur_page = success.current_page;
            this.page_size = success.per_page;
            this.total_pages = success.total_pages;
            this.total_records = success.total_records;
            this.selectedValue = parseInt(success.per_page);
            let sub_category = this.grid_service.setGridData("product/"+this.product_category_id+"/sub-category/list");
            sub_category.then((success: any) => {
                this.sub_cat_rows = success;
            });
            this.common_service.showSpinner.subscribe((val: boolean) => {
                this.show_spinner = val;
            });
        });

        let age_list = this.grid_service.setGridData("product/age-group/list");
        age_list.then((success: any) => {
            this.age_rows = success;
        });
    }

    goToProductDetail(prod_id, cat_id) {
        this.router.navigate([
            "/product/"+prod_id+"/"+cat_id+"/detail"
        ]);
    }

    loadMore() {
        let router;
        if (this.category_id == 1) {
            router = "/books";
        } else {
            router = "/toys";
        }
        this.cur_page = this.cur_page+1;
        let queryParams = { page: this.cur_page, per_page: this.page_size, order_by: this.order_by, order: this.order, age_cat: this.age_cat, category: this.category_id };
        this.router.navigate([
            router, queryParams
        ]).then(() => {
            this.ngOnInit();
        });
    }

    filterAgeGroup(age_cat_id) {
        let queryParams;
        let router;
        if (this.category_id == 1) {
            router = "/books";
        } else {
            router = "/toys";
        }
        this.rows = [];
        if (age_cat_id != null) {
            this.age_cat = age_cat_id;
            queryParams = { page: 1, per_page: this.page_size, order_by: this.order_by, order: this.order, age_cat: age_cat_id, category: this.category_id };
        } else {
            // this.rows = [];
            this.age_cat = "";
            queryParams = { page: 1, per_page: this.page_size, order_by: this.order_by, order: this.order, category: this.category_id, age_cat: "" };
        }
        this.router.navigate([
            router, queryParams
        ]).then(() => {
            this.ngOnInit();
        });
    }

    getFilterCat(event) {
        let queryParams;
        let router;
        if (this.category_id == 1) {
            router = "/books";
        } else {
            router = "/toys";
        }
        this.rows = [];
        if (event.value != 0) {
            this.sub_cat = event.value;
            queryParams = { page: 1, per_page: this.page_size, order_by: this.order_by, order: this.order, sub_cat: event.value, category: this.category_id, age_cat: this.age_cat };
        } else {
            this.sub_cat = "";
            queryParams = { page: 1, per_page: this.page_size, order_by: this.order_by, order: this.order, category: this.category_id, sub_cat: "", age_cat: this.age_cat };
        }
        this.router.navigate([
            router, queryParams
        ]).then(() => {
            this.ngOnInit();
        });
    }

}