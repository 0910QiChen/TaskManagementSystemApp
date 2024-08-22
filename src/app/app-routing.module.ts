import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { TaskComponent } from './task/task.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path:'Register', component: UserComponent },
  { path:'Login', component:UserComponent },
  { path:'Tasks', component:TaskComponent, canActivate: [AuthGuard] },
  { path:'TaskDetails', component:TaskDetailComponent, canActivate: [AuthGuard] },
  { path:'', redirectTo: '/Tasks', pathMatch:'full' },
  { path:'**', component:TaskComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
