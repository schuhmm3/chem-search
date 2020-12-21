import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SearchComponent} from './components/search/search.component';
import { NotAllowedComponent} from './components/not-allowed/not-allowed.component';
import { NotFoundComponent} from './components/not-found/not-found.component';
import { IsLoggedGuard } from './guards/is-logged.guard';



const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'search', component: SearchComponent , canActivate: [IsLoggedGuard] }, //  Deactivate Guard for testing :-) 
  { path: 'not-allowed', component: NotAllowedComponent},
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
