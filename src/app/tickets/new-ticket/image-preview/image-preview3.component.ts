import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImagePreviewComponent),
      multi: true,
    }  ]
})
export class ImagePreviewComponent implements ControlValueAccessor
{
  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder) { }


  imageFile: File
  onChange: any = () => { };
  onTouch: any = () => { }; 
  imageSrc: string;
  isValidImageFormat = true;
  form: FormGroup;
  validFormatsMessage = "only files with formats: jpg | jpeg | png | gif are allowed";
  allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  writeValue(file: File): void
  {
    if (file) {
      this.form.setValue({ imageFile: file });
    } else {
      this.onRemoveFile();
      this.cdr.markForCheck()
    }
  }
  registerOnChange(fn: any): void
  {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void
  {
    this.onTouch = fn;
  }

  ngOnInit()
  {
    this.form = this.fb.group({
      imageFile:''
    })
  }
  onFileChanged(event: any)
  {
    if (this.validateImageFormat(event.target.files[0].name)) {
      const reader = new FileReader();
      reader.onload = (event: any) =>
      {
        this.imageSrc = event.target.result;
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(event.target.files[0]);

    } else {
      this.isValidImageFormat = false;
    }
    this.onTouch();
    this.onChange(event.target.files[0]);
  }
  onRemoveFile()
  {
    this.imageFile = null;
    this.imageSrc = null;
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
