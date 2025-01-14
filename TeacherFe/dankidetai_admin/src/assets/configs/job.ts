// Trưởng khoa giao đề tài cho trưởng bộ môn // trưởng khoa
// Trưởng bộ môn giao đề tài cho giảng viên // trưởng bộ môn

import { roleE } from "./general";


export const jobTKTBM = { name: "Trưởng khoa giao đề tài cho trưởng bộ môn", id: 1 };
export const jobTBMGV = { name: "Trưởng bộ môn giao đề tài cho giảng viên", id: 2 };
function getJobFrom(role: roleE[]) {
    if (role.includes(roleE.truongkhoa)) {
        return jobTKTBM;
    }
    if (role.includes(roleE.truongbomon)) {
        return jobTBMGV;
    }
    return undefined;
}
export { getJobFrom }