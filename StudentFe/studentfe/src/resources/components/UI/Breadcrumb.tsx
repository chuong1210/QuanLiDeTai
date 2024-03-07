import { useDispatch } from "@/assets/redux-toolkit";
import menuSlice from "@/assets/redux-toolkit/slices/menu/slice";
import _ from "lodash";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHouseChimney } from "react-icons/fa6";

const Breadcrumb = () => {
  const pathName = usePathname();
  const pathItems = _.drop(pathName.split("/"), 2);
  const dispatch = useDispatch();

  const items = _.map(pathItems, (path) => ({
    path,
    label: `route:${path}`,
    url: "sasa",
  }));

  const Home = ({ showArrow }: { showArrow: boolean }) => (
    <Link
      href={items[0].url}
      key={items[0].label}
      className="flex align-items-center no-underline gap-2 text-primary font-semibold hover:text-blue-300 cursor-pointer"
      onClick={() => {
        onItemClick(items[0].path);
      }}
    >
      <FaHouseChimney />
      <p>{items[0].label}</p>
      {showArrow && <i className="pi pi-angle-right" />}
    </Link>
  );

  const onItemClick = (label: string) => {
    dispatch(
      menuSlice.actions.onItemClick({
        activeItem: label,
        parent: label,
        openMenu: true,
      })
    );
  };

  return (
    <div className="border-round-lg flex align-items-center gap-2 bg-white">
      {items.length > 1 ? (
        items.map((item, index) =>
          index === 0 ? (
            <Home showArrow={true} key={item.label} />
          ) : (
            <Link
              href={item.url}
              key={item.label}
              className="flex align-items-center no-underline gap-2 font-semibold text-800 hover:text-600 cursor-pointer"
              onClick={() => {
                onItemClick(item.path);
              }}
            >
              {item.label == "0" ? "create_new" : item.label}
              {index !== items.length - 1 && (
                <i className="pi pi-angle-right" />
              )}
            </Link>
          )
        )
      ) : (
        <Home showArrow={false} />
      )}
    </div>
  );
};

export default Breadcrumb;
