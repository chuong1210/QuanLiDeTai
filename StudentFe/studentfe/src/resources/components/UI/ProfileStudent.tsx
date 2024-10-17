import React, { useState } from "react";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown"; // Nhập DropdownChangeEvent
import { userProfileType } from "@/assets/interface/UserProfile.type";

interface ProfileCardProps {
  profile: userProfileType;
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
  const { education, personal } = profile;

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | DropdownChangeEvent,
    key: string
  ) => {
    const value = "value" in e ? e.value : (e.target as HTMLInputElement).value;

    setEditedProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  return (
    <Card
      className="p-shadow-5 p-p-3 "
      style={{ maxWidth: "500px", margin: "auto", maxHeight: "120vh" }}
    >
      <div className="p-d-flex p-ai-center p-jc-center p-mb-3">
        <Avatar
          image={personal?.urlAvatar || "/images/default-avatar.png"}
          size="xlarge"
          shape="circle"
          className="p-mr-3"
        />
        <div>
          <h2 className="p-m-0">
            {isEditing ? (
              <InputText
                value={editedProfile.fullName}
                onChange={(e) => handleInputChange(e, "fullName")}
                className="p-inputtext-lg"
              />
            ) : (
              editedProfile.fullName
            )}
          </h2>
          <p className="p-m-0 p-text-secondary">
            {isEditing ? (
              <>
                <InputText
                  value={editedProfile.education?.degree}
                  onChange={(e) => handleInputChange(e, "degree")}
                  className="p-inputtext-md"
                  placeholder="Degree"
                />{" "}
                -
                <InputText
                  value={editedProfile.education?.major}
                  onChange={(e) => handleInputChange(e, "major")}
                  className="p-inputtext-md"
                  placeholder="Major"
                />
              </>
            ) : (
              `${education?.degree} - ${education?.major}`
            )}
          </p>
        </div>
      </div>

      <Divider />

      <div className="p-mb-2">
        <h4 className="p-text-bold p-m-0">Thông Tin Học Vấn</h4>
        <ul className="list-none p-pl-0 p-m-0">
          <li>
            <i className="pi pi-book p-mr-2"></i>Trạng thái:{" "}
            {isEditing ? (
              <InputText
                value={editedProfile.education?.status}
                onChange={(e) => handleInputChange(e, "status")}
                className="p-inputtext-md"
                placeholder="Status"
              />
            ) : (
              "Đang học"
            )}
          </li>
          <li>
            <i className="pi pi-id-card p-mr-2"></i>MSSV: {editedProfile.id}
          </li>
        </ul>
      </div>

      <Divider />

      <div className="p-mb-3">
        <h4 className="p-text-bold p-m-0">Thông Tin Cá Nhân</h4>
        <ul className="list-none p-pl-0 p-m-0">
          <li>
            <i className="pi pi-calendar p-mr-2"></i>Ngày sinh:{" "}
            {isEditing ? (
              <InputText
                type="date"
                value={editedProfile.personal?.dateOfBirth}
                onChange={(e) => handleInputChange(e, "dateOfBirth")}
                className="p-inputtext-md"
              />
            ) : (
              personal?.dateOfBirth
            )}
          </li>
          <li>
            <i className="pi pi-user p-mr-2"></i>Giới tính:{" "}
            {isEditing ? (
              <Dropdown
                value={editedProfile.gender}
                options={[
                  { label: "Nam", value: "male" },
                  { label: "Nữ", value: "female" },
                  { label: "Khác", value: "other" },
                ]}
                onChange={(e) => handleInputChange(e, "gender")}
                placeholder="Chọn giới tính"
                className="p-inputtext-md"
              />
            ) : (
              profile.gender
            )}
          </li>
        </ul>
      </div>

      <div className="p-text-center">
        <Button
          label={isEditing ? "Lưu" : "Chỉnh sửa"}
          icon={isEditing ? "pi pi-save" : "pi pi-pencil"}
          className="p-button-rounded p-button-outlined p-mt-2"
          onClick={() => setIsEditing(!isEditing)}
        />
      </div>
    </Card>
  );
};

export default ProfileCard;
