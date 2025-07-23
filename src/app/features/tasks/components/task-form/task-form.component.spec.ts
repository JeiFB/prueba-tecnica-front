import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TaskFormComponent } from './task-form.component';
import { TaskService } from '../../../../core/services/task.service';
import { UserService } from '../../../../core/services/user.service';
import { Task, TaskStatus, TaskPriority } from '../../../../shared/models/tasks';
import { User } from '../../../../shared/models/user';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TasksModule } from '../../tasks.module';
import { convertToParamMap } from '@angular/router';

// Mocks
const mockTask: Task = { id: 1, title: 'Test Task', description: 'Desc', completed: false, dueDate: new Date(), status: TaskStatus.TO_DO, priority: TaskPriority.LOW, userId: 1, userName: 'User 1' };
const mockUsers: User[] = [{ id: 1, name: 'User 1', email: 'user1@test.com' }];

const taskServiceMock = {
  create: jasmine.createSpy('create').and.returnValue(of(mockTask)),
  update: jasmine.createSpy('update').and.returnValue(of(mockTask)),
  get: jasmine.createSpy('get').and.returnValue(of(mockTask))
};

const userServiceMock = {
  list: jasmine.createSpy('list').and.returnValue(of(mockUsers))
};

const routerMock = {
  navigate: jasmine.createSpy('navigate')
};

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  const configureTestBed = (routeParams: any) => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, NoopAnimationsModule, TasksModule],
      declarations: [TaskFormComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap(routeParams)) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };
  
  afterEach(() => {
    taskServiceMock.create.calls.reset();
    taskServiceMock.update.calls.reset();
    taskServiceMock.get.calls.reset();
    routerMock.navigate.calls.reset();
  });

  describe('in create mode', () => {
    beforeEach(() => {
      configureTestBed({}); // Sin parámetros en la ruta
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize an empty form', () => {
      expect(component.isEdit).toBeFalsy();
      expect(component.form.value.title).toBe('');
    });
    
    it('should call create service on valid form submission', () => {
      component.form.patchValue({ ...mockTask, id: null });
      component.onSubmit();
      expect(taskServiceMock.create).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/tasks']);
    });
  });

  describe('in edit mode', () => {
    beforeEach(() => {
      configureTestBed({ id: '1' });
    });

    it('should fetch the task and populate the form', () => {
      expect(component.isEdit).toBeTruthy();
      expect(taskServiceMock.get).toHaveBeenCalledWith(1);
      expect(component.form.value.title).toBe(mockTask.title);
    });

    it('should call update service on valid form submission', () => {
      component.form.patchValue({ title: 'Updated Title' });
      component.onSubmit();
      expect(taskServiceMock.update).toHaveBeenCalledWith(1, jasmine.any(Object));
      expect(routerMock.navigate).toHaveBeenCalledWith(['/tasks']);
    });
  });
}); 