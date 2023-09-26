import { ANNOUNCEMENT_TYPE } from '@/utils/enums'
import { EnumValues } from '@/utils/types'

/**
 * @description: 创建新闻公告 Props
 * @author: 白雾茫茫丶
 */
export type CreateAnnouncementProps = Pick<
  API.ANNOUNCEMENT, 'announcement_id' | 'title' | 'content' | 'type' | 'status' | 'pinned'>

/**
  * @description: 头部搜索表单 Props
  * @author: 白雾茫茫丶
  */
export type SearchParams = Partial<Pick<API.ANNOUNCEMENT, 'title' | 'type' | 'pinned'>>

/**
 * @description: FormTemplate Props
 * @author: 白雾茫茫丶
 */
export type FormTemplateProps = {
  reloadTable: () => void; // 刷新表格
  open: boolean;
  setOpenModalFalse: () => void
}

/**
 * @description: 设置置顶状态 Params
 * @author: 白雾茫茫丶
 */
export type PinnedParams = Pick<API.ANNOUNCEMENT, 'announcement_id' | 'pinned'>

/**
 * @description: 公告类型
 * @author: 白雾茫茫丶
 */
export type AnnouncementType = EnumValues<typeof ANNOUNCEMENT_TYPE>
