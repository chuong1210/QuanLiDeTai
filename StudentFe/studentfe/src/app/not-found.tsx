import { ROUTES } from "@/assets/config";
import Link from "next/link";

const notFound = () => {
  return (
    <div className=" align-items-center justify-content-center flex flex-column h-screen">
      <h1 className="text-pink-900"> Page 404 Not Found</h1>
      <Link className="text-2xl text-blue-900" href={ROUTES.home.index}>
        Go to <span className="font-bold">HomePage</span>
      </Link>
    </div>
  );
};

export default notFound;
