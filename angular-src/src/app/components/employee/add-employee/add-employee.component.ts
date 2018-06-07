import { Component, OnInit } from '@angular/core';
import { Employee } from '../../../model/employee';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component'
import { EmployeeService } from '../../../services/employee.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {

  editemployee: Employee;
  docURL: any = null;
  selectedFiles: any;
  employee_id: any = null;
  constructor(private modalService: NgbModal,
              private employeeService: EmployeeService,
              private flashMessage: FlashMessagesService,
              private route: ActivatedRoute) {
    this.employee_id = route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.editemployee = new Employee();
    if (this.employee_id) {
      this.employeeService.getEmployeeByID(this.employee_id).subscribe(employee => {
          this.editemployee = employee;
        },
        err => {
          console.log(err);
          return false;
        }
      );
    }
  }
  async selectDoc(event): Promise<void> {
    this.selectedFiles = event.target.files.item(0);
    this.docURL = await this.getBase64(event.target.files.item(0));
  }
  
  async getBase64(file): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  
  onSubmit() {
    const modalRef = this.modalService.open(ConfirmDialogComponent, {centered: true});
    modalRef.componentInstance.str_data = 'Do you want to save to change?';
    modalRef.result.then((result) => {
      if (result) {
        if (this.employee_id) {
          this.employeeService.updateEmployee(this.editemployee).subscribe(data => {
    
            if(data.success){
              this.flashMessage.show('Employee updated successfully', {cssClass: 'alert-success', timeout: 3000});
      
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
        } else {
          this.employeeService.registerEmployee(this.editemployee).subscribe(data => {
    
            if(data.success){
              this.flashMessage.show('Employee registerd successfully', {cssClass: 'alert-success', timeout: 3000});
      
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
      }
    }, (reason) => {
      console.log(reason);
    });
  }
  
  onCancel() {
  console.log(this.editemployee)
  }

}
