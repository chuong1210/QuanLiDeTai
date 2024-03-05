import { Loader } from "@/resources/components/UI";

const LoadingPage = () => {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0">
      <Loader show={true} />
    </div>
  );
};

export default LoadingPage;
