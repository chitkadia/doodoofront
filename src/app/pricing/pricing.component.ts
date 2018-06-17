import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

import { CommonService } from '../shared/common.service';
import { GridService } from '../shared/grid.service';

@Component({
    selector: 'app-pricing',
    templateUrl: './pricing.component.html',
    styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {

    constructor(
        private grid_service: GridService,
        private common_service: CommonService,
        private activated_route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    selectThisPlan(plan_id) {
        let plan_price: any;
        switch(plan_id) {
            case 2:
                plan_price = 2500;
            break;
            case 3:
                plan_price = 7000;
            break;
            case 4:
                plan_price = 9000;
            break;
            default:
                plan_price = 2000;
            break;
        }
        let payment_object = {
            amount: plan_price,
            plan_id: plan_id
        };
        this.common_service.makePostRequest("payment-process", payment_object)
            .subscribe(
                (response: any) => {
                    let dialogRef = this.dialog.open(PricingPaymentProcessDialog, {
                        width: 'auto',
                        data: {
                            "response": response
                        }
                    });
            
                    dialogRef.afterClosed().subscribe(result => {
                        
                    });
                },
                (error) => {
                    console.log(error);
                    let error_data = error.json();
                }
            )
    }

}

@Component({
    selector: 'payment-process-dialog',
    templateUrl: 'payment-process-dialog.html',
})
export class PricingPaymentProcessDialog {

    paramList: any = this.data.response.paramList;
    checksum: any = this.data.response.checksum;
    call_url: any = this.data.response.CALL_URL;

    auth_mode: any = "3D";
    payment_type_id: any = "DC";
    card_type: any = "VISA";
    payment_mode_only: any = "Yes";

    constructor(
        public dialogRef: MatDialogRef<PricingPaymentProcessDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private common_service: CommonService
    ) { }

    ngOnInit() {
        let form: any = document.getElementById("f1");
        setTimeout(() => {
            form.submit();
            this.closeDialog();
        }, 2000);
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

}