import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../../../core/services/task.service';
import { UserService } from '../../../../core/services/user.service';
import { Task, TaskStatus, TaskPriority } from '../../../../shared/models/tasks';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TasksModule } from '../../tasks.module';

const mockTasks: Task[] = [
  { id: 1, title: 'Task 1', description: 'Desc 1', completed: false, dueDate: new Date(), status: TaskStatus.TO_DO, priority: TaskPriority.LOW, userId: 1, userName: 'User 1' },
  { id: 2, title: 'Task 2', description: 'Desc 2', completed: true, dueDate: new Date(), status: TaskStatus.DONE, priority: TaskPriority.HIGH, userId: 1, userName: 'User 1' }
];

const taskServiceMock = {
  list: jasmine.createSpy('list').and.returnValue(of(mockTasks)),
  searchTasks: jasmine.createSpy('searchTasks').and.returnValue(of({ content: mockTasks })),
  filter: jasmine.createSpy('filter').and.returnValue(of(mockTasks)),
  delete: jasmine.createSpy('delete').and.returnValue(of({}))
};

const userServiceMock = {
  getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue(of({}))
};

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        TasksModule
      ],
      declarations: [TaskListComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: UserService, useValue: userServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit se llama aquí
  });

  afterEach(() => {
    taskServiceMock.list.calls.reset();
    taskServiceMock.searchTasks.calls.reset();
    taskServiceMock.filter.calls.reset();
    taskServiceMock.delete.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    expect(taskServiceMock.list).toHaveBeenCalled();
    expect(component.tasks.length).toBe(2);
    expect(component.tasks).toEqual(mockTasks);
  });

  it('should call searchTasks with debounce', fakeAsync(() => {
    const searchTerm = 'Test Search';
    const event = { target: { value: searchTerm } };
    
    component.onSearch(event);
    
    // Aún no se ha llamado por el debounce
    expect(taskServiceMock.searchTasks).not.toHaveBeenCalled();
    
    tick(300); // Avanzamos el tiempo
    
    expect(taskServiceMock.searchTasks).toHaveBeenCalledWith(searchTerm);
    expect(component.tasks.length).toBe(2);
  }));

  it('should filter tasks when filterTasks is called', () => {
    const filterValues = { status: TaskStatus.TO_DO };
    component.filterForm.patchValue(filterValues);
    component.filterTasks();

    expect(taskServiceMock.filter).toHaveBeenCalledWith(jasmine.objectContaining(filterValues));
  });

  it('should call delete service when delete is confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const taskId = 1;

    component.delete(taskId);

    expect(window.confirm).toHaveBeenCalled();
    expect(taskServiceMock.delete).toHaveBeenCalledWith(taskId);
  });
  
  it('should not call delete service when delete is cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const taskId = 1;

    component.delete(taskId);

    expect(window.confirm).toHaveBeenCalled();
    expect(taskServiceMock.delete).not.toHaveBeenCalled();
  });
}); 