import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {IAppSettings} from '../../interfaces/appsettings';

export interface DialogData {
  settings: IAppSettings;
}

@Component({
  selector: 'app-settings-dialog',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule],
  templateUrl: './settings-dialog.html',
  styleUrl: './settings-dialog.scss'
})
export class SettingsDialog {
  readonly dialogRef = inject(MatDialogRef<SettingsDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  settings: IAppSettings = this.data.settings;

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
