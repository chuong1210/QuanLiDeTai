import { Loader } from "@/resources/components/UI";
import React from "react";

const Loading = async () => {
  setTimeout(() => {
    return (
      <div>
        <Loader duration={3} show={true} />
      </div>
    );
  }, 3000);
};

export default Loading;
