import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../../core/services/task.service';
import { Task } from '../../../../shared/models/tasks';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../shared/models/user';
import { TASK_STATUSES, TASK_PRIORITIES } from '../../../../shared/constants/task.constants';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  taskId!: number;
  users: User[] = [];

  statuses = TASK_STATUSES;
  priorities = TASK_PRIORITIES;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadUsers();
    // 1. Inicializar formulario
    this.form = this.fb.group({
      title:       ['', [Validators.required]],
      description: [''],
      dueDate:     [null, [Validators.required]],
      status:      ['TO_DO', [Validators.required]],
      priority:    ['MEDIUM', [Validators.required]],
      userId:      [null, [Validators.required]]
    });

    // 2. Detectar si viene id para editar
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.taskId = +id;
        this.taskService.get(this.taskId).subscribe((task: Task) => {
          this.form.patchValue({
            title:       task.title,
            description: task.description,
            dueDate:     new Date(task.dueDate),
            status:      task.status,
            priority:    task.priority,
            userId:      task.userId
          });
        });
      }
    });
  }

  loadUsers() {
    this.userService.list().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const payload: Task = this.form.getRawValue();

    const obs = this.isEdit
      ? this.taskService.update(this.taskId, payload)
      : this.taskService.create(payload);

    obs.subscribe(() => this.router.navigate(['/tasks']));
  }

  cancel() {
    this.router.navigate(['/tasks']);
  }
}

