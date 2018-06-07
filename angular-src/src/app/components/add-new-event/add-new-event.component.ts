import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {Event} from '../../model/event'
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-add-new-event',
  templateUrl: './add-new-event.component.html',
  styleUrls: ['./add-new-event.component.css']
})
export class AddNewEventComponent implements OnInit {
  
  @Input() newevent: Event;
  starttime: any;
  endtime: any;
  employees: any = [];
  constructor(private employeeService: EmployeeService,
              public activeModal: NgbActiveModal) { }

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
  onSelectStartTime() {
  
  }
  
  onSelectEndTime() {
  
  }
  
  onSubmit() {console.log(this.newevent)
    this.activeModal.close(this.newevent)
  }
  
  onCancel() {
    // this.cancel.emit();
    this.activeModal.close(false)
  }
}
