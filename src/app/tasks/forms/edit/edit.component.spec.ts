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
  @Input() task: any = {}; // viene toda la fila
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();

  save() {
    const payload = {
      title: this.task.title,
      description: this.task.description,
      status_task: Number(this.task.status_task)
    };

    this.onUpdate.emit({ id: this.task.id, payload });

    this.close();
  }

  close() {
    this.onClose.emit();
  }
}
