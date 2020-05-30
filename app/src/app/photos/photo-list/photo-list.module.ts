import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadButtonComponent } from './load-button/load-button.component';
import { PhotosComponent } from './photos/photos.component';
import { FilterByDescriptionPipe } from './filter-by-description.pipe';
import { PhotoListComponent } from './photo-list.component';
import { PhotoModule } from '../photo/photo.module';
import { CardModule } from '../../shared/components/card/card.module';
import { SearchComponent } from './search/search/search.component';



@NgModule({
  declarations: [LoadButtonComponent, PhotosComponent, FilterByDescriptionPipe, PhotoListComponent, SearchComponent],
  imports: [
    CommonModule,
    PhotoModule,
    CardModule
  ]
})
export class PhotoListModule { }
