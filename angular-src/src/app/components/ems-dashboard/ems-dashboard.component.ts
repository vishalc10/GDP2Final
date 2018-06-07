import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { EventService } from '../../services/event.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddNewEventComponent } from '../add-new-event/add-new-event.component'
import { FlashMessagesService } from 'angular2-flash-messages';
import { NotificateService } from '../../services/notificate.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component'
import * as _ from 'lodash';
import {Event} from '../../model/event'
import {Calendar} from '../../model/calendar'

@Component({
  selector: 'app-ems-dashboard',
  templateUrl: './ems-dashboard.component.html',
  styleUrls: ['./ems-dashboard.component.css']
})
export class EmsDashboardComponent implements OnInit {
  
  editevent: Event;
  currentUser: any;
  calendarOptions: Options;
  displayEvent: any;
  eventdatas: any = [];
  olddatas: any = [];
  upcomingevents = [];
  searchItem: string;
  showresult: boolean = false;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  constructor(protected eventService: EventService,
              private modalService:NgbModal,
              private flashMessage: FlashMessagesService,
              private notificateService: NotificateService) { }
  
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("user"));
    this.getAllEvents();
  }
  
  getAllEvents() {
    const today = new Date();
    this.eventService.getEvents().subscribe(data => {
      this.olddatas = _.cloneDeep(data);
      data.forEach(d => {
        let event = new Calendar();
        if (new Date(d.enddate) > today) {
          event.backgroundColor = 'green'
        } else {
          event.backgroundColor = 'bule'
        }
        event.id = d._id;
        event.title = d.eventname;
        event.start = d.startdate;
        event.end = d.enddate;
        event.editable = true;
        this.eventdatas.push(event);
      });
      this.upcomingevents = _.filter(this.olddatas, e => new Date(e.startdate) > today);
      this.calendarOptions = {
        editable: true,
        eventLimit: false,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay,listMonth'
        },
        events: this.eventdatas
      };
    });
  }
  
  onSearchEvents(event) {
    if (event == '') {
      this.showresult = false;
      this.getAllEvents();
    } else {
      this.showresult = true;
      const param = {strparams: event};
      this.eventService.searchEvents(param).subscribe(events => {
          this.eventdatas = events;
        },
        err => {
          console.log(err);
          return false;
        }
      );
    }
  }
  
  addnewEvent() {
    const modalRef = this.modalService.open(AddNewEventComponent, {centered: true});
    modalRef.componentInstance.newevent = this.editevent;
    modalRef.componentInstance.updatestatus = false;
    modalRef.result.then((result) => {
      if (result) {
        this.eventService.registerEvent(result).subscribe(data => {
    
          if(data.success){
            this.flashMessage.show('Event registerd successfully', {cssClass: 'alert-success', timeout: 3000});
            const notification = {
              content: this.currentUser.username + "created new event",
              date: new Date().toLocaleDateString(),
              status: true
            };

            this.notificateService.registerNotification(notification).subscribe(data => {
              if(data.success){
                // console.log("success");
              }
            });
          } else {
            this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
          }
    
        });
      }
    }, (reason) => {
      console.log(reason);
    });

  }
  
  onUpdate(event) {
    const modalRef = this.modalService.open(AddNewEventComponent, {centered: true});
    modalRef.componentInstance.newevent = event;
    modalRef.result.then((result) => {
      if (result) {
        this.eventService.updateEvent(result).subscribe(data => {
    
          if(data.success){
            this.flashMessage.show('Event updated successfully', {cssClass: 'alert-success', timeout: 3000});
      
            // const notification = {
            //   content: data.username + "created new event",
            //   date: new Date().toLocaleDateString(),
            //   status: true
            // }
            //
            // this.notificateService.registerNotification(notification).subscribe(data => {
            //   if(data.success){
            //     // console.log("success");
            //   }
            // });
          } else {
            this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
          }
    
        });
      }
    }, (reason) => {
      console.log(reason);
    });
  }
  
  onDelete(event) {
    const modalRef = this.modalService.open(ConfirmDialogComponent, {centered: true});
    modalRef.componentInstance.str_data = 'Do you want delete Event?';
    modalRef.result.then((result) => {
      if (result) {
        this.eventService.deleteEvent(event).subscribe(data => {

          if(data.success){
            this.flashMessage.show('Event deleted successfully', {cssClass: 'alert-success', timeout: 3000});

          } else {
            this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
          }

        });
      }
    }, (reason) => {
      console.log(reason);
    });
  }
  
  eventClick(model: any) {
    model = {
      event: {
        id: model.event.id,
        start: model.event.start,
        end: model.event.end,
        title: model.event.title,
        allDay: model.event.allDay
        // other params
      },
      duration: {}
    }
    this.displayEvent = model;
  }
  
  updateEvent(model: any) {
    let edited = _.find(this.olddatas, p => p._id === model.event.id);
    if (edited) {
      edited.startdate = model.event.start;
      edited.enddate = model.event.end;
      this.eventService.updateEvent(edited).subscribe(data => {
    
        if(data.success){
          this.flashMessage.show('Event updated successfully', {cssClass: 'alert-success', timeout: 3000});
      
          const notification = {
            content: this.currentUser.username + "created new event",
            date: new Date().toLocaleDateString(),
            status: true
          }

          this.notificateService.registerNotification(notification).subscribe(data => {
            if(data.success){
              // console.log("success");
            }
          });
        } else {
          this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
        }
    
      });
    }
  }
  
  dayEvent(event) {
    console.log(event)
  }
}
