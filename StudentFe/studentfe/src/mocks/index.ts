import { StudentProfileType, userProfileType } from "@/assets/interface/UserProfile.type";
import { MenuItemType } from "@/assets/types/menu";
import { useMemo } from "react";
import type { NextApiRequest, NextApiResponse } from 'next';
import { TopicType } from "@/assets/interface";

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

 export   const studentProfile: userProfileType = {
      id: "2044226229",
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


    // Dữ liệu ảo cho danh sách giáo viên
const teachersMock = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    academicTitle: "Tiến sỹ",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    academicTitle: "Thạc sỹ",
  },
];

// Dữ liệu ảo cho đề tài
const topicsMock = [
  {
    id: 1,
    internalCode: "DT001",
    name: "Hệ thống thông tin quản lý",
    minQuantity: 2,
    maxQuantity: 5,
    thesisMajors: [{ id: 1, name: "Công nghệ thông tin" }],
    messages: ["Yêu cầu kỹ năng phân tích thiết kế hệ thống"],
    isRegister: true,
    summary: "Nghiên cứu và phát triển một hệ thống thông tin quản lý...",
    thesisInstructions: teachersMock,
  },
  {
    id: 2,
    internalCode: "DT002",
    name: "Phát triển ứng dụng trên nền tảng di động",
    minQuantity: 3,
    maxQuantity: 4,
    thesisMajors: [{ id: 2, name: "Phát triển phần mềm" }],
    messages: ["Yêu cầu hiểu biết về React Native hoặc Flutter"],
    isRegister: false, // Chỉ dẫn là đề tài này không thể đăng ký
    summary: "Tìm hiểu và xây dựng ứng dụng di động cho các doanh nghiệp vừa và nhỏ...",
    thesisInstructions: [teachersMock[1]], // Giả sử chỉ có 1 giảng viên hướng dẫn
  },
];


export interface NotificationMock {
  avatar?: string;
  title?: string;
  message?: string;
  time?: string;
  buttonLabel?: string;
}

export const fakeNotifications = [
  {
    id: 1,
    sendFrom: "John Doe",
    message: "Bạn đã được mời tham gia nhóm 'React Developers'.",
    timeSent: "2023-10-26T10:00:00.000Z",
    statusInvitation: "PENDING", // PENDING, AOS, RE
    buttonLabel: "Tham gia ngay",
  },
  {
    id: 2,
    sendFrom: "Jane Smith",
    message: "Jane Smith đã yêu cầu kết nối với bạn.",
    timeSent: "2023-10-25T14:30:00.000Z",
    statusInvitation: "PENDING",
  },
  {
    id: 3,
    sendFrom: "Project Manager",
    message: "Bạn đã được giao nhiệm vụ mới trong dự án 'Website X'.",
    timeSent: "2023-10-24T08:15:00.000Z",
    statusInvitation: "AOS",
  },
  {
    id: 4,
    sendFrom: "System Administrator",
    message: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ với quản trị viên.",
    timeSent: "2023-10-23T16:45:00.000Z",
    statusInvitation: "RE",
  },
  {
    id: 5,
    sendFrom: "Marketing Team",
    message: "Có một sự kiện sắp diễn ra. Đăng ký ngay để tham gia.",
    timeSent: "2023-10-22T12:00:00.000Z",
    statusInvitation: "PENDING",
  },
];

export const NotificationMock = {
  getNotifications: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(fakeNotifications);
      }, 1000);
    });
  },
};
// API Fetch Function with Mock Data
  // Mock data
 export const mockDataTeam = [
    {
      id:'001',
      name: 'Leroy Jenkins',
      role: 'Visual Designer',
      email: 'leroy.jenkins@example.com',
      twitter: 'https://twitter.com/leroyjenkins',
      linkedin: 'https://linkedin.com/in/leroyjenkins',
      github: 'https://github.com/leroyjenkins',
    },
    {
      id:'001',

      name: 'Sarah Connor',
      role: 'Backend Developer',
      email: 'sarah.connor@example.com',
      twitter: 'https://twitter.com/sarahconnor',
      linkedin: 'https://linkedin.com/in/sarahconnor',
      github: 'https://github.com/sarahconnor',
    },
    {
      id:'001',

      name: 'John Doe',
      role: 'Frontend Developer',
      email: 'john.doe@example.com',
      twitter: 'https://twitter.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
    },
    {
      id:'001',

      name: 'Jane Smith',
      role: 'UI/UX Designer',
      email: 'jane.smith@example.com',
      twitter: 'https://twitter.com/janesmith',
      linkedin: 'https://linkedin.com/in/janesmith',
      github: 'https://github.com/janesmith',
    },
    {
      id:'001',

      name: 'Bruce Wayne',
      role: 'Security Specialist',
      email: 'bruce.wayne@example.com',
      twitter: 'https://twitter.com/brucewayne',
      linkedin: 'https://linkedin.com/in/brucewayne',
      github: 'https://github.com/brucewayne',
    },
    {
      id:'001',

      name: 'Tony Stark',
      role: 'Full Stack Developer',
      email: 'tony.stark@example.com',
      twitter: 'https://twitter.com/tonystark',
      linkedin: 'https://linkedin.com/in/tonystark',
      github: 'https://github.com/tonystark',
    },
  ];


