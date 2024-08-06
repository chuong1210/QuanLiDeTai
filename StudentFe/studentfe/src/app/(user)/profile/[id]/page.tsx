"use client";
import {
  StudentProfileParamsType,
  StudentProfileType,
} from "@/assets/interface/StudentProfile.type";
import { PageProps } from "@/assets/types/UI";
import { useGetDetail, useGetList } from "@/assets/useHooks/useGet";
import { studentProfile } from "@/mocks";
import ProfileCard from "@/resources/components/UI/ProfileStudent";

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
