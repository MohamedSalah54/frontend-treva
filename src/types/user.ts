import { Role, Task } from "./task";

export interface ProfileImage {
  secure_url: string;
  public_id: string;
  folderId?: string;
  _id: string;
  id: string;
}

export interface TaskStats {
  inProgress: number;
  completed: number;
  _id: string;
  id: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: Role;
  title?: string;
  profileImage?: ProfileImage;
  taskStats?: TaskStats;
  phoneNumber: string;
  totalTasksRequested?: number;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email?: string;
  title: string;
  role: string;
  taskStats?: {
    inProgress: number;
    completed: number;
  };
  totalTasksRequested?: number;
  tasksHistory?: Task[];
}