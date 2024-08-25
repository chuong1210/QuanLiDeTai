"use client";
import {
  StudentProfileParamsType,
  StudentProfileType,
  userProfileType,
} from "@/assets/interface/UserProfile.type";
import { PageProps } from "@/assets/types/UI";
import { useGetDetail, useGetList } from "@/assets/useHooks/useGet";
import { studentProfile } from "@/mocks";
import ProfileCard from "@/resources/components/UI/ProfileStudent";

const ProfilePage = ({ params: { id } }: PageProps) => {
  const queryStudent = useGetDetail<userProfileType, StudentProfileParamsType>({
    module: "student",
  });
  return (
    <div
      className="p-d-flex p-jc-center p-ai-center"
      style={{ height: "100vh" }}
    >
      {queryStudent.data?.result ? (
        <ProfileCard profile={queryStudent.data.result} />
      ) : (
        // Handle the case where data is not yet loaded or there's no result
        <ProfileCard profile={studentProfile} />
      )}
    </div>
  );
};

export default ProfilePage;
