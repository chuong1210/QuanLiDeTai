import { CheckboxProps } from "@/assets/types/form";
import React from "react";
import styled from "styled-components";

const CheckboxWrapper = styled.div`
  display: inline-block;

  input[type="checkbox"] {
    display: none;
  }

  label {
    --size: 30px; /* Adjust size as needed */
    --shadow: calc(var(--size) * 0.07) calc(var(--size) * 0.1);
    position: relative;
    display: block;
    width: var(--size);
    height: var(--size);
    background-color: #4158d0;
    background-image: linear-gradient(
      43deg,
      #4158d0 0%,
      #86befe 46%,
      #ffcc70 100%
    );
    border-radius: 50%;
    box-shadow: 0 var(--shadow) #ffbeb8;
    cursor: pointer;
    transition: 0.2s ease transform, 0.2s ease background-color,
      0.2s ease box-shadow;
    overflow: hidden;
    z-index: 1;

    &:before {
      content: "";
      position: absolute;
      top: 50%;
      right: 0;
      left: 0;
      width: calc(var(--size) * 0.7);
      height: calc(var(--size) * 0.7);
      margin: 0 auto;
      background-color: #fff;
      transform: translateY(-50%);
      border-radius: 50%;
      box-shadow: inset 0 var(--shadow) #ffbeb8;
      transition: 0.2s ease width, 0.2s ease height;
    }

    &:hover:before {
      width: calc(var(--size) * 0.55);
      height: calc(var(--size) * 0.55);
      box-shadow: inset 0 var(--shadow) #ff9d96;
    }

    &:active {
      transform: scale(0.9);
    }
  }

  .tick_mark {
    position: absolute;
    top: -1px;
    right: 0;
    left: calc(var(--size) * -0.05);
    width: calc(var(--size) * 0.6);
    height: calc(var(--size) * 0.6);
    margin: 0 auto;
    margin-left: calc(var(--size) * 0.14);
    transform: rotateZ(-40deg);

    &:before,
    &:after {
      content: "";
      position: absolute;
      background-color: #fff;
      border-radius: 2px;
      opacity: 0;
      transition: 0.2s ease transform, 0.2s ease opacity;
    }

    &:before {
      left: 0;
      bottom: 0;
      width: calc(var(--size) * 0.1);
      height: calc(var(--size) * 0.3);
      box-shadow: -2px 0 5px rgba(0, 0, 0, 0.23);
      transform: translateY(calc(var(--size) * -0.68));
    }

    &:after {
      left: 0;
      bottom: 0;
      width: 100%;
      height: calc(var(--size) * 0.1);
      box-shadow: 0 3px 5px rgba(0, 0, 0, 0.23);
      transform: translateX(calc(var(--size) * 0.78));
    }
  }

  input[type="checkbox"]:checked + label {
    background-color: #4158d0;
    background-image: linear-gradient(
      43deg,
      #4158d0 0%,
      #86befe 46%,
      #ffcc70 100%
    );
    box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px,
      rgba(0, 0, 0, 0.22) 0px 15px 12px;
  }

  input[type="checkbox"]:checked + label:before {
    width: 0;
    height: 0;
  }

  input[type="checkbox"]:checked + label .tick_mark:before,
  input[type="checkbox"]:checked + label .tick_mark:after {
    transform: translate(0);
    opacity: 1;
  }
`;

const CustomCheckbox: React.FC<CheckboxProps> = ({ value, onChange }) => {
  console.log(value);
  return (
    <CheckboxWrapper>
      <input
        id="custom-checkbox"
        type="checkbox"
        checked={value}
        onChange={onChange}
      />
      <label htmlFor="custom-checkbox">
        <div className="tick_mark"></div>
      </label>
    </CheckboxWrapper>
  );
};

export default CustomCheckbox;
