import { LoaderProps } from "@/assets/types/UI";
import { ProgressSpinner } from "primereact/progressspinner";

const Loader = ({
  label = "Loading...",
  show = true,
  duration,
}: LoaderProps) => {
  const animationDuration = duration || 0.8;
  return show ? (
    <div
      className="flex align-items-center justify-content-center absolute top-0 left-0 right-0 bottom-0 gap-2"
      style={{ backgroundColor: "rgba(0,0,0, 0.2)", zIndex: 9999 }}
    >
      <ProgressSpinner
        strokeWidth="8"
        animationDuration={`${animationDuration}s`}
        className="m-0 w-2rem h-2rem"
      />

      <p className="font-semibold text-xl">{label}</p>
    </div>
  ) : null;
};

export default Loader;
