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
import { useRouter } from "next/router";

const ProfilePage = ({ params: { id } }: PageProps) => {
  const queryStudent = useGetDetail<userProfileType, StudentProfileParamsType>({
    module: "student",
  });
  // const router = useRouter();

  // if (router.isFallback) {
  //   return <div>Loading...</div>;
  // }
  console.log(queryStudent.data?.result);
  return (
    <div
      className="p-d-flex p-jc-center p-ai-center"
      style={{ height: "120vh" }}
    >
      {queryStudent.data?.result ? (
        <ProfileCard profile={queryStudent.data.result} />
      ) : (
        <ProfileCard profile={studentProfile} />
      )}
    </div>
  );
};

// export async function getStaticProps({ params: { id } }: PageProps) {
//   const res = await fetch(``);
//   const user = await res.json();

//   return {
//     props: {
//       user,
//     },
//     fallback: true,
//   };
// }
export default ProfilePage;
