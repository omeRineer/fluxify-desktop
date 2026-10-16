import { Component } from '@angular/core';
import { FluxifyComponent } from '../../core/components/fluxify.component';
import { SpinnerComponent } from '../../core/components/spinner.component';

@Component({
  selector: 'app-blank',
  imports: [SpinnerComponent],
  templateUrl: './blank.html',
  styleUrl: './blank.scss',
})
export class Blank extends FluxifyComponent {

  logout(){
    this.setLoading(true, "Oturum kapatılıyor");
    window.electronAPI.auth.logout().then(res=>{
      this.setLoading(false)
      
      if(res)
        this.router.navigate(['login'])
    })
    .finally(()=>{
      this.setLoading(false)
    })
  }
}
