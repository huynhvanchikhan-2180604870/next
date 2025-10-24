export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

export const REQUEST_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  REJECTED: "rejected",
};

export const WITHDRAW_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  REJECTED: "rejected",
};

export const NOTIFICATION_TYPES = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
};

export const FILE_TYPES = {
  TXT: "txt",
  JSON: "json",
  XLSX: "xlsx",
  XLS: "xls",
};

export const SUBMISSION_TYPES = {
  FILE: "file",
  MANUAL: "manual",
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_NAME_LENGTH: 50,
  MIN_NAME_LENGTH: 2,
  VERIFICATION_CODE_LENGTH: 6,
  VERIFICATION_EXPIRES_MINUTES: 10,
  MIN_WITHDRAW_AMOUNT: 10000,
};

export const EMAIL_SUBJECTS = {
  VERIFICATION: "Xác thực tài khoản - BankThue.com",
  REQUEST_NOTIFICATION: "Yêu cầu mới từ người dùng - BankThue.com",
  REQUEST_UPDATE: "Cập nhật yêu cầu - BankThue.com",
  WITHDRAW_NOTIFICATION: "Yêu cầu Lấy gạch về mới - BankThue.com",
};
