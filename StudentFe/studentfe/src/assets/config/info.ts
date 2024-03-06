import { OptionType } from '@/assets/types/common';

const GENDER = (): OptionType[] => [
    {
        label: 'Nam',
        value: 'male',
    },
    {
        label: 'Nữ',
        value: 'female',
    },
    {
        label: 'Khác',
        value: 'other',
    },
];

const SEMESTER = (): OptionType[] => [
    {
        label: 'Học kỳ 1',
        value: 'Học kỳ 1',
    },
    {
        label: 'Học kỳ 2',
        value: 'Học kỳ 2',
    },
    {
        label: 'Học kỳ 3',
        value: 'Học kỳ 3',
    },
];

const DATE_FILTER = (): OptionType[] => [
    {
        label: 'Ngày tạo giảm dần',
        value: 0,
        name: 'DateCreated',
        code: 'date_decrease',
    },
    {
        label: 'Ngày tạo tăng dần',
        value: 1,
        name: 'DateCreated',
        code: 'date_increase',
    },
];

const ACADEMIC = (): OptionType[] => [
    {
        label: 'Cử nhân',
        value: 'Cử nhân',
    },
    {
        label: 'Kỹ sư',
        value: 'Kỹ sư',
    },
    {
        label: 'Thạc sĩ',
        value: 'Thạc sĩ',
    },
    {
        label: 'Tiến sĩ',
        value: 'Tiến sĩ',
    },
];

const DEGREE = (): OptionType[] => [
    {
        label: 'Giáo sư',
        value: 'Giáo sư',
    },
    {
        label: 'Phó giáo sư',
        value: 'Phó giáo sư',
    },
];

const USER_TYPE = (): OptionType[] => [
    {
        label: 'Giáo viên',
        value: 'L',
    },
    {
        label: 'Bộ Giáo dục',
        value: 'M',
    },
];

const THESIS_STATUS = (): any => ({
    A: 'Duyệt',
    AR: 'Yêu cầu duyệt',
    D: 'Bản nháp',
});

export { GENDER, SEMESTER, DATE_FILTER, ACADEMIC, DEGREE, USER_TYPE, THESIS_STATUS };
