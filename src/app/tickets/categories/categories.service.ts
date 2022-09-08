import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Category } from '../models/category.model';
import { CategoriesStore } from './store/categories-store';

@Injectable({ providedIn: 'root' })
export class CategoriesService
{
  constructor(private categoriesStore: CategoriesStore, private http: HttpClient) { }

  fetchCategories()
  {
    return this.http.get<string[]>(environment.endpoints.tickets.getCategories).pipe(
      map(categories => { return this.generateFakeIdForStateManagment(categories) }),
      tap(categories =>
        this.categoriesStore.setCategories(categories, true)
      ));
  }

  private generateFakeIdForStateManagment(categoriesAsString: string[]): Category[]
  {
    let idNums = 0;
    let categoriesAsObjects: Category[] = [];
    categoriesAsString.forEach(cat =>
    {
      ++idNums;
      categoriesAsObjects.push({ id: idNums, name: cat });
    });
    return categoriesAsObjects;
  }
}
