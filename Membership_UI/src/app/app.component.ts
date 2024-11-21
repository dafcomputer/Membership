import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ABI-ZEER MEMEBERSHIP';


  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en'); // Change to the desired default language
}

switchLanguage(language: string) {
    this.translate.use(language);
}
}
