import { AxiosResponse } from 'axios';
import { TOKEN_KEY } from '../enums/cacheEnum';
import { defHttp } from '@/utils/http/axios';
export enum TemplateApi {
  STAFF_INFO = '/admin/export/staff',
  STUDENT_INFO = '/admin/export/student',
  courseSign = '/admin/export/courseSign',
  LONG_SHORT_AIM = '/admin/export/longShortAim',
  RECOVERY_RECORD = '/admin/export/recoveryRecord',
  ATTENDANCE_INFO = '/admin/export/staffAttendance',
  STAGE_COMPARE = '/admin/export/stageCompare',
  STUDENT_COVER = '/admin/export/studentCover',
  STUDENT_LEAVE_RECORD = '/admin/export/studentLeaveRecord',
  STUDENT_ASSESSMENT_RECORD = '/admin/export/studentAssessmentRecord',
  STUDENT_COURSE = '/admin/export/studentCourse',
  STUDENT_ATTENDANCE_INFO = '/admin/export/studentAttendance',
}
export enum TemplateEnum {
  STAFF_INFO = 'STAFF_INFO',
  STUDENT_INFO = 'STUDENT_INFO',
  courseSign = 'courseSign',
  LONG_SHORT_AIM = 'LONG_SHORT_AIM',
  RECOVERY_RECORD = 'RECOVERY_RECORD',
  ATTENDANCE_INFO = 'ATTENDANCE_INFO',
  STAGE_COMPARE = 'STAGE_COMPARE',
  STUDENT_COVER = 'STUDENT_COVER',
  STUDENT_LEAVE_RECORD = 'STUDENT_LEAVE_RECORD',
  STUDENT_ASSESSMENT_RECORD = 'STUDENT_ASSESSMENT_RECORD',
  STUDENT_COURSE = 'STUDENT_COURSE',
  STUDENT_ATTENDANCE_INFO = 'STUDENT_ATTENDANCE_INFO',
}
export const exportTemplate = (
  name: TemplateEnum,
  templateId: number,
  ids: number[],
  data: { [index: string]: any },
) => {
  if (name === TemplateEnum.ATTENDANCE_INFO || name === TemplateEnum.STUDENT_ATTENDANCE_INFO)
    return exportTemplateIds(name, templateId, ids, data);
  if (!ids.length) return exportTemplateAll(name, templateId, data);
  return exportTemplateIds(name, templateId, ids);
};

export const exportTemplateIds = (
  name: TemplateEnum,
  templateId: number,
  ids: number[],
  data?: { [index: string]: any },
) => {
  return defHttp.post<AxiosResponse>(
    {
      url: TemplateApi[name],
      data: { templateId, ids, ...data },
      responseType: 'blob',
      headers: {
        'Access-Control-Expose-Headers': TOKEN_KEY,
      },
    },
    {
      isReturnNativeResponse: true,
    },
  );
};

export const exportTemplateAll = (
  name: TemplateEnum,
  templateId: number,
  data: { [index: string]: any },
) => {
  const url =
    name === TemplateEnum.ATTENDANCE_INFO ? TemplateApi[name] : TemplateApi[name] + '/all';
  return defHttp.post<AxiosResponse>(
    {
      url,
      data: { templateId, ...data },
      responseType: 'blob',
      headers: {
        'Access-Control-Expose-Headers': TOKEN_KEY,
      },
    },
    {
      isReturnNativeResponse: true,
    },
  );
};

// export function exportTemplateAboutStaff(templateId, ids) {
//     return defHttp.post({
//         url: TemplateApi.STAFF_INFO,
//         method: 'post',
//         data: { templateId, ids },
//         responseType: 'blob',
//         headers: {
//             'Access-Control-Expose-Headers': ACCESS_TOKEN
//         }
//     })
// }
// export function exportTemplateAboutStudent(templateId, ids) {
//     return defHttp.post({
//         url: TemplateApi.STUDENT_INFO,
//         method: 'post',
//         data: { templateId, ids },
//         responseType: 'blob',
//         headers: {
//             'Access-Control-Expose-Headers': ACCESS_TOKEN
//         }
//     })
// }
// export function exportTemplateAboutCourseSign(ids) {
//     return defHttp.post({
//         url: TemplateApi.courseSign,
//         method: 'post',
//         data: { ids },
//         responseType: 'blob',
//         headers: {
//             'Access-Control-Expose-Headers': ACCESS_TOKEN
//         }
//     })
// }
// export function exportTemplateAboutLongShortAim(templateId, ids) {
//     return defHttp.post({
//         url: TemplateApi.LONG_SHORT_AIM,
//         method: 'post',
//         data: { templateId, ids },
//         responseType: 'blob',
//         headers: {
//             'Access-Control-Expose-Headers': ACCESS_TOKEN
//         }
//     })
// }
// export function exportTemplateAboutRecoveryRecord(templateId, ids) {
//     return defHttp.post({
//         url: TemplateApi.RECOVERY_RECORD,
//         method: 'post',
//         data: { templateId, ids },
//         responseType: 'blob',
//         headers: {
//             'Access-Control-Expose-Headers': ACCESS_TOKEN
//         }
//     })
// }
// export function exportTemplateAboutStaffAttendance(templateId, ids, workDay) {
//     return defHttp.post({
//         url: TemplateApi.ATTENDANCE_INFO,
//         method: 'post',
//         data: { templateId, ids, workDay },
//         responseType: 'blob',
//         headers: {
//             'Access-Control-Expose-Headers': ACCESS_TOKEN
//         }
//     })
// }
// export function exportTemplateAboutStageCompare(templateId, ids) {
//     return defHttp.post({
//         url: TemplateApi.STAGE_COMPARE,
//         method: 'post',
//         data: { templateId, ids },
//         responseType: 'blob',
//         headers: {
//             'Access-Control-Expose-Headers': ACCESS_TOKEN
//         }
//     })
// }
// export function exportTemplateAboutStudentCover(templateId, ids) {
//     return defHttp.post({
//         url: TemplateApi.STUDENT_COVER,
//         method: 'post',
//         data: { templateId, ids },
//         responseType: 'blob',
//         headers: {
//             'Access-Control-Expose-Headers': ACCESS_TOKEN
//         }
//     })
// }

export function exportTemplateById(id: number) {
  return defHttp.post(
    {
      url: '/admin/export/template/' + id,
      responseType: 'blob',
      headers: {
        'Access-Control-Expose-Headers': TOKEN_KEY,
      },
    },
    {
      isReturnNativeResponse: true,
    },
  );
}
