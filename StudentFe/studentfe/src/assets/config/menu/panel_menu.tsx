import Link from "next/link";
import { useRouter } from "next/navigation";

const PANEL_MENU = () => {
  const router = useRouter(); // Sử dụng useRouter để chuyển hướng

  // Hàm xử lý khi nhấn vào menu
  const handleClick = (url: string) => {
    if (url) {
      router.push(url); // Chuyển hướng đến đường dẫn tương ứng
    }
  };

  return [
    {
      key: "1",
      label: "Nhiệm vụ",
      icon: "pi pi-server",
      items: [
        {
          key: "1_0",
          label: "Thêm mới nhiệm vụ",
          command: () => handleClick("/job/new"), // Hàm chuyển hướng
        },
        {
          key: "1_1",
          label: "Chưa giải quyết",
          command: () => handleClick("/exercise/new"), // Hàm chuyển hướng
        },
        {
          key: "1_2",
          label: "Quá hạn",
          command: () => handleClick("/exercise/new"), // Hàm chuyển hướng
        },
      ],
    },
  ];
};

export { PANEL_MENU };
