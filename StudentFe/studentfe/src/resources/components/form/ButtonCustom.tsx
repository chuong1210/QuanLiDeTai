import React from "react";
import styled from "styled-components";
import { PrimeIcons } from "primereact/api";
import { Button, ButtonProps } from "primereact/button";

const DeleteButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
`;

const DeleteButton = styled(Button)`
  background-color: #f04438; /* Red color for delete button */
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem; /* Adjust padding as needed */
  border-radius: 0.5rem;
  transition: all 0.3s ease; /* Add transition for smoother effect */

  &:hover {
    background-color: #d9534f; /* Slightly darker red on hover */
    .delete-icon {
      transform: translateX(50%); /* Move icon to center */
    }
    .delete-text {
      opacity: 0; /* Hide text on hover */
    }
  }
`;

const DeleteIcon = styled.span`
  position: absolute;
  left: 1rem; /* Adjust position as needed */
  font-size: 1.25rem;
  transition: transform 0.3s ease; /* Add transition for smoother effect */
`;

const DeleteText = styled.span`
  transition: opacity 0.3s ease; /* Add transition for smoother effect */
`;

const MyDeleteButton1 = ({ onClick }: ButtonProps) => {
  return (
    <DeleteButtonContainer>
      <DeleteButton>
        <DeleteIcon className="delete-icon">
          <i className={PrimeIcons.TRASH} />
        </DeleteIcon>
        <DeleteText className="delete-text">Delete</DeleteText>
      </DeleteButton>
    </DeleteButtonContainer>
  );
};

const MyDeleteButton = styled(Button)`
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  font-weight: 700;
  background: rgb(255, 255, 255);
  color: #2c4dd0;
  cursor: pointer;
  border-radius: 0.5rem;
  border-bottom: 2px solid #2c4dd0;
  border-right: 2px solid #2c4dd0;
  border-top: 2px solid #2c4dd0;
  border-left: 2px solid #2c4dd0;
  max-height: 60px;
  margin-top: 2rem;
  transition: border-top 1s, border-left 1s, border-bottom 1s, border-right 1s,
    box-shadow 1s;

  &:hover {
    border-top: 2px solid blueviolet;
    border-left: 2px solid blueviolet;
    border-bottom: 2px solid rgb(238, 103, 238);
    border-right: 2px solid rgb(238, 103, 238);
    box-shadow: rgba(38, 154, 193, 0.4) 5px 5px,
      rgba(38, 154, 193, 0.3) 10px 10px, rgba(38, 154, 193, 0.2) 15px 15px;
  }
`;

export { MyDeleteButton, MyDeleteButton1 };
