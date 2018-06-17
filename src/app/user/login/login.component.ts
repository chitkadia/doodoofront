import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

import { environment } from '../../../environments/environment';

import { CommonService } from '../../shared/common.service';

declare var $: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    login_form: FormGroup;
    email: FormControl;
    password: FormControl;
    loginEmail: FormControl;
    loginPassword: FormControl;

    targetUrl: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private Common_service: CommonService,
        public dialog: MatDialog,
    ) {
        const getToken = localStorage.getItem('X-Auth-Token');
        if (getToken != null) {
            window.location.href = "";
        }
    }

    ngOnInit() {
        this.createLoginFormControl();
        this.createLoginForm();
    }

    /**
     * Function will create login form control and set validation rules
     */
    protected createLoginFormControl() {
        this.loginEmail = new FormControl('', [
            Validators.required,
            Validators.email,
            Validators.pattern(environment.emailValidRegx)
        ]);
        this.loginPassword = new FormControl('', [Validators.required, Validators.pattern(/\S/)]);
    }

    /**
     * Function will create form group for Login Form
     */
    protected createLoginForm() {
        this.login_form = new FormGroup({
            loginEmail: this.loginEmail,
            loginPassword: this.loginPassword,
        });
    }

    /**
     * Function is used to make API call of LOGIN API
     * username or email and password both data are sending in headers
     * @param form,NgForm,To get form data of Login Form
     * 
     * @return Authkey,String,It will be used to authenticate user of each and every API call 
     */
    login(form) {
        if (this.login_form.valid) {
            let loginCredetials = {
                "email": form.value.loginEmail,
                "password": form.value.loginPassword,
            };
            let convertToBase64 = btoa(loginCredetials.email + ":" + loginCredetials.password);

            this.Common_service.setRequestHeader("user/login", convertToBase64).subscribe(
                (response: any) => {
                    let user = response;
                    this.activatedRoute.queryParams.subscribe((params: Params) => {
                        this.targetUrl = params['returnUrl'];
                    });

                    localStorage.setItem("X-Auth-Token", user.auth_token);
                    localStorage.setItem("user_email", form.value.loginEmail);

                    if (this.targetUrl != null) {
                        window.location.href = this.targetUrl;
                    } else {
                        window.location.href = '';
                    }
                    this.Common_service.loggedInUser(true);
                }, (error: any) => {
                    this.Common_service.showNotification("danger", null, error.error.error_message);
                }
            );
        } else {
            if (this.login_form.hasError("required", ["loginEmail"]) == true || this.login_form.hasError("pattern", ["loginEmail"])) {
                return false;
            }
            if (this.login_form.hasError("required", ["loginPassword"]) == true || this.login_form.hasError("pattern", ["loginPassword"])) {

            }

        }
    }

    forgotPassword() {
        let dialogRef_update = this.dialog.open(ForgotPassword, {
            width: '250px'
        });

        dialogRef_update.afterClosed().subscribe(result => {
            if (result) {
                this.ngOnInit();
            }
        });
    }

}

@Component({
    selector: 'forgot-password-dialog',
    templateUrl: 'forgot-password-dialog.html',
})
export class ForgotPassword {

    forgot_password: FormGroup;
    email: FormControl;

    start_loader: boolean = true;

    constructor(
        public dialogRef: MatDialogRef<ForgotPassword>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private common_service: CommonService
    ) { }

    ngOnInit() {
        this.email = new FormControl('', [
            Validators.required,
            Validators.email,
            Validators.pattern(environment.emailValidRegx)
        ]);
        this.forgot_password = new FormGroup({
            email: this.email
        });
    }

    onNoClick(val): void {
        this.dialogRef.close(val);
    }

    forgotPassword(form) {
        if (form.valid) {
            let data_add = {
                email: form.value.email
            };
            let this_obj = this;
            let service = this.common_service;
            return new Promise(function (resolve, reject) {
                service.makePostRequest("user/forgot-password", data_add)
                    .subscribe(
                        (response: any) => {
                            this_obj.common_service.commonSnackBarMessage(response.message);
                            this_obj.onNoClick(true);
                        },
                        (error) => {
                            this_obj.onNoClick(false);
                            console.log(error);
                            let error_data = error.json();
                        }
                    )
            });
        }
    }

}