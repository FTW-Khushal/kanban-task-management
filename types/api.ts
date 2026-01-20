export interface Subtask {
    id: string
    title: string
    is_completed: boolean
    task_id: number
}

export interface Task {
    id: string
    title: string
    description: string
    position: number
    column_id: number
    subtasks?: Subtask[]
}

export interface Column {
    id: number
    name: string
    board_id: number
    tasks?: Task[]
}

export interface Board {
    id: number
    name: string
    columns?: Column[]
}

export interface CreateTaskDto {
    title: string;
    description: string;
    column_id: number;
    position: number;
    subtasks?: { title: string; is_completed: boolean }[];
}

export interface CreateSubtaskDto {
    title: string;
    is_completed: boolean;
    task_id: number;
}

// Helper type for the form
export interface CreateTaskFormValues {
    title: string;
    description: string;
    columnId: number;
    subtasks: { title: string; isCompleted: boolean }[];
    status: string; // This maps to columnId in the UI
    position: number;
}

export interface UpdateSubtaskDto {
    title?: string;
    is_completed?: boolean;
    id?: string;
}

export interface UpdateTaskDto {
    title?: string;
    description?: string;
    column_id?: number;
    position?: number;
    subtasks?: UpdateSubtaskDto[];
}
