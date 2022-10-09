import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,CanDeactivate,Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ServersService } from '../servers.service';
import { CanComponentDeactivate } from './can-deactivate-guard.service';

@Component({
  selector: 'app-edit-server',
  templateUrl: './edit-server.component.html',
  styleUrls: ['./edit-server.component.css']
})
export class EditServerComponent implements OnInit, CanComponentDeactivate {
  server: {id: number, name: string, status: string};
  serverName = '';
  serverStatus = '';
  allowEdit = false;
  changesSaved = false;
  constructor(private router: Router, private serversService: ServersService,private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: Params)=>{
      console.log(queryParams)
      this.allowEdit = queryParams['allowEdit'] === '1' ? true : false;
      console.log(this.allowEdit)
    })
    const id = +this.route.snapshot.params['id']
    this.server = this.serversService.getServer(id);
    this.serverName = this.server.name;
    this.serverStatus = this.server.status;

  }

  onUpdateServer() {
    this.serversService.updateServer(this.server.id, {name: this.serverName, status: this.serverStatus});
    this.changesSaved = true;
    this.router.navigate(['../'], {relativeTo: this.route})
  }
  canDeactivate(): boolean | Observable<boolean> | Promise<boolean>{
    if (!this.allowEdit){
      return true;
    }
      if ((this.serverName !== this.server.name || this.serverStatus !== this.server.status)
      && this.changesSaved === false){
        return confirm('Do you want to discard the changes')
      }else {
        return true;
      }
    
  }
}
