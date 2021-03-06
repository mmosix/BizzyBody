import { Component } from '@angular/core';
import { App, NavController, LoadingController, IonicPage, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Common } from "../../providers/common";
import { PopoverController} from 'ionic-angular';

import moment from 'moment'
import { GhotsProvider } from '../../providers/ghots/ghots';
/**
 * Generated class for the IndexPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public userDetails: any;
  data: any;
  events: string[];
  errorMessage: string;
  page = 1;
  perPage = 0;
  totalData = 0;
  totalPage = 0;
  locId: any;
  myLoc: any;
  ftEvt: any;
  eTix: any;
  bBlog: any;
  locLent: any;

  public date: string = new Date().toISOString();

  constructor(
    public popoverCtrl: PopoverController,
    public navCtrl: NavController, 
    public app: App,
    public navParams: NavParams, 
    public restProvider: RestProvider, 
		private _ghotsPrv: GhotsProvider,
    public common: Common,
    public loadingCtrl: LoadingController
    // private modal: ModalController
  ) {
      const data = JSON.parse(localStorage.getItem("userData"));
      this.userDetails = data.userData;
      this.locId = this.userDetails.location_id;

      this._setLoaded()

    this.locEvents();
    this.ftEvents();
    this.tixEvents();
    this.getBlog();
    this.getEvents();
  }
  doRefresh(refresher) {
    this._setLoaded()
    this.locEvents();
    this.ftEvents();
    this.tixEvents();
    this.getBlog();
    this.getEvents();

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 3000);
  }

	private _setLoaded() {
		setTimeout(() => {
			this._ghotsPrv.setLoading(false)
		}, 8000);
  }
  
  openPopover(myEvent) {
    let popover = this.popoverCtrl.create('PopPage');
    popover.present({
      ev: myEvent
    });
  }

  locEvents() {
    // this.common.presentLoading();
    this.restProvider.locEvents(this.locId)
    .then(data => {
      this.myLoc = data;
      this.locLent = this.myLoc.length;

    })
    .catch(err => {
      console.error(err)
    })
    ;
  }

  ftEvents() {
    // this.common.presentLoading();
    this.restProvider.ftEvents(this.locId)
    .then(data => {
      this.ftEvt = data;

    })
    .catch(err => {
      console.error(err)
    })
    ;
  }

  tixEvents() {
    this.restProvider.tixEvents()
    .then(data => {
      this.eTix = data;
      console.log(this.eTix);
    })
    .catch(err => {
      console.error(err)
    })
    ;
  }

  getBlog() {
    this.restProvider.getBlog()
    .then(data => {
      this.bBlog = data;
      console.log(this.bBlog);
    })
    .catch(err => {
      console.error(err)
    })
    ;
  }

  getEvents() {
    this.restProvider.getEvents(this.page)
    .subscribe(
      res => {
        this.data = res;
        this.events = this.data.data;
        this.perPage = this.data.per_page;
        this.totalData = this.data.total;
        this.totalPage = this.data.total_pages;
    console.log(this.data);
        
        //loading.dismiss();
      },
      error =>  this.errorMessage = <any>error);
  } 
  
  doInfinite(infiniteScroll) {
    this.page = this.page+1;
    setTimeout(() => {
      this.restProvider.getEvents(this.page)
         .subscribe(
           res => {
             this.data = res;
             this.perPage = this.data.per_page;
             this.totalData = this.data.total;
             this.totalPage = this.data.total_pages;
             for(let i=0; i<this.data.data.length; i++) {
               this.events.push(this.data.data[i]);
             }
           },
           error =>  this.errorMessage = <any>error);

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 1000);
  }

  // goBizzyEvent(event) {

  //   const myModalOptions: ModalOptions = {
  //     enableBackdropDismiss: true
  //   };

  //   const myModal: Modal = this.modal.create('BizzyEventPage', {event: event}, myModalOptions);

  //   myModal.present();

  //   myModal.onDidDismiss((event) => {
  //     console.log("I have dismissed.");
  //     console.log(event);
  //   });

  //   myModal.onWillDismiss((event) => {
  //     console.log("I'm about to dismiss");
  //     console.log(event);
  //   });

  // }
  goToProfile() {
    this.navCtrl.parent.select(4);
  }
  goToChat() {
    this.navCtrl.parent.select(2);
  } 

  goBizzyEvent(event) {
    this.navCtrl.push('BizzyEventPage', {event: event});
  }

  }
