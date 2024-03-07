import React, { LegacyRef, forwardRef, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ScheduleType } from "@/assets/interface";
import { Button } from "primereact/button";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

const convertDayOfWeek = (day: string) => {
  const conversion: any = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
  };
  return conversion[day];
};
const daysOfWeek = [
  { name: "Mon", dayIndex: 1, displayName: "Thứ 2" },
  { name: "Tue", dayIndex: 2, displayName: "Thứ 3" },
  { name: "Wed", dayIndex: 3, displayName: "Thứ 4" },
  { name: "Thu", dayIndex: 4, displayName: "Thứ 5" },
  { name: "Fri", dayIndex: 5, displayName: "Thứ 6" },
  { name: "Sat", dayIndex: 6, displayName: "Thứ 7" },
  { name: "Sun", dayIndex: 7, displayName: "Chủ nhật" },
];

interface TableData {
  day: string;
  dayOfWeek: string;
  shift: string;
  course: string;
  code?: string;
  session?: string;
  room: string;
  teacher?: string;
}
interface ScheduleFormRefType {
  show?: (_data?: ScheduleType) => void;
  close?: () => void;
}

interface ScheduleFormType {
  title: string;
  onSuccess?: (_data: ScheduleType) => void;
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
  const scheduleDataTemplate: ISchedule = {
    Morning: { period: "Buổi", time: "Sáng" },
    Afternoon: { period: "Buổi", time: "Chiều" },
    Evening: { period: "Buổi", time: "Tối" },
  };
  const rowsData: TableData[] = [
    {
      day: "04/03/2024",
      dayOfWeek: "Monday",
      shift: "Afternoon",
      course: "Lập trình hướng đối tượng",
      code: "13DHTH03 - 010110196203",
      session: "4 - 6",
      room: "A402 - 140 Lê Trọng Tấn",
      teacher: "Bùi Công Danh",
    },
    {
      day: "04/03/2024",
      dayOfWeek: "Saturday",
      shift: "Afternoon",
      course: "Lập trình hướng đối tượng",
      code: "13DHTH03 - 010110196203",
      session: "4 - 6",
      room: "A402 - 140 Lê Trọng Tấn",
      teacher: "Bùi Công Danh",
    },
    {
      day: "04/03/2024",
      shift: "Evening",
      dayOfWeek: "Monday",
      course: "Lập trình hướng đối tượng",
      code: "13DHTH03 - 010110196203",
      session: "4 - 6",
      room: "A402 - 140 Lê Trọng Tấn",
      teacher: "Bùi Công Danh",
    },
    {
      day: "04/03/2024",
      shift: "Morning",
      dayOfWeek: "Sunday",
      course: "Lập trình hướng đối tượng",
      code: "13DHTH03 - 010110196203",
      session: "4 - 6",
      room: "A402 - 140 Lê Trọng Tấn",
      teacher: "Bùi Công Danh",
    },
    // ... (Thêm dữ liệu cho các dòng khác)
  ];
  const scheduleData: ISchedule = rowsData.reduce(
    (acc: any, item: any) => {
      const { shift, dayOfWeek, course, teacher, room } = item;
      acc[shift][
        convertDayOfWeek(dayOfWeek)
      ] = `${course}\n Giáo viên ${teacher} (Phòng: ${room})`;
      return acc;
    },
    {
      Morning: { period: "Buổi", time: "Sáng" },
      Afternoon: { period: "Buổi", time: "Chiều" },
      Evening: { period: "Buổi", time: "Tối" },
    }
  );

  const ColumnScedule = {
    background:
      "url(https://sinhvien.hufi.edu.vn/Content/ThemeMXH/img/icons/transparent-pattern-square-4.png)",
  };
  const headerFirstRowClass = {
    background: "#ffffce",
    borderBottom: "2px solid #cad6d8",
    color: " #rgb(102, 117, 128)    ",
    border: "1px solid #ddd",
    width: "20px",
    maxWidth: "20px",
    whiteSpace: "nowrap",
  };

  const headerRowClass = {
    borderBottom: "2px solid #cad6d8",
    color: " #1da1f2",
    whiteSpace: "nowrap",
    background: "#rgb(102, 117, 128)",
  };
  const formattedData = Object.values(scheduleData);
  const bodyTemplate = (rowData: any, column: any) => {
    if (rowData[column.field]) {
      return (
        <div
          style={{
            backgroundColor: "rgba(54, 144, 241, 0.5)", // Chỉnh màu xanh và độ trong suốt như bạn muốn
            padding: "10px",
            borderRadius: "5px",
            color: "white",
            width: "80%",
            marginLeft: "15px",
            opacity: "98%",
          }}
        >
          {rowData[column.field]}
        </div>
      );
    }
    return null;
  };

  const headerTemplate = (header: string) => {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: header }}
        style={{ textAlign: "center" }}
      />
    );
  };

  const [firstDayOfWeek, setFirstDayOfWeek] = useState<Date>(new Date());
  useEffect(() => {
    const now = new Date();
    const currentDayOfWeek = now.getDay();
    const currentDayOfMonth = now.getDate();
    const firstDayOfWeek = new Date();

    if (currentDayOfWeek !== 0) {
      // if it's not Sunday
      firstDayOfWeek.setDate(currentDayOfMonth - currentDayOfWeek);
    } else {
      // if it's Sunday, set it to last Monday
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

  // ... (phần code khác)

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

  // @ts-ignore

  return (
    <div>
      <h3>Thời Khóa Biểu</h3>
      <div className="p-d-flex p-jc-between">
        <Button
          size="small"
          className="text-center"
          onClick={handlePreviousClick}
          label="Previous"
          outlined
          icon="pi pi-chevron-left"
        ></Button>
        <Button
          icon="pi pi-chevron-right"
          size="small"
          className="ml-2 max-w-6rem w-full p-justify-end"
          label="Next"
          onClick={handleNextClick}
          raised
          severity="info"
          outlined
        ></Button>
      </div>

      <div ref={ref as LegacyRef<HTMLDivElement>}>
        <DataTable
          value={formattedData}
          style={{
            textAlign: "center",
          }}
          showGridlines
        >
          <Column
            field="time"
            header="Ca học"
            headerStyle={headerRowClass}
            bodyStyle={headerFirstRowClass}
          />
          {daysOfWeek.map(({ name, dayIndex, displayName }, index) => (
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
          ))}
        </DataTable>
      </div>
    </div>
  );
});
ScheduleTable.displayName = "ScheduleTable";

export { ScheduleTable };
