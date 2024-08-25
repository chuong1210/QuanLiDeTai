// components/ProfileCard.tsx
import React from "react";
import { Card } from "primereact/card";
import Image from "next/image";
import { CustomImage } from "@/resources/components/UI";
import { userProfileType } from "@/assets/interface/UserProfile.type";

interface ProfileCardProps {
  profile: userProfileType;
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
  const { education, personal } = profile;
  console.log(personal?.urlAvatar);
  return (
    <Card title="Thông Tin Cá Nhân" className="p-m-3 p-shadow-24">
      <div className="p-d-flex p-ai-center p-mb-3">
        <CustomImage
          src={personal?.urlAvatar}
          alt="Avatar"
          className="border-circle"
          width="100"
          height="100"
          preview
          zoomOutIcon
          imageClassName="p-mr-2 border-circle"
        />
        <div>
          <h2 className="p-m-0">{profile.fullName}</h2>
          <p className="p-m-0 p-text-secondary">
            {education?.degree} - {education?.major}
          </p>
        </div>
      </div>

      <div className="p-text-bold">Thông Tin Học Vấn</div>
      <ul className="list-none p-p-0">
        <li>Trạng thái: {education?.status}</li>
        <li>MSSV: {profile.id}</li>
      </ul>

      <div className="p-text-bold p-mt-2">Thông Tin Cá Nhân</div>
      <ul className="list-none p-p-0">
        <li>Ngày sinh: {personal?.dateOfBirth}</li>
        <li>Giới tính: {profile.gender}</li>
      </ul>
    </Card>
  );
};

export default ProfileCard;
