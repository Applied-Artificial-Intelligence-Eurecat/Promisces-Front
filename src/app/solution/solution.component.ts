import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Galleria } from 'primeng/galleria';
import { Subscription } from 'rxjs';
import { Solution, SolutionDetailSearch } from '../models/solution';

@Component({
  selector: 'app-solution',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fade', [
      state('false', style({opacity:1})),
      state('true', style({opacity:0})),
      transition('* <=> *',[
        animate(800)
      ])
    ])
  ]
})
export class SolutionComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    public state: boolean = false;

    activeIndex: number = 0;

    blockIndexSelected: number = 0;

    @ViewChild('galleria') galleria: Galleria | undefined;
    showThumbnails: boolean = false;
    fullscreen: boolean = false;
    onFullScreenListener: any;

    imageSrc: string = '';
    defaultImageSrc: string = '../assets/images/dsf_visualisation.png';


  constructor(
    private dialogService: DialogService,
    private translateService: TranslateService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.imageSrc = this.defaultImageSrc;

    //this.bindDocumentListeners();
  }

  scrollTo(el: string) {
    document.getElementById(el)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }

  runSubscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());

    this.unbindDocumentListeners();
  }

  onThumbnailButtonClick() {
    this.showThumbnails = !this.showThumbnails;
  }

  toggleFullScreen() {
      if (this.fullscreen) {
          this.closePreviewFullScreen();
      } else {
          this.openPreviewFullScreen();
      }

      this.cd.detach();
  }

  openPreviewFullScreen() {
      let elem = this.galleria?.element.nativeElement.querySelector('.p-galleria');
      if (elem.requestFullscreen) {
          elem.requestFullscreen();
      } else if (elem['mozRequestFullScreen']) {
          /* Firefox */
          elem['mozRequestFullScreen']();
      } else if (elem['webkitRequestFullscreen']) {
          /* Chrome, Safari & Opera */
          elem['webkitRequestFullscreen']();
      } else if (elem['msRequestFullscreen']) {
          /* IE/Edge */
          elem['msRequestFullscreen']();
      }
  }

  onFullScreenChange() {
      this.fullscreen = !this.fullscreen;
      this.cd.detectChanges();
      this.cd.reattach();
  }

closePreviewFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } /*else if (document['mozCancelFullScreen']) {
        document['mozCancelFullScreen']();
    } else if (document['webkitExitFullscreen']) {
        document['webkitExitFullscreen']();
    } else if (document['msExitFullscreen']) {
        document['msExitFullscreen']();
    }*/
}

  bindDocumentListeners() {
      this.onFullScreenListener = this.onFullScreenChange.bind(this);
      document.addEventListener('fullscreenchange', this.onFullScreenListener);
      document.addEventListener('mozfullscreenchange', this.onFullScreenListener);
      document.addEventListener('webkitfullscreenchange', this.onFullScreenListener);
      document.addEventListener('msfullscreenchange', this.onFullScreenListener);
  }

  unbindDocumentListeners() {
      document.removeEventListener('fullscreenchange', this.onFullScreenListener);
      document.removeEventListener('mozfullscreenchange', this.onFullScreenListener);
      document.removeEventListener('webkitfullscreenchange', this.onFullScreenListener);
      document.removeEventListener('msfullscreenchange', this.onFullScreenListener);
      this.onFullScreenListener = null;
  }


  galleriaClass() {
      return `custom-galleria ${this.fullscreen ? 'fullscreen' : ''}`;
  }

  fullScreenIcon() {
      return `pi ${this.fullscreen ? 'pi-window-minimize' : 'pi-window-maximize'}`;
  }

  changeState() {
    this.state = !this.state;
  }

  handleClickImg(event: MouseEvent) {
    // Obtenim el contenidor
    const container = event.currentTarget as HTMLElement;

    // Obtenim les dimensions del contenidor
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Obtener las coordenadas del clic relativas al contenedor
    const x = event.offsetX / containerWidth;
    const y = event.offsetY / containerHeight;

    //console.log('X: ' + x);
    //console.log('Y: ' + y);

    // Determinem el quadrant segons les cordenades:
    if (y >= 0.77 && y < 0.90) {
      // seccio inferior
      this.imageSrc = '../assets/images/dsf_visualisation_down.png';
      this.router.navigateByUrl('/strategy');
    } else if ((x >= 0.27 && x < 0.45) && (y > 0.16 && y < 0.51)) {
      // Prevention - Quadrant superior esquerre
      this.imageSrc = '../assets/images/dsf_visualisation_prevevention.png';
      this.changeImageBlockSelected(1);
    } else if((x >= 0.45 && x <= 0.65) && (y > 0.16 && y < 0.51)) {
      // Monitoring - Quadrant superior dret
      this.imageSrc = '../assets/images/dsf_visualisation_monitoring.png';
      this.changeImageBlockSelected(2);
    } else if ((x >= 0.45 && x <= 0.65) && (y >= 0.51 && y < 0.77)) {
      // Risk assessment - Quadrant inferior dret
      this.imageSrc = '../assets/images/dsf_visualisation_riskassesment.png';
      this.changeImageBlockSelected(3);
    } else if ((x >= 0.27 && x < 0.45) && (y >= 0.51 && y < 0.77)) {
      // Treatment - Quadrant inferior esquerre
      this.imageSrc = '../assets/images/dsf_visualisation_treatment.png';
      this.changeImageBlockSelected(4);
    }  else {
      // Quadrant
      this.imageSrc = this.defaultImageSrc;
      this.changeImageBlockSelected(0);
    }
  }

  changeImageBlockSelected(index: number) {
    this.blockIndexSelected = index;
  }

  chunk(array: any[], size: number): any[] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
      array.slice(index * size, index * size + size)
    );
  }

}
