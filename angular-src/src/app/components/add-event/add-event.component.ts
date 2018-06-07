import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { NotificateService } from '../../services/notificate.service';
import { EventService } from '../../services/event.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import {Router, ActivatedRoute} from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Time } from '@angular/common';
import {Event} from '../../model/event'
import * as _ from 'lodash';

declare var $ :any;

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  newevent: Event;
  employees: any = [];
  editflag: boolean = false;
  constructor(
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService,
    private notificateService: NotificateService,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private eventService: EventService
  ) {
    this.newevent = new Event();
    if (route.snapshot.paramMap.get('eventid')) {
      const editid = route.snapshot.paramMap.get('eventid');
      this.eventService.getEventByID(editid).subscribe(event => {
          this.newevent = event;
        },
        err => {
          console.log(err);
          return false;
        }
      );
    }
  }

  ngOnInit() {
    
    this.newevent.username = JSON.parse(localStorage.getItem("user")).username;
    this.newevent.alldayF = false;
    this.getAllEmployees();
  }
  
  getAllEmployees() {
    this.employeeService.getEmployees().subscribe(employees => {
        this.employees = employees;
      },
      err => {
        console.log(err);
        return false;
      }
    );
  }
  
  onSetEmployee(event, employee) {
    if (event.target.checked) {
      const assign_employee = this.newevent.employees.find(t => t._id === employee._id);
      if (!assign_employee) {
        this.newevent.employees.push(employee);
      }
    } else {
      const employee_index = _.findIndex(this.newevent.employees, { '_id': employee._id});
      if (employee_index > -1) {
        this.newevent.employees.splice(employee_index, 1);
      }
    }
    console.log(this.newevent.employees)
  }
  //Validate before submitting
  onValidate() {

    // Required Fields
    if(!this.validateService.validateNewEvent(this.newevent)){
      this.flashMessage.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // Validate timing
    if(!this.validateService.validateEventPeriod(this.newevent)){
      this.flashMessage.show('Please select correct timing', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    $('#selectEmployeesModal').modal('show');

  }

  addAndSendEvent() {
    this.addEvent();
    this.sendEvent();
  }

  // insert event into database
  addEvent() {
    this.eventService.registerEvent(this.newevent).subscribe(data => {

      if(data.success){
        this.flashMessage.show('Event registerd successfully', {cssClass: 'alert-success', timeout: 3000});
        
        const notification = {
          content: this.newevent.username + "created new event",
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

  // send event email to selected employees
  sendEvent() {
    $('#selectEmployeesModal').modal('hide');
  }

  onSelectAllDay() {
    this.newevent.starttime = null;
    this.newevent.endtime = null;

  }
 
}
