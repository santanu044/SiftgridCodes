//import {component, oninit} from '@angular/core';
//import { http, headers } from '@angular/http';
//import {authenticator} from '../auth/authenticator';
//import {authenticatedhttpservice} from '../auth/authenticatedhttpservice';
//import { router, routes, routermodule } from '@angular/router';
//import "rxjs/add/operator/delay";
//import "rxjs/add/operator/retry";
//import "rxjs/add/operator/retrywhen";
//import { observable } from 'rxjs/rx';
//import 'rxjs/rx'
//import { companyservice} from '../auth/company-service';
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
//@component({
//    providers: [companyservice],
//    selector: 'login',
//    templateurl: 'app/signin/signin.template.html',
//})
//export class signincomponent implements oninit {
//    private domainname = [];
//    data: boolean = false;
//    datafromresponse;
//    constructor(private _authenticator: authenticator,
//        private _http: authenticatedhttpservice,
//        private router: router, public companyservice: companyservice, private http: http) { }
//    checklogin(email: string, password: string): void {
//        var user: string;
//        var company: string;
//        var domain = [];
//        for (var datas in this.domainname) {
//            //console.log(this.domainname[datas]);
//            if (email === this.domainname[datas] && password === 'bizruntime@123') {
//                //var s: string = email;
//                //domain = s.split('@');
//                //for(var word in domain)
//                //{
//                //    console.log(word[0]);
//                //    console.log(word);
//                //}
//                user = email;
//                this.data = true;
//            } if (this.data) {
//                // window.location.href = 'http://devtenant.canadacentral.cloudapp.azure.com/';
//                //    console.log(this.domainname)
//                //     console.log(datas)
//                //    console.log(this.domainname[datas])
//                var usernamefromemail = email.split("@");
//                var username = usernamefromemail[0]
//                var domainname = usernamefromemail[1]
//                var tenantname = domainname.split(".")[0];
//                this._authenticator.username = username;
//                this._authenticator.tenantname = tenantname;
//                this.router.navigate(['./uibackground']);
//            }
//            else {
//                this.router.navigate(['./login']);
//            }
//        }
//        for (var key in this.datafromresponse["value"]) {
//            //  console.log(data["value"][key]["name"])
//            if (this.datafromresponse["value"][key]["othermails"][0] == email) {
//                var email1 = this.datafromresponse["value"][key]["userprincipalname"];
//                var usernamefromemail: string[] = email1.split("@");
//                var username = usernamefromemail[0]
//                var domainname = usernamefromemail[1]
//                var tenantname = domainname.split(".")[0];
//                this._authenticator.username = username;
//                this._authenticator.tenantname = tenantname;
//            }
//            // console.log(this.domainname);
//        }
//        console.log(email);
//    }
//    ngoninit() {
//        let url = "/token/gettoken/";
//        this.http.get(url).
//            subscribe((response) => {
//                console.log(response);
//                console.log(response.text());
//                //   console.log(response.json);
//                localstorage.setitem('auth_token', response.text());
//                // localstorage.setitem('jwt', response);
//                this.companyservice.get("https://graph.windows.net/bsift.siftgrid.com/users?api-version=beta")
//                    .subscribe(data => {
//                        console.log(data);
//                        this.datafromresponse = data;
//                        for (var key in data["value"]) {
//                            //  console.log(data["value"][key]["name"])
//                            this.domainname.push(data["value"][key]["userprincipalname"]);
//                            this.domainname.push(data["value"][key]["othermails"][0]);
//                            // console.log(this.domainname);
//                        }
//                    });
//            },
//            (error) => { console.log(error); },
//            () => { console.log("completed."); });
//    }
//}
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var router_1 = require('@angular/router');
require("rxjs/add/operator/delay");
require("rxjs/add/operator/retry");
require("rxjs/add/operator/retryWhen");
require('rxjs/Rx');
var company_service_1 = require('../auth/company-service');
var Authenticator_1 = require('../auth/Authenticator');
var SignInComponent = (function () {
    function SignInComponent(_authenticator, http, router, companyservice) {
        this._authenticator = _authenticator;
        this.http = http;
        this.router = router;
        this.companyservice = companyservice;
        this.domainname = [];
        this.data = false;
        this.showSigninPage = true;
    }
    SignInComponent.prototype.checkLogin = function (email, password) {
        var _this = this;
        var user;
        var company;
        var domain = [];
        var emailTest;
        for (var key in this.dataFromResponse["value"]) {
            // console.log(data["value"][key]["name"])
            if (this.dataFromResponse["value"][key]["otherMails"][0] == email) {
                emailTest = this.dataFromResponse["value"][key]["userPrincipalName"];
                console.log("userPrincipalName from  email" + emailTest);
                this.companyservice.validatePassword(emailTest, password)
                    .subscribe(function (response) {
                    var validUser = response.text();
                    if (validUser === 'true') {
                        _this.message = "";
                        var usernamefromemail = emailTest.split("@");
                        var username = usernamefromemail[0];
                        var domainname = usernamefromemail[1];
                        var tenantname = domainname.split(".")[0];
                        _this._authenticator.username = username;
                        _this._authenticator.TenantName = tenantname;
                        _this.router.navigate(['./UIBackground']);
                    }
                    else {
                        _this.message = "Enter Valid Username/Pasword";
                        _this.router.navigate(['./login']);
                    }
                }, function (error) { console.log(error); }, function () { console.log("completed."); });
                ;
            }
            else {
                this.companyservice.validatePassword(email, password)
                    .subscribe(function (response) {
                    var validUser = response.text();
                    if (validUser === 'true') {
                        _this.message = "";
                        var usernamefromemail = email.split("@");
                        var username = usernamefromemail[0];
                        var domainname = usernamefromemail[1];
                        var tenantname = domainname.split(".")[0];
                        _this._authenticator.username = username;
                        _this._authenticator.TenantName = tenantname;
                        _this.router.navigate(['./UIBackground']);
                    }
                    else {
                        _this.message = "Enter Valid Username/Pasword";
                        _this.router.navigate(['./login']);
                    }
                }, function (error) { console.log(error); }, function () { console.log("completed."); });
            }
        }
        this.companyservice.updateDomainObservable.next({
            mail: "",
            userPrincipalName: user
        });
        console.log(email);
    };
    SignInComponent.prototype.ngOnInit = function () {
        var _this = this;
        // localStorage.setItem('jwt', response);
        var url = "/Token/getToken/";
        this.http.get(url).retryWhen(function (errors) { return errors.delay(2000); }).
            subscribe(function (response) {
            console.log(response);
            console.log(response.text());
            localStorage.setItem('auth_token', response.text());
            if (response.text() != null) {
                _this.companyservice.get("https://graph.windows.net/bsift.siftgrid.com/users?api-version=beta")
                    .subscribe(function (data) {
                    console.log(data);
                    _this.dataFromResponse = data;
                    for (var key in data["value"]) {
                        //  console.log(data["value"][key]["name"])
                        _this.domainname.push(data["value"][key]["userPrincipalName"]);
                    }
                });
            }
            //   console.log(response.json);
            // localStorage.setItem('jwt', response);
        });
    };
    SignInComponent = __decorate([
        core_1.Component({
            providers: [company_service_1.CompanyService],
            selector: 'login',
            templateUrl: 'app/signin/signin.template.html',
        }), 
        __metadata('design:paramtypes', [Authenticator_1.Authenticator, http_1.Http, router_1.Router, company_service_1.CompanyService])
    ], SignInComponent);
    return SignInComponent;
}());
exports.SignInComponent = SignInComponent;
//# sourceMappingURL=signin.component.js.map