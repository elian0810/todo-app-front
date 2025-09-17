import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent {
  @Input() task: any = {}; // <- importante que sea task
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();

  save() {
    this.task.status_task = Number(this.task.status_task);
    this.onUpdate.emit(this.task);
    this.close();
  }

  close() {
    this.onClose.emit();
  }
}
