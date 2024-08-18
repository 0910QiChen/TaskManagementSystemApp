import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../Services/task.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { Router } from '@angular/router';

@Component ({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TaskComponent implements OnInit, AfterViewInit {

  Task!: Task;
  Tasks: Task[] = [];
  filteredTasks: Task[] = [];
  displayedColumns: string[] = ['QuoteID', 'QuoteType', 'Description', 'DueDate', 'Premium', 'Sales', 'Actions'];
  searchTerm: string = '';
  sortColumn: string = 'QuoteID';
  sortOrder: boolean = false;
  dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>();
  pageSizeOptions: number[] = [5, 10, 15, 25];
  selectedPageSize = 5;
  rangeLabel: string = '';
  paginatorTabs: number = 0;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private taskService: TaskService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.GetTasks();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      setTimeout(() => {
        this.paginator.pageSize = this.selectedPageSize;
        this.dataSource.paginator = this.paginator;
      });
    }
  }

  onSearchChange(searchValue: string): void {
    this.searchTerm = searchValue;
    this.searchTasks();
  }

  searchTasks(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredTasks = this.Tasks.filter(task =>
      Object.values(task).some(value =>
        value != null && value.toString().toLowerCase().includes(term)));
    this.dataSource.data = this.filteredTasks;
  }

  onColumnChange(): void {
    this.sortTasks();
  }

  onOrderChange(): void {
    this.sortOrder = !this.sortOrder;
    this.sortTasks();
  }

  sortTasks(): void {
    this.filteredTasks = this.filteredTasks.sort((a, b) =>{
      const valueA = (a as any)[this.sortColumn];
      const valueB = (b as any)[this.sortColumn];
      let comparison = 0;

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        comparison = valueA.localeCompare(valueB);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        comparison = valueA - valueB;
      } else if (valueA instanceof Date && valueB instanceof Date) {
        comparison = valueA.getTime() - valueB.getTime();
      }
      return this.sortOrder ? -comparison: comparison;
    })
    this.dataSource.data = this.filteredTasks;
  }

  onPageSizeChange(): void {
    this.paginator.pageSize = this.selectedPageSize;
    this.dataSource.paginator = this.paginator;
    this.rangeLabel = this.getRangeLabel(this.paginator.pageIndex);
  }

  getRangeLabel(page: number): string {
    if (this.Tasks.length == 0) {
      const startIndex = page * this.selectedPageSize;
      const endIndex = Math.min(startIndex + this.selectedPageSize, this.Tasks.length);
      return `Showing ${startIndex} to ${endIndex} of ${this.Tasks.length}`;
    }
    const startIndex = page * this.selectedPageSize;
    const endIndex = Math.min(startIndex + this.selectedPageSize, this.Tasks.length);
    return `Showing ${startIndex + 1} to ${endIndex} of ${this.Tasks.length}`;
  }

  goToPage(pageNumber: number): void {
    this.paginator.pageIndex = pageNumber;
    this.dataSource.paginator = this.paginator;
    this.rangeLabel = this.getRangeLabel(this.paginator.pageIndex);
  }

  previousPage(): void {
    if (this.paginator.hasPreviousPage()) {
      this.paginator.previousPage();
      this.dataSource.paginator = this.paginator;
      this.rangeLabel = this.getRangeLabel(this.paginator.pageIndex);
    }
  }

  nextPage(): void {
    if (this.paginator.hasNextPage()) {
      this.paginator.nextPage();
      this.dataSource.paginator = this.paginator;
      this.rangeLabel = this.getRangeLabel(this.paginator.pageIndex);
    }
  }

  addTask(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { mode: 'add', modalTitle: 'Add New Quote' }});
    dialogRef.afterClosed().subscribe(
      (result) => {
        console.log(`result: ${JSON.stringify(result)}`);
        if(result?.action == 'add') {
          console.log(`Added Task: ${JSON.stringify(result)}`);
          this.taskService.AddQuote(result.task).subscribe(
            (response: any) => {
              this.filteredTasks.push(response.quote);
              this.filteredTasks.sort((a, b) => a.QuoteID - b.QuoteID);
              this.paginatorTabs = Math.ceil(this.Tasks.length/this.paginator.pageSize);
              this.dataSource.data = this.filteredTasks;
              this.Tasks = this.filteredTasks;
              console.log(this.dataSource.data);
            },
            (error: any) => {
              console.log('Error adding task:', error);
            }
          );
        }
      }
    )
  }

  editTask(task: Task): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { mode:'update', task, modalTitle: 'Update Quote' }});
    dialogRef.afterClosed().subscribe(
      (result) => {
        console.log(`result: ${JSON.stringify(result)}`);
        if(result?.action == 'update') {
          console.log(`Updated Task: ${JSON.stringify(result.task)}`);
          this.taskService.EditQuote(task.QuoteID, result.task).subscribe(
            (response: any) => {
              console.log(response);
              const index = this.filteredTasks.findIndex(t => t.QuoteID === result.task.QuoteID);
              if (index !== -1) {
                this.filteredTasks[index] = result.task;
                this.dataSource.data = this.filteredTasks;
              }
            },
            (error: any) => {
              console.log('Error updating task:', error);
            }
          );
        }
      }
    )
  }

  deleteTask(id: number): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { mode: 'delete', id, modalTitle: 'Are you sure?' }});
    dialogRef.afterClosed().subscribe(
      (result) => {
      if (result?.action === 'delete') {
        console.log('Deleted Task:', result.id);
        this.taskService.RemoveQuote(id).subscribe(
          (response: any) => {
            console.log(response);
            this.filteredTasks = this.filteredTasks.filter(t => t.QuoteID !== id);
            this.paginatorTabs = Math.ceil(this.filteredTasks.length / this.paginator.pageSize);
            this.dataSource.data = this.filteredTasks;
          },
          (error: any) => {
            console.log('Error deleting task:', error);
          }
        );
      }
    });
  }

  viewTaskDetail(QuoteID: number): void {
    this.router.navigate(['/TaskDetails'], { queryParams: { id: QuoteID } })
  }

  GetTasks() {
    this.taskService.GetQuotes().subscribe(
      (response: Task[]) => {
        this.Tasks = response.sort((a, b) => a.QuoteID - b.QuoteID);
        this.filteredTasks = [...this.Tasks];
        this.dataSource.data = this.filteredTasks;
        if (this.Tasks.length == 0) {
          this.paginatorTabs = 1;
        }
        else {
          this.paginatorTabs = Math.ceil(this.Tasks.length/this.paginator.pageSize);
        }
        this.rangeLabel = this.getRangeLabel(this.paginator.pageIndex);
        console.log(this.Tasks);
      },
      (error: any) => {
        console.log('Error fetching tasks:', error);
      }
    )
  }

  GetTask(id: number) {
    this.taskService.GetQuote(id).subscribe(
      (response: Task) => {
        this.Task = response;
        console.log(this.Task);
      },
      (error: any) => {
        console.log(`Error fetching task with id ${id}:`, error);
      }
    )
  }

  AddTask(quote: Task) {
    this.taskService.AddQuote(quote).subscribe(
      (response: string) => {
        console.log(response);
      },
      (error: any) => {
        console.log(`Error adding task:`, error);
      }
    )
  }

  EditTask(id: number, quote: Task) {
    this.taskService.EditQuote(id, quote).subscribe(
      (response: string) => {
        console.log(response);
      },
      (error: any) => {
        console.log(`Error adding task:`, error);
      }
    );
  }

  RemoveTask(id: number) {
    this.taskService.RemoveQuote(id).subscribe(
      (response: string) => {
        console.log(response);
      },
      (error: any) => {
        console.log(`Error adding task:`, error);
      }
    );
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