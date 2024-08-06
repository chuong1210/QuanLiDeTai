import React, {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  LegacyRef,
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ScheduleType } from "@/assets/interface";
import { Button } from "primereact/button";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { da } from "date-fns/locale";
import { InputDate } from "../form/InputDate";
import {
  Calendar,
  CalendarSelectEvent,
  CalendarViewChangeEvent,
} from "primereact/calendar";
import { ChangeHandler } from "react-hook-form";
import { CalendarChangeParams } from "@/assets/types/form";
import { scheduleDataTable } from "@/mocks";
import { text } from "stream/consumers";
import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";
import { fontSans } from "../../../app/layout";

const daysOfWeek: daysofWeekType[] = [
  { name: "Mon", dayIndex: 1, displayName: "Thứ 2" },
  { name: "Tue", dayIndex: 2, displayName: "Thứ 3" },
  { name: "Wed", dayIndex: 3, displayName: "Thứ 4" },
  { name: "Thu", dayIndex: 4, displayName: "Thứ 5" },
  { name: "Fri", dayIndex: 5, displayName: "Thứ 6" },
  { name: "Sat", dayIndex: 6, displayName: "Thứ 7" },
  { name: "Sun", dayIndex: 7, displayName: "Chủ nhật" },
];

interface daysofWeekType {
  name: string;
  dayIndex: number;
  displayName: string;
}
interface TableData {
  day: string;
  shift: string;
  course: string;
  code?: string;
  session?: string;
  room: string;
  teacher?: string;
}

interface ISchedule {
  Morning: {
    period: string;
    time: string;
    [key: string]: string;
  };
  Afternoon: {
    period: string;
    time: string;
    [key: string]: string;
  };
  Evening: {
    period: string;
    time: string;
    [key: string]: string;
  };
}

//...
// Trong hàm ScheduleTable

const ScheduleTable = forwardRef((props, ref) => {
  const [firstDayOfWeek, setFirstDayOfWeek] = useState<Date>(new Date());
  const [currentDay, setCurrentDay] = useState<Date>(new Date());

  const scheduleDataTemplate: ISchedule = useMemo(() => {
    return {
      Morning: { period: "Buổi", time: "Sáng" },
      Afternoon: { period: "Buổi", time: "Chiều" },
      Evening: { period: "Buổi", time: "Tối" },
    };
  }, []);
  // const rowsData: TableData[] = useMemo(
  //   () => [
  //     {
  //       day: "24/03/2024",
  //       shift: "Evening",
  //       course: "Cơ sở dữ liệu",
  //       code: "13DHTH08 - 010110196112",
  //       session: "7 - 9",
  //       room: "F601 - 140 Lê Trọng Tấn",
  //       teacher: "Trần Trương Tuấn Phát",
  //     },
  //     {
  //       day: "20/03/2024",
  //       shift: "Afternoon",
  //       course: "Lập trình hướng đối tượng",
  //       code: "13DHTH03 - 010110196203",
  //       session: "4 - 6",
  //       room: "A402 - 140 Lê Trọng Tấn",
  //       teacher: "Bùi Công Danh",
  //     },
  //     {
  //       day: "24/04/2024",
  //       shift: "Afternoon",
  //       course: "Tiếng anh 2",
  //       code: "13DHTH03 - 010110196203",
  //       session: "4 - 6",
  //       room: "A102 - 140 Lê Trọng Tấn",
  //       teacher: "Ngọc Hiền",
  //     },
  //     {
  //       day: "24/04/2024",
  //       shift: "Morning",
  //       course: "Tiếng anh 3",
  //       code: "13QTKD03 - 010110196203",
  //       session: "4 - 6",
  //       room: "A102 - 140 Lê Trọng Tấn",
  //       teacher: "Phan thị châu trinh",
  //     },
  //     {
  //       day: "24/02/2024",
  //       shift: "Morning",
  //       course: "Bắn súng",
  //       code: "13DHTH03 - 010110196203",
  //       session: "4 - 6",
  //       room: "A102 - 140 Lê Trọng Tấn",
  //       teacher: "Phan thị châu trinh",
  //     },
  //   ],
  //   []
  // );

  const ColumnScedule = {
    background:
      "url(https://sinhvien.hufi.edu.vn/Content/ThemeMXH/img/icons/transparent-pattern-square-4.png)",
  };
  const headerFirstColumnClass = {
    background: "#ffffce",
    borderBottom: "1px solid #cad6d8",
    color: " #667580 ",
    border: "1px solid #ddd",
    width: "10px",
    maxWidth: "2rem",
    fontSize: "1.3rem",
    fontWeight: "700",
    fontFamily: "Tahoma !important",
  };

  const headerRowClass = {
    borderBottom: "2px solid #cad6d8",
    color: "#1da1f2",
    whiteSpace: "nowrap",
    background: "#rgb(102, 117, 128)",
    left: "20px",
  };

  const parseData = (data: string) => {
    // Phân tách dữ liệu dựa vào việc xuống dòng của chuỗi.
    const lines = data.split("\n");

    // Tên khóa học nằm ở dòng đầu tiên.
    const course = lines[0].trim();

    // Biến để lưu thông tin giáo viên và phòng học.
    let teacherInfo = "";
    let roomInfo = "";

    // Kiểm tra xem có dữ liệu cho phòng học và giáo viên hay không.
    if (lines.length > 2) {
      teacherInfo = `GV: ${lines[1].trim()}`; // Lấy thông tin giáo viên từ dòng thứ hai và thêm tiền tố "GV:".
      roomInfo = `R: ${lines[2].trim()}`; // Lấy thông tin phòng học từ dòng thứ ba và thêm tiền tố "R:".
    }

    // Trả về đối tượng với các thông tin đã xử lý.
    return { course, teacher: teacherInfo, room: roomInfo };
  };

  const bodyTemplate = (rowData: any, column: any) => {
    if (rowData[column.field]) {
      const { course, teacher, room } = parseData(rowData[column.field]);
      return (
        <div
          style={{
            backgroundColor: "rgb(253, 255, 154)",
            borderBottomColor: "rgb(237, 175, 0)",
            padding: "10px",
            borderRadius: "7px",
            color: "#667580",
            whiteSpace: "pre-line", // Thêm dòng này để chuỗi có các ký tự ngắt dòng được hiển thị chính xác
            textAlign: "left", // Chuyển từ căn giữa sang căn trái để xuống dòng đúng chỗ
            overflow: "hidden", // Đảm bảo rằng dữ liệu không vượt ra ngoài khối
            width: "100%", // Cho phép trải rộng toàn bộ cell nếu cần
            minHeight: "100%", // Đảm bảo tối thiểu chiều cao để hiển thị đầy đủ dữ liệu
          }}
        >
          <div style={{ color: "black", fontSize: "16px", fontWeight: "600" }}>
            {course}
          </div>
          <div
            className="m-3"
            style={{ fontSize: "13px", color: "black", fontWeight: "400" }}
          >
            {teacher}
          </div>
          <div
            className="m-3 h"
            style={{ fontSize: "13px", color: "black", fontWeight: "400" }}
          >
            {room}
          </div>
        </div>
      );
    }
    return null;
  };

  // Hàm này chuyển đổi ngày từ dạng chuỗi dd/mm/yyyy thành đối tượng Date
  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const headerTemplate = (header: string) => {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: header }}
        style={{ textAlign: "center", marginLeft: "1.1rem" }}
      />
    );
  };

  useEffect(() => {
    const now = new Date();
    const currentDayOfWeek = now.getDay();
    const currentDayOfMonth = now.getDate();
    const firstDayOfWeek = new Date();

    if (currentDayOfWeek !== 0) {
      firstDayOfWeek.setDate(currentDayOfMonth - currentDayOfWeek);
    } else {
      firstDayOfWeek.setDate(currentDayOfMonth - 6);
    }

    setFirstDayOfWeek(firstDayOfWeek);
  }, []);
  const handleNextClick = () => {
    const newFirstDayOfWeek = new Date(firstDayOfWeek);
    newFirstDayOfWeek.setDate(firstDayOfWeek.getDate() + 7);
    setFirstDayOfWeek(newFirstDayOfWeek);
  };

  const handlePreviousClick = () => {
    const newFirstDayOfWeek = new Date(firstDayOfWeek);
    newFirstDayOfWeek.setDate(firstDayOfWeek.getDate() - 7);
    setFirstDayOfWeek(newFirstDayOfWeek);
  };

  const getDateOfWeek = (dayIndex: number) => {
    const currentDate = new Date(firstDayOfWeek);
    currentDate.setDate(firstDayOfWeek.getDate() + dayIndex);

    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  // Sử dụng state để lưu trữ lịch học cho tuần hiện tại
  const [currentWeekData, setCurrentWeekData] = useState<TableData[]>([]);

  useEffect(() => {
    const getCurrentWeekData = (rowsData: TableData[], startDate: Date) => {
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 7); // kết thúc vào Chủ Nhật của tuần

      return rowsData
        .filter((dataItem) => {
          const itemDate = parseDate(dataItem.day);
          return itemDate >= startDate && itemDate <= endDate;
        })
        .reduce((weekData, item) => {
          const dayName =
            daysOfWeek.find((d) => parseDate(item.day).getDay() === d.dayIndex)
              ?.name || "Sun";
          if (dayName) {
            weekData[item.shift][
              dayName
            ] = `${item.course}\n${item.teacher}\n${item.room}`;
          }
          return weekData;
        }, JSON.parse(JSON.stringify(scheduleDataTemplate)));
    };

    setCurrentWeekData(getCurrentWeekData(scheduleDataTable, firstDayOfWeek));
  }, [firstDayOfWeek, scheduleDataTemplate]); //rowsdata o day
  const data = Object.values(currentWeekData);
  // Hàm này tìm ngày đầu tiên của tuần dựa vào ngày được chọn (date)
  // Chúng ta giả định rằng tuần bắt đầu từ thứ Hai
  const getFirstDayOfWeekFromDate = (date: Date) => {
    const dayOfWeek = date.getDay(); // Lấy ra ngày của tuần từ ngày hiện tại (0 là Chủ Nhật, 1 là Thứ Hai, ...)
    const firstDayOfWeek = new Date(date); // Sao chép đối tượng Date để tránh thay đổi nó
    if (dayOfWeek !== 0) {
      firstDayOfWeek.setDate(date.getDate() - dayOfWeek);
    } else {
      // Nếu là Chủ Nhật, lùi lại 6 ngày để đến thứ Hai tuần trước
      firstDayOfWeek.setDate(date.getDate() - 6);
    }
    firstDayOfWeek.setHours(0, 0, 0, 0); // Đặt giờ bằng 0 để là ngày đầu tiên của tuần

    return firstDayOfWeek;
  };
  const onDateChange = (e: any) => {
    if (e.value) {
      setCurrentDay(e.value); // Cập nhật ngày hiện tại
      const newFirstDayOfWeek = getFirstDayOfWeekFromDate(e.value);
      setFirstDayOfWeek(newFirstDayOfWeek); // Cập nhật ngày đầu tiên của tuần dựa vào ngày được chọn
    }
  };
  return (
    <div className="mt-3">
      <div className="p-d-flex p-jc-between mb-3">
        <Button
          size="small"
          className="p-button-outlined p-mr-2 "
          onClick={handlePreviousClick}
          label="Trở về"
          outlined
          icon="pi pi-chevron-left"
        ></Button>

        <Button
          icon="pi pi-chevron-right"
          size="small"
          className="p-button-outlined p-mr-2 ml-2 w-6rem"
          label="Tiếp"
          iconPos="right"
          onClick={handleNextClick}
          outlined
        ></Button>
        <Calendar
          locale="vi"
          hideOnDateTimeSelect={true}
          value={currentDay}
          hourFormat="24"
          dateFormat="dd/mm/yy"
          showIcon
          onChange={onDateChange}
          inputClassName="w-7rem h-2rem ml-2 p-inputtext p-component p-rounded "
          className="p-mr-2 h-2rem mb-1  "
        />
      </div>

      <div ref={ref as LegacyRef<HTMLDivElement>}>
        <DataTable
          // value={formattedData}
          value={data}
          style={{
            textAlign: "center",
          }}
          showGridlines
        >
          <Column
            field="time"
            header="Ca học"
            headerStyle={headerRowClass}
            bodyStyle={headerFirstColumnClass}
          />
          {daysOfWeek.map(
            ({ name, dayIndex, displayName }: daysofWeekType, index) => (
              <Column
                key={index}
                field={name}
                header={headerTemplate(
                  `${displayName}<br/>${getDateOfWeek(dayIndex)}`
                )}
                headerStyle={headerRowClass}
                //    header={`Thứ ${dayIndex + 1} (${getDateOfWeek(dayIndex)})`}
                bodyStyle={{
                  maxWidth: "100px",
                  minHeight: "100px",
                  width: "80px",
                  height: "200px",
                  whiteSpace: "wrap",
                  textAlign: "center",
                }}
                body={bodyTemplate}
                style={ColumnScedule}
              />
            )
          )}
        </DataTable>
      </div>
    </div>
  );
});
ScheduleTable.displayName = "ScheduleTable";

export { ScheduleTable };
