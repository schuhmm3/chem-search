import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  constructor() { }

  @Input() title?;
  @Input() subtitle?;
  @Output() modalClose = new EventEmitter();

  ngOnInit(): void {
  }

  onClose() {
    this.modalClose.emit();
  }

}
