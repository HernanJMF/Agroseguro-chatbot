import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-document-preview',
  templateUrl: './document-preview.component.html',
  styleUrls: ['./document-preview.component.scss'],
})
export class DocumentPreviewComponent  implements OnChanges  {

  @Input() document: any;
  fileUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['document'] && this.document && this.document.preview) {
      this.loadDocument();
    } else {
      this.fileUrl = null;
    }
  }

  // 🔹 Método para cargar o recargar el documento
  loadDocument() {
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://docs.google.com/gview?url=${encodeURIComponent(this.document.preview)}&embedded=true&_t=${new Date().getTime()}`
    );
  }

  // 🔹 Método para forzar la recarga del documento
  reloadDocument() {
    this.loadDocument();
  }
}
