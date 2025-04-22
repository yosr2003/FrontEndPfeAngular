import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-branding',
  imports: [],
  template: `
  <a href="/" class="logodark">
    <div class="logo-container">
      <img
        src="./assets/generale_tunisienne_informatique_logo.jpg"
        alt="logo" 
      />
      <span class="logo-text">Punic Trade</span>
    </div>
  </a>
`,
styles: [`
  .logo-container {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
  }

  .logo-container img {
    width: 80px;
    height: 60px;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .logo-text {
    font-family: 'Brush Script MT', 'Dancing Script', cursive;
    font-weight: normal;
    font-size: 40px;
    color:rgb(8, 30, 60);
    letter-spacing: 1px;
  }
`]

})
export class BrandingComponent {
  options = this.settings.getOptions();
  constructor(private settings: CoreService) {}
}
