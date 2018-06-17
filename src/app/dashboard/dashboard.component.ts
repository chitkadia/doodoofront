import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CommonService } from '../shared/common.service';
import { GridService } from '../shared/grid.service';

import { SanitizeHtmlPipe } from '../shared/sanitize-html.pipe';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    constructor(
        private activated_route: ActivatedRoute,
        private grid_service: GridService,
        private common_service: CommonService,
        private router: Router
    ) { }

    rows: Array<any>;

    ngOnInit() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        const getToken = localStorage.getItem('X-Auth-Token');
        if (getToken != null) {
            this.common_service.loggedInUser(true);
        }

        let _request_list = this.grid_service.setGridData("product/list");
        _request_list.then((success: any) => {
            this.rows = success.rows;
        },
        (error: any)  => {
            console.log(error);
        });
    }

    goToProductDetail(product_id, category_id) {
        this.router.navigate([
            "/product/"+product_id+"/"+category_id+"/detail"
        ]);
    }

}
