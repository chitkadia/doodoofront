import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { CommonService } from '../../shared/common.service';
import { GridService } from '../../shared/grid.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

    constructor(
        private grid_service: GridService,
        private common_service: CommonService,
        private activated_route: ActivatedRoute,
        private router: Router
    ) { }

    resetPasswordForm:FormGroup;
    password: FormControl;
    confirmPassword:FormControl;
    resetPasswordCode: any;

    ngOnInit() {
        let params = this.activated_route.snapshot.params;
        this.resetPasswordCode = params.id;

        this.password = new FormControl('', [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/\S/)
        ]);
        this.confirmPassword = new FormControl('',[
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/\S/)
        ]);

        this.resetPasswordForm = new FormGroup({
            password:this.password,
            confirmPassword:this.confirmPassword
        });
    }

    resetPassword(form) {
        if (this.resetPasswordForm.valid) {
            let resetPasswordData = {
                "code": this.resetPasswordCode,
                "password": form.value.password
            }
            this.common_service.makePostRequest("user/reset-password/" + this.resetPasswordCode, resetPasswordData).subscribe(
                (response: any) => {
                    let msg = response;
                    this.router.navigate(["/login"]);
                },
                (error) => {
                    let error_data = error;
                }
            )
        }
    }

}
