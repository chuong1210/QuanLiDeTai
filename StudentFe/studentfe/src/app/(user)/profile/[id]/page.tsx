"use client";
import {
  StudentProfileParamsType,
  StudentProfileType,
} from "@/assets/interface/StudentProfile.type";
import { PageProps } from "@/assets/types/UI";
import { useGetDetail, useGetList } from "@/assets/useHooks/useGet";
import ProfileCard from "@/resources/components/UI/ProfileStudent";

const studentProfile: StudentProfileType = {
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
const ProfilePage = ({ params: { id } }: PageProps) => {
  const queryStudent = useGetList<StudentProfileType, StudentProfileParamsType>(
    {
      module: "student",
      params: { id }, //studentid cung dc
    }
  );
  return (
    <div
      className="p-d-flex p-jc-center p-ai-center"
      style={{ height: "100vh" }}
    >
      <ProfileCard profile={studentProfile} />
    </div>
  );
};

export default ProfilePage;
