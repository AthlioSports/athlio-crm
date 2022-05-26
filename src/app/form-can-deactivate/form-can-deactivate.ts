import {ComponentCanDeactivate} from '../guards/component-can-deactivate';
import {NgForm} from "@angular/forms";

export abstract class FormCanDeactivate extends ComponentCanDeactivate{

 abstract get form():NgForm;
 abstract get checkIfSubmit():boolean;
 
 canDeactivate():boolean{
      return this.checkIfSubmit || !this.form.dirty
  }
}