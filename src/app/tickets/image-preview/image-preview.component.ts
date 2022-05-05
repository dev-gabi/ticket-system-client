import { Component,  EventEmitter,  Output } from '@angular/core';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html'
})
export class ImagePreviewComponent  {

  @Output() file = new EventEmitter<File>();
  selectedFile: File;
  imageSrc: string;
  isValidImageFormat = true;
  validFormatsMessage = "only files with formats: jpg | jpeg | png | gif are allowed";
  allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  

  onFileChanged(event: any)
  {
    this.selectedFile = event.target.files[0];
    if (this.validateImageFormat(this.selectedFile.name)) {
      const reader = new FileReader();
      reader.onload = (event: any) =>
      {
        this.imageSrc = event.target.result;
        this.file.emit(this.selectedFile);
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.isValidImageFormat = false;
    }
  }
  onRemoveFile()
  {
    this.selectedFile = null;
    this.imageSrc = null;
    this.file.emit(null);
  }
  validateImageFormat(fileName: string): boolean
  {
    const ext = fileName.split('.').pop();
    return this.allowedExtensions.indexOf(ext) > -1;
  }
  onCloseAlert()
  {
    this.isValidImageFormat = true;
  }
}
