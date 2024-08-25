import React, { useContext, useState } from "react";
import styled from "styled-components";
import { PrimeIcons } from "primereact/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useGetDetail, useGetList } from "@/assets/useHooks/useGet";
import { GroupType } from "@/assets/interface";
import { mockDataTeam } from "@/mocks";
import { Card as PrimeCard } from "primereact/card";
import { Button } from "primereact/button";
import { MyDeleteButton } from "@/resources/components/form/ButtonCustom";
import { GroupPageContext } from "../[id]/page";
import {
  deleteGroup,
  removeStudentGroup,
} from "@/assets/config/apiRequests/StudentApiMutation";
import { Dialog } from "primereact/dialog";

const TeamContainer = styled.section`
  background-color: #1451c9;
  padding: 2rem;
  text-align: center;
  position: relative;
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 2rem;
  font-weight: bold;
`;

const SubTitle = styled.h2`
  color: #cad6e7;
  font-size: 1.5rem;
  margin-top: 0rem;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background-color: #f7fafc;
  padding: 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  background-color: #a0aec0; /* Gray color for avatar placeholder */
  border-radius: 50%;
  margin: 0 auto;
`;

const Name = styled.h3`
  color: #2d3748;
  font-size: 1.25rem;
  margin-top: 1rem;
`;

const Id = styled.p`
  color: #4a5568;
  font-size: 1rem;
  margin-top: 0.5rem;
`;

const SocialLink = styled.a<{ hoverColor: string }>`
  font-size: 1.25rem;
  cursor: pointer;
  color: #1a202c;
  transition: color 0.3s ease;

  &:hover {
    color: ${(props) => props.hoverColor};
  }
`;

const SocialLinks = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;
const DeleteButton = styled(Button)`
  margin-top: 1rem;
  background-color: #f04438; /* Red color for delete button */
  color: #ffffff;
  border: none;
`;
const SettingIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  color: #ffffff;

  z-index: 100;
`;

const TeamPage = () => {
  const { jobs, topic, id, groupDetail, hasGroup, setHasGroup } =
    useContext(GroupPageContext);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const groupId = groupDetail?.id?.toString() ?? "00";
  const {
    isLoading,
    error,
    data,
    isRefetching,
    refetch,
    isFetched,
    isFetchedAfterMount,
  } = useGetDetail<GroupType>({
    module: "group",
  });

  useMutation({
    mutationFn: (data: { Groupid: string; studentIds: string[] }) => {
      return removeStudentGroup(data.Groupid, data.studentIds);
    },
    onSuccess: () => {
      refetch;
    },
    onError: (error) => {
      // Handle the error, for example, show an error message
      console.error("Error deleting member:", error);
    },
  });
  const dissolveGroupMutation = useMutation({
    mutationFn: (Groupid: string[]) => {
      return deleteGroup(Groupid);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["group_detail", "detail", {}],
      });
      setShowDialog(false);
      setHasGroup(false);
    },
    onError: (error) => {
      console.error("Error deleting group:", error);
    },
  });

  const queryClient = useQueryClient();

  // Khi người dùng bấm nút giải tán nhóm

  const handleDisbandGroup = () => {
    dissolveGroupMutation.mutate([groupId]);
    setShowDialog(false);
  };

  const [clickedIcons, setClickedIcons] = useState<{ [key: string]: boolean }>(
    {}
  );
  const handleIconClick = (memberName: string, iconType: string) => {
    const key = `${memberName}-${iconType}`;
    setClickedIcons((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };
  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error loading data</div>;

  return (
    <TeamContainer>
      <SettingIcon onClick={() => setShowDialog(true)}>
        <i className={PrimeIcons.COG} style={{ fontSize: "20px" }} />
      </SettingIcon>
      <Title>Điều chỉnh thành viên hiện tại</Title>
      <SubTitle>Development Team {data?.result?.countMember}</SubTitle>
      <CardsContainer>
        {groupDetail?.students?.map((member, index) => (
          <PrimeCard
            style={{
              backgroundColor: "#f7fafc",
              padding: "1.5rem",
              borderRadius: "0.5rem",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            key={index}
          >
            <Avatar />
            <Name>{member.name}</Name>
            <Id>{member.id}</Id>
            <SocialLinks>
              <SocialLink href={member.email} hoverColor="#cc301c">
                <i className={PrimeIcons.ENVELOPE} />
              </SocialLink>
              <SocialLink href={member.email} hoverColor="#1DA1F2">
                <i className={PrimeIcons.FACEBOOK} />
              </SocialLink>
              <SocialLink href={member.email} hoverColor="#0077B5">
                <i className={PrimeIcons.LINKEDIN} />
              </SocialLink>
              <SocialLink href={member.email} hoverColor="#000000">
                <i className={PrimeIcons.GITHUB} />
              </SocialLink>
            </SocialLinks>
            {/* <DeleteButton label="Delete Member" /> */}
            <MyDeleteButton
              onClick={() =>
                removeStudentGroup(groupId, [member.id?.toString() + ""])
              }
              label="Delete"
              icon="pi pi-trash"
            />
          </PrimeCard>
        ))}
      </CardsContainer>
      <Dialog
        header="Giải tán nhóm"
        visible={showDialog}
        style={{ width: "300px" }}
        onHide={() => setShowDialog(false)}
      >
        <p>Bạn có chắc chắn muốn giải tán nhóm này?</p>
        <div className="flex justify-content-center mt-4">
          <Button
            label="Hủy"
            size="small"
            className="max-w-6rem"
            onClick={() => setShowDialog(false)}
          />
          <Button
            label="Giải tán"
            size="small"
            className="p-button-danger ml-2 max-w-6rem"
            onClick={handleDisbandGroup}
          />
        </div>
      </Dialog>
    </TeamContainer>
  );
};

// Default export for Next.js page
export default TeamPage;
