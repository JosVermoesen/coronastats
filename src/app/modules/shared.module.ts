import { NgModule, ModuleWithProviders } from '@angular/core';
// import { appDirective } from './{your-path}';
// import { appService } from './{your-path}';

@NgModule({
  declarations: [
    // so we can use already for a pipe
    // appDirective
  ],
  exports: [
    // MdToHtmlPipe // so we use already for a pipe
    // appDirective
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      // providers: [ appService ]
    };
  }
}
