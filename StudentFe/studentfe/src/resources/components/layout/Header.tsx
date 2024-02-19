"use client";

import { cookies } from "@/assets/helpers";
import { PrimeIcons } from "primereact/api";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import HeadlessTippy from "@tippyjs/react/headless";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/assets/config";

// import { Breadcrumb } from "../UI";
const Logout = () => {
  cookies.logOut();
};
const Header = () => {
  const router = useRouter();

  return (
    <header>
      <div className="flex align-items-center justify-content-between flex-1 h-4rem px-4">
        {/* <Breadcrumb lng={lng} /> */}

        <div
          className="flex align-items-center justify-content-end gap-6"
          style={{ marginRight: "-0.5rem" }}
        >
          <HeadlessTippy
            delay={[0, 200]}
            content="Hộp thư"
            arrow
            placement="bottom"
            render={() => <div>Hello world</div>}
          >
            <div className="flex align-items-center gap-2">
              <Avatar
                icon="pi pi-bell"
                className="bg-primary text-white border-circle"
              />
              <p>{"Thông báo"}</p>
            </div>
          </HeadlessTippy>

          <Button
            icon={PrimeIcons.SHIELD}
            severity="danger"
            label="Đăng xuất"
            onClick={() => {
              Logout();
              router.push(`${ROUTES.auth.sign_in}`);
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
