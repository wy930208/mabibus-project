// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportXmwInternationalization from '../../../app/model/xmw_internationalization';
import ExportXmwJobs from '../../../app/model/xmw_jobs';
import ExportXmwMenu from '../../../app/model/xmw_menu';
import ExportXmwOrganization from '../../../app/model/xmw_organization';
import ExportXmwPermission from '../../../app/model/xmw_permission';
import ExportXmwRole from '../../../app/model/xmw_role';
import ExportXmwUsers from '../../../app/model/xmw_users';

declare module 'egg' {
  interface IModel {
    XmwInternationalization: ReturnType<typeof ExportXmwInternationalization>;
    XmwJobs: ReturnType<typeof ExportXmwJobs>;
    XmwMenu: ReturnType<typeof ExportXmwMenu>;
    XmwOrganization: ReturnType<typeof ExportXmwOrganization>;
    XmwPermission: ReturnType<typeof ExportXmwPermission>;
    XmwRole: ReturnType<typeof ExportXmwRole>;
    XmwUsers: ReturnType<typeof ExportXmwUsers>;
  }
}