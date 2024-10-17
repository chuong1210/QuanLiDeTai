import { OptionType } from "../types/common";

const DropdownValue: OptionType[] = [
    {
        label: 'Trên xuống dưới',
        value: 0,
        name: 'DateCreated',
        code: 'TopToDown',
    },
    {
        label: 'Dưới lên trên',
        value: 1,
        name: 'DateCreated',
        code: 'DownToTop',
    },
]

const ChucVuValue: OptionType[] = [
    {
        label: "TRƯỞNG KHOA",
        value: "TRƯỞNG KHOA",
        name: "TRƯỞNG KHOA",
        code: "TRƯỞNG KHOA"

    },
    {
        label: "TRƯỞNG BỘ MÔN",
        value: "TRƯỞNG BỘ MÔN",
        name: "TRƯỞNG BỘ MÔN",
        code: "TRƯỞNG BỘ MÔN"
    },
    {
        label: "GIÁO VỤ",
        value: "GIÁO VỤ",
        name: "GIÁO VỤ",
        code: "GIÁO VỤ"
    },
    {
        label: "GIẢNG VIÊN",
        value: "GIẢNG VIÊN",
        name: "GIẢNG VIÊN",
        code: "GIẢNG VIÊN"
    }
]
const HocViValue: OptionType[] = [
    {
        label: "Giáo Sư",
        value: "Giáo Sư",
        name: "Giáo Sư",
        code: "Giáo Sư"
    },
    {
        label: "Phó Giáo Sư",
        value: "Phó Giáo Sư",
        name: "Phó Giáo Sư",
        code: "Phó Giáo Sư"
    },
    {
        label: "Tiến sĩ",
        value: "Tiến sĩ",
        name: "Tiến sĩ",
        code: "Tiến sĩ"
    },
    {
        label: "Thạc sĩ",
        value: "Thạc sĩ",
        name: "Thạc sĩ",
        code: "Thạc sĩ"
    },
    {
        label: "NCS",
        value: "NCS",
        name: "NCS",
        code: "NCS"
    }
]
enum roleE {
    giaovu = "CATECHISM",
    giaovien = "TEACHER",
    truongkhoa = "DEAN",
    truongbomon = "HEAD_OF_DEPARTMENT",
}

enum typePoinsE {
    gvhuongdan = "1",
    gvphanbien = "2",
    hoidong = "3",

}

export { DropdownValue, ChucVuValue, HocViValue, roleE, typePoinsE };
