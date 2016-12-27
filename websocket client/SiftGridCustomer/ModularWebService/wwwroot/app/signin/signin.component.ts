
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





import {Component, OnInit} from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router, Routes, RouterModule } from '@angular/router';
import "rxjs/add/operator/delay";
import "rxjs/add/operator/retry";
import "rxjs/add/operator/retryWhen";
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx'
import { CompanyService} from '../auth/company-service';
import {Authenticator} from '../auth/Authenticator';


@Component({
    providers: [CompanyService],
    selector: 'login',
    templateUrl: 'app/signin/signin.template.html',
})
export class SignInComponent implements OnInit {
    private domainname = [];
    data: boolean = false;
    showSigninPage: boolean = true;
    dataFromResponse
    message
    constructor(private _authenticator: Authenticator,public http: Http, public router: Router, public companyservice: CompanyService) { }

    checkLogin(email: string, password: string): void {
        var user: string;
        var company: string;
        var domain = [];
        var emailTest;

        for (var key in this.dataFromResponse["value"]) {
            // console.log(data["value"][key]["name"])
            if (this.dataFromResponse["value"][key]["otherMails"][0] == email) {
                emailTest = this.dataFromResponse["value"][key]["userPrincipalName"];
                console.log("userPrincipalName from  email" + emailTest)
                this.companyservice.validatePassword(emailTest, password)
                    .subscribe((response) => {
                        var validUser = response.text();
                        if (validUser === 'true') {
                            this.message = ""
                            var usernamefromemail: string[] = emailTest.split("@");
                                var username = usernamefromemail[0]
                           var domainname = usernamefromemail[1]
                           var tenantname = domainname.split(".")[0];
                           this._authenticator.username = username;
                            this._authenticator.TenantName = tenantname;
                            this.router.navigate(['./UIBackground']);

                        } else {
                            this.message = "Enter Valid Username/Pasword"
                            this.router.navigate(['./login']);
                        }
                    },
                    (error) => { console.log(error); },
                    () => { console.log("completed."); });;

            } else {
                this.companyservice.validatePassword(email, password)
                    .subscribe((response) => {
                        var validUser = response.text();
                        if (validUser === 'true') {
                            this.message = ""
                            var usernamefromemail: string[] = email.split("@");
                            var username = usernamefromemail[0]
                            var domainname = usernamefromemail[1]
                            var tenantname = domainname.split(".")[0];
                            this._authenticator.username = username;
                            this._authenticator.TenantName = tenantname;
                            this.router.navigate(['./UIBackground']);
                        } else {
                            this.message = "Enter Valid Username/Pasword"
                            this.router.navigate(['./login']);
                        }
                    },
                    (error) => { console.log(error); },
                    () => { console.log("completed."); })
            }




        }


        this.companyservice.updateDomainObservable.next({
            mail: "",
            userPrincipalName: user
        });
        console.log(email);
    }

    ngOnInit() {

        // localStorage.setItem('jwt', response);
        let url = "/Token/getToken/";
        this.http.get(url).retryWhen(errors => errors.delay(2000)).
            subscribe((response) => {
                console.log(response);
                console.log(response.text());
                localStorage.setItem('auth_token', response.text());
                if (response.text() != null) {
                    this.companyservice.get("https://graph.windows.net/bsift.siftgrid.com/users?api-version=beta")
                        .subscribe(data => {
                            console.log(data);
                            this.dataFromResponse = data;
                            for (var key in data["value"]) {
                                //  console.log(data["value"][key]["name"])
                                this.domainname.push(data["value"][key]["userPrincipalName"]);
                                // console.log(this.domainname);
                            }
                        });
                }
                //   console.log(response.json);
                // localStorage.setItem('jwt', response);

            });


    }



}