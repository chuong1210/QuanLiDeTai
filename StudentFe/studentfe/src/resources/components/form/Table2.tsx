import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TableProps } from "@/assets/types/form";
import { classNames } from "primereact/utils";

const TableSchema = ({ data }: any) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const generateDates = (startDate: Date, days: number) => {
    const dateArray = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dateArray.push(date);
    }
    return dateArray;
  };

  const handleNextClick = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const rowsData = generateDates(currentDate, 7);

  return (
    <div className="table-responsive overflow-x-auto">
      <button onClick={handleNextClick}>Next</button>
      <table
        className="fl-table table table-bordered text-center no-footer dtr-inline w-full center mb-8 max-w-full"
        role="grid"
      >
        <thead
          className="bg-[#f3f7f9] "
          style={{
            background: "#f3f7f9",
            borderBottom: "2px solid #cad6d8",
            color: " #1da1f2",
            whiteSpace: "nowrap",
          }}
        >
          <tr role="row" className="max-h-0">
            <th lang="lichtheotuan-cahoc">Ca học</th>
            {/* Thêm các thứ trong tuần vào đây */}
          </tr>
        </thead>
        <tbody
          className="bg-"
          style={{
            backgroundImage:
              "url('https://sinhvien.hufi.edu.vn/Content/ThemeMXH/img/icons/transparent-pattern-square-4.png')",
          }}
        >
          {rowsData.map((date, index) => (
            <tr key={index}>
              <td
                role="cell"
                lang="lichtheotuan"
                style={{
                  background:
                    date.toDateString() === currentDate.toDateString()
                      ? "#ffffce"
                      : "",
                }}
              >
                <b>{`Thứ ${date.getDay()}`}</b>
              </td>
              {/* Các cột khác tương ứng với rowData */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { TableSchema };
