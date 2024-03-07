import { PageProps } from "@/assets/types/UI";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { FaUserGroup } from "react-icons/fa6";

const ExercisePage = ({ params }: PageProps) => {
  const { id } = params;

  return (
    <div className="flex gap-5 pr-2">
      <div className="flex-1">
        <div className="flex gap-3">
          <Button icon="pi pi-book" rounded={true} className="w-3rem h-3rem" />

          <div className="flex-1">
            <div className="border-bottom-1 border-blue-700 pb-3">
              <div className="flex gap-3">
                <p className="font-semibold text-3xl text-blue-700 mt-1 flex-1">
                  Bài tập đầu đời
                </p>
                <Button
                  icon="pi pi-ellipsis-v"
                  outlined={true}
                  className="text-900"
                  rounded={true}
                />
              </div>

              <div className="flex align-items-center justify-content-between my-3">
                <p className="text-sm text-700">Ngô Văn Sơn • 4 thg 11</p>

                <p className="text-sm font-semibold text-900">
                  Đến hạn 10:45 4 thg 11
                </p>
              </div>

              <p>Nói gì đó đi</p>
            </div>

            <div className="mt-4 flex flex-column gap-3">
              <div className="flex align-items-center gap-3">
                <FaUserGroup />
                <p className="text-900 font-semibold">Nhận xét về lớp học</p>
              </div>

              <div className="flex gap-3">
                <Avatar
                  icon="pi pi-user"
                  className="bg-primary text-white border-circle mt-2"
                  size="normal"
                />

                <InputTextarea
                  autoResize={true}
                  rows={1}
                  className="border-round-3xl flex-1 text-sm"
                  placeholder="Thêm nhận xét trong lớp học"
                />

                <Button
                  icon="pi pi-send"
                  className="w-2rem h-2rem mt-2"
                  rounded={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-20rem flex flex-column gap-4">
        <div className="p-4 bg-white shadow-2 border-round">
          <div className="flex align-items-center gap-2">
            <p className="text-xl font-semibold flex-1">Bài tập của bạn</p>

            <p className="font-semibold">Đã nộp</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;
