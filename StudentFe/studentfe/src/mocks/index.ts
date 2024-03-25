import { StudentProfileType } from "@/assets/interface/StudentProfile.type";
import { MenuItemType } from "@/assets/types/menu";
import { useMemo } from "react";

interface TableData {
    day: string;
    shift: string;
    course: string;
    code?: string;
    session?: string;
    room: string;
    teacher?: string;
  }
 
   
export const scheduleDataTable: TableData[] = 
[
      {
        day: "24/03/2024",
        shift: "Evening",
        course: "Cơ sở dữ liệu",
        code: "13DHTH08 - 010110196112",
        session: "7 - 9",
        room: "F601 - 140 Lê Trọng Tấn",
        teacher: "Trần Trương Tuấn Phát",
      },
      {
        day: "20/03/2024",
        shift: "Afternoon",
        course: "Lập trình hướng đối tượng",
        code: "13DHTH03 - 010110196203",
        session: "4 - 6",
        room: "A402 - 140 Lê Trọng Tấn",
        teacher: "Bùi Công Danh",
      },
      {
        day: "29/02/2024",
        shift: "Afternoon",
        course: "Tiếng anh 2",
        code: "13DHTH03 - 010110196203",
        session: "4 - 6",
        room: "A102 - 140 Lê Trọng Tấn",
        teacher: "Ngọc Hiền",
      },
      {
        day: "24/04/2024",
        shift: "Morning",
        course: "Tiếng anh 3",
        code: "13QTKD03 - 010110196203",
        session: "4 - 6",
        room: "A102 - 140 Lê Trọng Tấn",
        teacher: "Phan thị châu trinh",
      },
      {
        day: "28/04/2024",
        shift: "Morning",
        course: "Bắn súng",
        code: "13DHTH03 - 010110196203",
        session: "4 - 6",
        room: "A102 - 140 Lê Trọng Tấn",
        teacher: "Phan thị châu trinh",
      },
    ]

 export   const studentProfile: StudentProfileType = {
      mssv: "2044226229",
      fullName: "Võ Ngọc Nguyên Chương",
      gender: "Nam",
      education: {
        status: "Đang học",
        fileNumber: "2044226229",
        admissionDate: "27/9/2022",
        class: "13DHTH08",
        campus: "CNTP TP.HCM",
        degree: "Đại học",
        trainingType: "chính quy",
        faculty: "Khoa Công nghệ Thông tin",
        major: "Công nghệ thông tin_DH",
        specialization: "Công nghệ phần mềm",
        courseYear: 2022,
      },
      personal: {
        dateOfBirth: "10/12/2004",
        ethnicity: "Kinh",
        religion: "Không",
        idNumber: "079204036830",
        issuedDate: "10/03/2022",
        issuedBy: "Cục trưởng cục Cảnh sát ĐKQL cư trú và DLQG về dân cư",
        phone: "0784393356",
        email: "chuongvo1012@gmail.com",
        birthPlace: "TP. Hồ Chí Minh",
        permanentResidence:
          "30/2, khu phố 5, đường TA22, phường Thới An, quận 12, TP. Hồ Chí Minh",
        urlAvatar: "https://wallpaperaccess.com/full/1083811.jpg",
      },
    };