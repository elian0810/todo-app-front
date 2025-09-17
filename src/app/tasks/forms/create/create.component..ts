import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule], // 👈 AGREGA FormsModule AQUI
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent {
  @Input() newTask: any = {};
  @Output() onCreate = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();

  save() {
    this.onCreate.emit(this.newTask); // manda la tarea al padre
    this.close();
  }

  close() {
    this.onClose.emit();
  }
}
