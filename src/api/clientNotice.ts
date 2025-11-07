import Axios from "@/request";

// 定义公告类型
export interface ClientNotice {
  notice_id: number;
  title: string;
  content: string;
  category_type: number;
  category_type_text: string;
  priority: number;
  priority_text: string;
  is_top: boolean;
  visibility: string;
  publish_time: string;
  expire_time?: string;
  publisher?: {
    id: number;
    username: string;
    avatar?: string;
  };
}

export interface NoticeListParams {
  page?: number;
  page_size?: number;
  title?: string;
  category_type?: number;
  priority?: number;
  status?: number;
}

export interface NoticeListResponse {
  code: number;
  data: {
    total: number;
    data: ClientNotice[];
  };
  msg?: string;
}

export interface NoticeDetailResponse {
  code: number;
  data: ClientNotice;
  msg?: string;
}

/**
 * 获取公告列表
 * @param params 查询参数
 */
export const getClientNoticeList = (params?: NoticeListParams): Promise<NoticeListResponse> => {
  return Axios.get("/api/v1/notice/list", {
    params: {
      ...params,
      status: 1 // 客户端固定查询已发布的公告
    }
  });
};

/**
 * 获取公告详情
 * @param noticeId 公告ID
 */
export const getClientNoticeDetail = (noticeId: number): Promise<NoticeDetailResponse> => {
  return Axios.get(`/api/v1/notice/detail/${noticeId}`);
};
