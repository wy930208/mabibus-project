/**
 * @description: FormTemplate Props
 * @return {*}
 * @author: Cyan
 */
export type FormTemplateProps = {
  treeData: API.MENUMANAGEMENT[]; // 菜单树形数据
  reloadTable: () => void; // 刷新表格
  formData?: API.MENUMANAGEMENT; // 表单数据
  triggerDom?: JSX.Element; // DrawerForm trigger
  parent_id?: string; // 父级id
  internationalData: API.INTERNATIONALIZATION[]; // 国际化字段树形数据
};

/**
 * @description: FormItem Props
 * @return {*}
 * @author: Cyan
 */
export type FormItemProps = {
  treeData: API.MENUMANAGEMENT[]; // 菜单树形数据
  parent_id?: string; // 父级id
  internationalData: API.INTERNATIONALIZATION[]; // 国际化字段树形数据
};

/**
 * @description: 头部搜索表单 Props
 * @return {*}
 * @author: Cyan
 */
 export type TableSearchProps = {
  menu_type?: string; // 菜单类型
  isPremission?: boolean; // 是否是角色权限
  status?: string; // 菜单状态
  start_time?: string; // 开始日期
  end_time?: string; // 结束日期
}
