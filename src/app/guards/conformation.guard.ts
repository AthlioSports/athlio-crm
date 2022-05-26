import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {ComponentCanDeactivate} from '../guards/component-can-deactivate';

@Injectable()
export class ConformationGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate): boolean {
   
    if(!component.canDeactivate()){
        if (confirm("You have unsaved changes! If you leave, your changes will be lost.")) {
            return true;
        } else {
            return false;
        }
    }
    return true;
  }
}
