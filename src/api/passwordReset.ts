import Axios from "@/request";

// 请求重置密码请求参数
export interface RequestPasswordResetParams {
  email: string;
}

// 重置密码请求参数
export interface ResetPasswordParams {
  token: string;
  new_password: string;
}

// 统一响应格式
export interface ApiResponse {
  code: number;
  msg: string;
}

/**
 * 请求重置密码（发送邮件）
 * @param params 包含用户邮箱
 */
export const requestPasswordReset = (params: RequestPasswordResetParams): Promise<ApiResponse> => {
  return Axios.post("/api/v1/user/requestPasswordReset", params);
};

/**
 * 重置密码
 * @param params 包含token和新密码
 */
export const resetPassword = (params: ResetPasswordParams): Promise<ApiResponse> => {
  return Axios.post("/api/v1/user/resetPassword", params);
};
