import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent {
  @Input() newTask: any = {};
  @Output() onCreate = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();

  showAlert = false;
  alertMessage = '';

  isValid(): boolean {
    console.log('this.newTask.title', this.newTask.title);
    console.log('this.newTask.description', this.newTask.description);
    console.log('this.newTask.status_task', this.newTask.status_task);

    return (
      this.newTask.title?.trim().length > 0 &&
      this.newTask.description?.trim().length > 0
    );
  }

  save() {
    if (!this.isValid()) {
      this.alertMessage = 'Por favor, completa todos los campos.';
      this.showAlert = true;
      return;
    }
    this.onCreate.emit(this.newTask);
    this.close();
  }

  close() {
    this.onClose.emit();
  }

  closeAlert() {
    this.showAlert = false;
  }
}
