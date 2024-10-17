import { useUser } from "@/assets/context/UserContext";
import { PageProps } from "@/assets/types/UI";
import { useRouter } from "next/navigation";
import { ReactNode, Suspense, useEffect, useState } from "react";

export default function Dashboard({
  children,
  withgroup,
  withoutgroup,
}: {
  children: React.ReactNode;
  withgroup: React.ReactNode;
  withoutgroup: React.ReactNode;
  notifications: React.ReactNode;
}) {
  const [hasGroup, setHasGroup] = useState(false); // Giả sử đây là trạng thái để kiểm tra group
  const router = useRouter();
  useEffect(() => {
    // Ví dụ, kiểm tra qua API hoặc token
    const checkGroup = async () => {
      const userGroup = await fetch("api/check-user-group/"); // Giả sử bạn kiểm tra group qua API
      const data = await userGroup.json();
      setHasGroup(data.result); // Xác định nếu người dùng có group
    };

    checkGroup();
  }, []);
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div>
        {hasGroup ? (
          <div>
            <div>{withoutgroup}</div>
          </div>
        ) : (
          <div>
            <div>{withgroup}</div>
          </div>
        )}
      </div>
    </Suspense>
  );
}

export async function getServerSideProps(context: {
  params: { group?: string };
}) {
  const { params } = context;
  const group = params?.group;

  if (group) {
    try {
      const groupExists = await checkGroupExists();
      if (!groupExists) {
        return {
          notFound: true,
        };
      }
    } catch (err) {
      console.error("Error checking group:", err);
      return {
        notFound: true,
      };
    }
  }

  return {
    props: {
      group,
    },
  };
}

async function checkGroupExists() {
  try {
    const response = await fetch(`api/check-user-group/`);
    if (!response.ok) {
      throw new Error(`Failed to check group ${response.status}`);
    }
    const data = await response.json();
    return data?.exists ?? false;
  } catch (error) {
    console.error("Error checking group existence:", error);
    throw error;
  }
}
