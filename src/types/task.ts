export type Role = "user" | "client" | "admin";

export type TaskStatus =
  | "available"
  | "in_progress"
  | "completed"
  | "under_review"
  | "rejected";

export type AdminDecision =
  | "approved"
  | "rejected"
  | "edit_requested"
  | "under_review";

export type ClientTaskStatus = "receive" | "complete";

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  available: "متاحة",
  in_progress: "قيد التنفيذ",
  completed: "مكتملة",
  under_review: "قيد المراجعة",
  rejected: "مرفوضة",
};

export const ADMIN_DECISION_LABELS: Record<AdminDecision, string> = {
  approved: "قبول",
  rejected: "رفض",
  edit_requested: "طلب تعديل",
  under_review: "قيد المراجعة",
};
export const CLIENT_TASK_STATUS_LABELS: Record<ClientTaskStatus, string> = {
  receive: "قيد التنفيذ",
  complete: "متكملة",
};

export const ADMIN_DECISION_COLORS: Record<AdminDecision, string> = {
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  edit_requested: "bg-yellow-100 text-yellow-700",
  under_review: "bg-blue-100 text-blue-700",
};

// export const PAID_STATUS_LABELS: Record<boolean, string> = {
//   true: "مدفوع",
//   false: "غير مدفوع",
// };

// export const PAID_STATUS_COLORS: Record<boolean, string> = {
//   true: "bg-emerald-100 text-emerald-700",
//   false: "bg-gray-200 text-gray-700",
// };

// export interface TaskPostCardProps {
//   _id: string;
//   role: Role;
//   title: string;
//   description: string;
//   requestImages?: {
//     secure_url: string;
//   }[];
//   deadline: string;
//   status: TaskStatus;
//   adminDecision: AdminDecision;
//   isPaid?: boolean;
//   createdAt: string;
//   createdBy: {
//     name: string;
//     profileImage?: string;
//   };
// }
export interface TaskPostCardProps {
  role: Role;
  data: {
    _id: string;
    title: string;
    description: string;
    requestImages?: { secure_url: string }[];
    deadline: string;
    status: TaskStatus;
    adminDecision?: AdminDecision;
    isPaid?: boolean;
    createdAt: string;
    createdBy: {
      _id: string;
      firstName?: string;
      lastName?: string;
      profileImage?: {
        secure_url?: string;
      };
    };
  };
}

export type AssignedUser =
  | string
  | {
      _id: string;
      firstName: string;
      lastName?: string;
      profileImage?: {
        secure_url: string;
        public_id?: string;
      };
    };

export type SubmissionImage = {
  original: { secure_url: string; public_id?: string; folderId?: string };
  preview: { secure_url: string; public_id?: string; folderId?: string };
};

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdBy: any;
  requestImages?: { secure_url: string }[];
  deadline: string;
  createdAt: string;
  assignedUserId: AssignedUser;
  isPaid: boolean;
  // submission?: {
  //   submittedAt?: string;
  //   images?: { secure_url: string; public_id?: string; folderId?: string }[];
  // };
  clientReview?: "yes" | "no" | null;

  submission?: {
    images: SubmissionImage[];
    submittedAt: Date;
  };

  adminReview?: {
    decision?: AdminDecision;
    reviewedAt?: string;
  };
}
export function getRawTaskStatus(task: any): TaskStatus {
  const status = task.status as TaskStatus;

  return status;
}

export function mapTaskStatusForDisplay(
  status: TaskStatus,
  role: Role,
): TaskStatus | ClientTaskStatus {
  let displayStatus: TaskStatus | ClientTaskStatus;
  if (role === "client") {
    if (status === "available") displayStatus = "receive";
    else if (status === "completed") displayStatus = "complete";
    else displayStatus = status;
  } else {
    displayStatus = status;
  }

  return displayStatus;
}

export function mapClientStatusToTaskStatus(
  clientStatus: ClientTaskStatus,
  role: Role,
  previousTaskStatus: TaskStatus,
): TaskStatus {
  if (role !== "client") {
    return clientStatus as TaskStatus;
  }

  if (clientStatus === "complete") {
    return "completed";
  }

  if (
    previousTaskStatus === "available" ||
    previousTaskStatus === "in_progress" ||
    previousTaskStatus === "under_review"
  ) {
    return previousTaskStatus;
  }
  return "available";
}
