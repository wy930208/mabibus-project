// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportSystemUserManagement from '../../../app/controller/system/userManagement';

declare module 'egg' {
  interface IController {
    system: {
      userManagement: ExportSystemUserManagement;
    }
  }
}