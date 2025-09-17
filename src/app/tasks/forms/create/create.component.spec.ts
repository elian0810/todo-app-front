import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
  @Input() newTask: any = {};
  @Output() onCreate = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();

  save() {
    this.onCreate.emit(this.newTask);
    this.close();
  }

  close() {
    this.onClose.emit();
  }
}
