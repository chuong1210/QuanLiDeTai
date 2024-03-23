import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TableProps } from "@/assets/types/form";
import { classNames } from "primereact/utils";
import { StyleClass } from "primereact/StyleClass";
import { Row } from "primereact/row";
import { headers } from "next/headers";
import { date } from "@/assets/helpers";
import { groupBy } from "lodash";
import { da } from "date-fns/locale";
import { Button } from "primereact/button";
interface dayofWeekType {
  Monday: string;
  Tuesday: string;
  Wednesday: string;
  Thursday: string;
  Friday: string;
  Saturday: string;
  Sunday: string;
}
function getDayOfWeek(day: keyof dayofWeekType) {
  const daysOfWeek: dayofWeekType = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
  };
  return daysOfWeek[day];
}

function getDateOfWeek(dayIndex: number): number {
  const curr = new Date(); // get current date
  const firstDayOfWeek = new Date(
    curr.setDate(curr.getDate() - curr.getDay() + 1)
  ); // Đặt lại thời gian cho ngày đầu tiên của tuần
  firstDayOfWeek.setDate(firstDayOfWeek.getDate() + dayIndex); // Tăng lên để đạt được ngày mong muốn của tuần
  return firstDayOfWeek.getDate(); // Trả về ngày của tháng
}
const TableSchema = ({ data }: any) => {
  const headerRowClass = {
    background:
      "#f3f7f9" +
      "url(https://sinhvien.hufi.edu.vn/Content/ThemeMXH/img/icons/transparent-pattern-square-4.png)",
    borderBottom: "2px solid #cad6d8",
    color: " #1da1f2",
    whiteSpace: "nowrap",
  };

  const headerFirstRowClass = {
    background: "#ffffce",
    borderBottom: "2px solid #cad6d8",
    color: " #1da1f2",
    border: "1px solid #ddd",
    whiteSpace: "nowrap",
  };

  interface IScheduleDataType {
    [key: string]: { [key: string]: string };
  }
  const scheduleData: IScheduleDataType = {
    Morning: { period: "Buổi", time: "Sáng" },
    Afternoon: { period: "Buổi", time: "Chiều" },
    Evening: { period: "Buổi", time: "Tối" },
  };
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
      shift: "Morning",
      dayOfWeek: "Monday",
      course: "Lập trình hướng đối tượng",
      code: "13DHTH03 - 010110196203",
      session: "4 - 6",
      room: "A402 - 140 Lê Trọng Tấn",
      teacher: "Bùi Công Danh",
    },
  ];
  interface apiData {
    room: string;
    class: string;
    time: string;
    day: string;
  }
  const apiData: apiData[] = [
    { room: "101", class: "Math", time: "Morning", day: "Monday" },
    { room: "202", class: "English", time: "Afternoon", day: "Tuesday" },
  ];

  // apiData.forEach((item) => {
  //   if (["Morning", "Afternoon", "Evening"].includes(item.time)) {
  //     const day = getDayOfWeek(item.day as keyof dayofWeekType);
  //     scheduleData[item.time as keyof IScheduleDataType][
  //       day
  //     ] = `${item.class} (Phòng: ${item.room})`;
  //   }
  // });
  rowsData.forEach((item) => {
    if (["Morning", "Afternoon", "Evening"].includes(item.shift)) {
      const day = getDayOfWeek(item.dayOfWeek as keyof dayofWeekType);
      scheduleData[item.shift as keyof IScheduleDataType][
        day
      ] = `${item.course}\n Giáo viên ${item.teacher} (Phòng: ${item.room})`;
    }
  });

  const formattedData = Object.values(scheduleData);
  return (
    // <div className="table-responsive  " style={{ overflowX: "hidden" }}>
    //   <Button onClick={handlePrevious}>Previous</Button>

    //   {/* Nút Next */}
    //   <Button color="danger" onClick={handleNext}>
    //     Next
    //   </Button>
    //   <DataTable
    //     showGridlines
    //     value={shiftArray}
    //     className=" overflow-hidden fl-table table table-bordered text-center no-footer dtr-inline w-full center mb-8 max-w-full "
    //     tableStyle={{ maxWidth: "5rem", overflow: "hidden" }}
    //     role="grid"
    //   >
    //     <Column
    //       field="shift"
    //       header="Ca học"
    //       style={headerFirstRowClass}
    //       headerStyle={{ background: "#f3f7f9" }}
    //       body={(sh) => <div>{sh}</div>}
    //     />
    //     {rowsData.map((date, index) => {
    //       const rowData = shiftArray.find(
    //         (row: string) => row === date.shift
    //       );
    //       return (
    //         <Column
    //           key={index}
    //           field={`day${index + 1}`}
    //           header={
    //             <>
    //               <span>{date.dayOfWeek}</span>
    //               <br />
    //               <span>{date.day}</span>
    //             </>
    //           }
    //           body={(data) =>
    //             data === date.shift &&
    //             rowData === date.shift && (
    //               <div style={headerRowClass}>
    //                 <span>{date.course}</span>
    //                 <br />
    //                 <h1>{date.teacher}</h1>
    //                 <span>{date.room}</span>
    //               </div>
    //             )
    //           }
    //           style={headerRowClass}
    //         />
    //       );
    //     })}
    //   </DataTable>
    // </div>
    <div>
      <h3>Thời Khóa Biểu</h3>
      <DataTable value={formattedData} showGridlines>
        {/* <Column field="period" header="" style={headerFirstRowClass} /> */}
        <Column field="time" style={headerFirstRowClass} header="Ca học" />
        <Column
          field="Mon"
          header={`Thứ 2 (${getDateOfWeek(0)})`}
          style={headerRowClass}
        />
        <Column field="Tue" header={`Thứ 3 (${getDateOfWeek(1)})`} />
        <Column field="Wed" header={`Thứ 4 (${getDateOfWeek(2)})`} />
        <Column field="Thu" header={`Thứ 5 (${getDateOfWeek(3)})`} />
        <Column field="Fri" header={`Thứ 6 (${getDateOfWeek(4)})`} />
        <Column field="Sat" header={`Thứ 7 (${getDateOfWeek(5)})`} />
      </DataTable>
    </div>
  );
};

export { TableSchema };
