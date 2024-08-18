import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../Services/task.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {

  taskID?: number;
  targetTask?: Task;
  type: string = '';

  constructor(private route: ActivatedRoute, private taskService: TaskService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.taskID = +id;
        this.loadTaskDetails(this.taskID);
      }
    });
  }

  loadTaskDetails(id: number): void {
    this.taskService.GetQuote(id).subscribe(
      (result: Task) => {
        this.targetTask = result;
        this.type = result.QuoteType.toLowerCase();
      },
      (error: any) => {
        console.log(`Error loading quote ${id}:`, error);
      }
    )
  }
}

export interface Task {
  QuoteID: number;
  QuoteType: string;
  Description: string;
  Sales: string;
  DueDate: Date;
  Premium: number;
}