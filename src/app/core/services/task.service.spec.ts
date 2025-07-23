import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task, TaskStatus, TaskPriority } from '../../shared/models/tasks';
import { environment } from '../../../environments/environment';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/task`;

  const mockTasks: Task[] = [
    { id: 1, title: 'Test Task 1', description: 'Desc 1', completed: false, dueDate: new Date(), status: TaskStatus.TO_DO, priority: TaskPriority.LOW, userId: 1, userName: 'User 1' },
    { id: 2, title: 'Test Task 2', description: 'Desc 2', completed: true, dueDate: new Date(), status: TaskStatus.DONE, priority: TaskPriority.HIGH, userId: 1, userName: 'User 1' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch tasks from the API via GET', () => {
    service.list().subscribe(tasks => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(`${apiUrl}/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });
  
  it('should create a task via POST', () => {
    const newTask: Task = { title: 'New Task', description: 'New Desc', completed: false, dueDate: new Date(), status: TaskStatus.TO_DO, priority: TaskPriority.MEDIUM, userId: 1, userName: 'User 1' };
    
    // El DTO que se espera en el body
    const expectedDto = {
      title: newTask.title,
      description: newTask.description,
      userId: newTask.userId,
      dueDate: newTask.dueDate.toISOString().split('T')[0],
      status: newTask.status,
      priority: newTask.priority,
    };

    service.create(newTask).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(expectedDto);
    req.flush(newTask);
  });

  it('should update a task via PUT', () => {
    const updatedTask: Task = { ...mockTasks[0], title: 'Updated Title' };

    // El DTO que se espera en el body
    const expectedDto = {
      title: updatedTask.title,
      description: updatedTask.description,
      userId: updatedTask.userId,
      dueDate: updatedTask.dueDate.toISOString().split('T')[0],
      status: updatedTask.status,
      priority: updatedTask.priority,
    };

    service.update(updatedTask.id!, updatedTask).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/${updatedTask.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(expectedDto);
    req.flush(updatedTask);
  });

  it('should delete a task via DELETE', () => {
    const taskId = 1;
    service.delete(taskId).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should search tasks with a term', () => {
    const term = 'Test';
    const mockResponse = { content: mockTasks };

    service.searchTasks(term).subscribe(response => {
      expect(response.content.length).toBe(2);
    });

    const req = httpMock.expectOne(r => r.url === `${apiUrl}/search`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('title')).toBe(term);
    req.flush(mockResponse);
  });

  it('should filter tasks with parameters', () => {
    const filters = { status: TaskStatus.DONE };
    
    service.filter(filters).subscribe(tasks => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].status).toBe(TaskStatus.DONE);
    });

    const req = httpMock.expectOne(`${apiUrl}/filter`);
    expect(req.request.method).toBe('POST');
    req.flush(mockTasks.filter(t => t.status === TaskStatus.DONE));
  });
});
