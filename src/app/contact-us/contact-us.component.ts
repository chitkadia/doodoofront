import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { CommonService } from '../shared/common.service';
import { GridService } from '../shared/grid.service';

import { environment } from '../../environments/environment';

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

    constructor(
        private grid_service: GridService,
        private common_service: CommonService,
        private activated_route: ActivatedRoute
    ) { }

    contact_us: FormGroup;
    name: FormControl;
    email: FormControl;
    address: FormControl;
    city: FormControl;
    contact_no: FormControl;
    message: FormControl;

    message_text: string;
    message_show: boolean = false;

    ngOnInit() {
        this.name = new FormControl('', [
            Validators.required
        ]);
        this.email = new FormControl('', [
            Validators.required
        ]);
        this.address = new FormControl('', [
            Validators.required
        ]);
        this.city = new FormControl('', [
            Validators.required
        ]);
        this.contact_no = new FormControl('', [
            Validators.required
        ]);
        this.message = new FormControl('', [
            Validators.required
        ]);

        this.contact_us = new FormGroup({
            name: this.name,
            email: this.email,
            address: this.address,
            city: this.city,
            contact_no: this.contact_no,
            message: this.message
        });
    }

    submitContactUs(form) {
        if (form.valid) {
            let contact_us_data = {
                name: form.value.name,
                email: form.value.email,
                address: form.value.address,
                city: form.value.city,
                contact_no: form.value.contact_no,
                message: form.value.message
            };
            this.common_service.makePostRequest("add-contactus", contact_us_data)
                .subscribe(
                    (response: any) => {
                        this.contact_us.patchValue({
                            name: "",
                            email: "",
                            address: "",
                            city: "",
                            contact_no: "",
                            message: ""
                        });
                        this.message_text = response.message;
                        this.message_show = true;
                    },
                    (error) => {
                        console.log(error);
                        let error_data = error.json();
                    }
                )
        }
    }

}
