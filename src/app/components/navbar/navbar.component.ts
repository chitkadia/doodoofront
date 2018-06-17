import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';

import { CommonService } from '../../shared/common.service';
import { GridService } from '../../shared/grid.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
    mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;

    public login_text: string = "Login";
    public logged_in: boolean = false;

    public current_url: string;
    public card_quantity: number = 0;

    constructor(location: Location, private element: ElementRef, private router: Router, private common_service: CommonService, private grid_service: GridService) {
        this.location = location;
        this.sidebarVisible = false;
        const getToken = localStorage.getItem('X-Auth-Token');
        if (getToken != null) {
            this.login_text = "My Account";
            this.logged_in = true;
        }
    }

    ngOnInit() {
        const getToken = localStorage.getItem('X-Auth-Token');
        if (getToken != null) {
            this.common_service.loggedInUser(true);
        }
        let url_check = this.router.url.split(";");
        this.current_url = url_check[0];
        this.common_service.logged_in.subscribe((val: boolean) => {
            if (val == true) {
                const getToken = localStorage.getItem('X-Auth-Token');
                if (getToken != null) {
                   this.login_text = "My Account";
                   this.logged_in = true;
                }
            } else {
                this.login_text = "Login";
                this.logged_in = false;
            }
        });
        if (getToken != null) {
            let _request_list_me = this.grid_service.setGridData("product/view-cart");
            _request_list_me.then((success: any) => {
                if (success.hasOwnProperty("rows")) {
                    this.card_quantity = success.rows.length;
                } else {
                    this.card_quantity = 0;
                }
            });
        }
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.router.events.subscribe((event) => {
            this.sidebarClose();
            var $layer: any = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
                this.mobile_menu_visible = 0;
            }
        });
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        // this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function () {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function () {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            } else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function () {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function () { //asign a function
                body.classList.remove('nav-open');
                this.mobile_menu_visible = 0;
                $layer.classList.remove('visible');
                setTimeout(function () {
                    $layer.remove();
                    $toggle.classList.remove('toggled');
                }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(2);
        }
        titlee = titlee.split('/').pop();

        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path === titlee) {
                return this.listTitles[item].title;
            }
        }
        return 'Dashboard';
    }

    logout() {
        this.logged_in = false;
        this.common_service.makeGetRequest("me/logout")
        .subscribe((response) => {
            this.common_service.loggedInUser(false);
            localStorage.removeItem('X-Auth-Token');
            if (localStorage.getItem('resendVerificationCode') !== null) {
                localStorage.removeItem('resendVerificationCode');
            }
            localStorage.removeItem("user_email");
            window.location.href = "/";
        });
    }

    mobileMenu() {
        var x = document.getElementById("myTopnav");
        if (x.className === "menu-mobile topnav") {
            x.className = "topnav responsive";
        } else {
            x.className = "menu-mobile topnav";
        }
    }
}
