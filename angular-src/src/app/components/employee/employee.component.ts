import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import {isUndefined} from "util";
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component'

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  
  employees: any = [];
  searchItem: string;
  category: string;
  status: string;
  searchstring: string;
  upcomingevents: any = [];
  constructor(
    private employeeService: EmployeeService,
    private modalService: NgbModal,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
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
  
  onSelectCategory(category) {
    this.category = category;
    this.onSearchEmployee();
  }
  
  onSelectStatus(status) {
    this.status = status;
    this.onSearchEmployee();
  }
  
  onSelectString(event) {
    this.searchstring = event;
    this.onSearchEmployee();
  }
  
  onDelete(employee) {
    const modalRef = this.modalService.open(ConfirmDialogComponent, {centered: true});
    modalRef.componentInstance.str_data = 'Do you want delete employee?';
    modalRef.result.then((result) => {
      if (result) {

          this.employeeService.deleteEmployee(employee).subscribe(data => {
            if(data.success){
              this.flashMessage.show('Employee deleted successfully', {cssClass: 'alert-success', timeout: 3000});
              this.getAllEmployees();
            
              // const notification = {
              //   content: this.newevent.username + "created new event",
              //   date: new Date().toLocaleDateString(),
              //   status: true
              // };
            
              //   this.notificateService.registerNotification(notification).subscribe(data => {
              //     if(data.success){
              //       // console.log("success");
              //     }
              //   });
              // } else {
              //   this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
            } else {
              this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
            }
          
          });
      }
    }, (reason) => {
      console.log(reason);
    });
  }
  
  onSearchEmployee() {
    let param = {};
    if (this.searchstring != undefined) {
      param['strparams'] = this.searchstring;
    }
    if (this.category != undefined && this.category != 'all') {
      param['category'] = this.category;
    }
    if (this.status != undefined && this.status != 'all') {
      param['status'] = this.status;
    }
    this.employeeService.searchEmployees(param).subscribe(employees => {
        this.employees = employees;
      },
      err => {
        console.log(err);
        return false;
      }
    );
  }
  
}
