import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";

import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { position } from "html2canvas/dist/types/css/property-descriptors/position";
import { useMutation } from "@tanstack/react-query";
import { InputTextProps } from "@/assets/types/form";
import { classNames } from "primereact/utils";

const SearchForm = ({
  id,
  label,
  value = "",
  placeholder = "",
  blockClassName = "",

  row = false,
  required = false,
  errorMessage,
  disabled = false,
  onChange = () => {},
  onBlur = () => {},
}: InputTextProps) => {
  const [isPending, setPending] = useState<boolean>(false);

  const handleSearchClick = async () => {
    setPending(true); // Set pending to true immediately

    // Simulate a 3-second delay (replace with your actual API call)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setPending(false); // Set pending to false after the delay
  };
  return (
    <div>
      <IconField iconPosition="right">
        <InputText
          placeholder="Tìm kiếm"
          className={classNames(blockClassName)}
        />
        <InputIcon
          className={
            isPending ? " pi pi-spin pi-spinner" : "pi pi-search cursor-pointer"
          }
          onClick={handleSearchClick}
        />
      </IconField>

      {/* ... your other IconField */}
    </div>
  );
};

export default SearchForm;
