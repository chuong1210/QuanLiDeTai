import { InputPasswordProps } from "@/assets/types/form";
import { InputText } from "primereact/inputtext";
import { Password as PrimePassword } from "primereact/password";
import { classNames } from "primereact/utils";
import { useState } from "react";

const Password = ({
  id,
  label,
  value = "",
  placeholder = "",
  blockClassName = "",
  row = false,
  errorMessage,
  onChange = () => {},
  onBlur = () => {},
}: InputPasswordProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className={classNames(blockClassName)}>
      <div className={classNames("block", { "flex align-items-center": row })}>
        {label && (
          <label
            htmlFor={id}
            className={classNames("text-900 font-medium block text-800", {
              "w-10rem mr-2": row,
              "mb-2": !row,
              "p-error": !!errorMessage,
            })}
          >
            {label}
          </label>
        )}
        <span className="p-input-icon-right w-full">
          <InputText
            id={id}
            value={value.toString()}
            placeholder={placeholder}
            spellCheck={false}
            className={classNames("w-full p-3 flex-1", {
              "p-invalid": !!errorMessage,
            })}
            type={isPasswordVisible ? "text" : "password"}
            onChange={onChange}
            style={{ height: "47px" }}
          />
          <i
            className={classNames("pi", {
              "pi-eye": !isPasswordVisible,
              "pi-eye-slash": isPasswordVisible,
            })}
            onClick={togglePasswordVisibility}
            style={{
              cursor: "pointer",
              right: "10px",
              position: "absolute",
              top: "70%",
              transform: "translateY(-50%)",
            }}
          />
        </span>
      </div>
      <small className="p-error">{errorMessage}</small>
    </div>
  );
};

export { Password };
