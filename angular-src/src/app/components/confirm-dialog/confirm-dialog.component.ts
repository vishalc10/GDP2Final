import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  
  @Input() str_data: string;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
  
  onSubmit() {
    this.activeModal.close(true)
  }
  
  onCancel() {
    // this.cancel.emit();
    this.activeModal.close(false)
  }
}
