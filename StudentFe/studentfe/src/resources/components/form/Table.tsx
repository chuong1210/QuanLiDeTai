import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TableProps } from "@/assets/types/form";
import { classNames } from "primereact/utils";
import { StyleClass } from "primereact/StyleClass";

const TableSchema = ({ data }: any) =>
  // { value, showGridlines }: TableProps
  {
    const [products, setProducts] = useState([]);

    const headerRowClass = {
      background: "#f3f7f9",
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

    interface TableData {
      day: string;
      dayOfWeek: string;
      shift?: string;
      course?: string;
      code?: string;
      session?: string;
      room?: string;
      teacher?: string;
    }
    interface headerTable {
      day: string;
      dayOfWeek: string;
    }
    const headerTable: headerTable[] = [
      {
        day: "04/03/2024",
        dayOfWeek: "Thứ 2",
      },
      {
        day: "05/03/2024",
        dayOfWeek: "Thứ 3",
      },
      {
        day: "06/03/2024",
        dayOfWeek: "Thứ 4",
      },
      {
        day: "07/03/2024",
        dayOfWeek: "Thứ 5",
      },
      {
        day: "08/03/2024",
        dayOfWeek: "Thứ 6",
      },
      {
        day: "09/03/2024",
        dayOfWeek: "Thứ 7",
      },
      {
        day: "10/03/2024",
        dayOfWeek: "Chủ nhật",
      },
    ];

    const rowsData: TableData[] = [
      {
        day: "04/03/2024",
        dayOfWeek: "Thứ 2",
        shift: "Sáng",
        course: "Lập trình hướng đối tượng",
        code: "13DHTH03 - 010110196203",
        session: "4 - 6",
        room: "A402 - 140 Lê Trọng Tấn",
        teacher: "Bùi Công Danh",
      },
      {
        day: "04/03/2024",
        dayOfWeek: "Thứ 3",
        shift: "Chiều",
        course: "Lập trình hướng đối tượng",
        code: "13DHTH03 - 010110196203",
        session: "4 - 6",
        room: "A402 - 140 Lê Trọng Tấn",
        teacher: "Bùi Công Danh",
      },
      {
        day: "04/03/2024",
        dayOfWeek: "Thứ 4",
        shift: "Tối",
        course: "Lập trình hướng đối tượng",
        code: "13DHTH03 - 010110196203",
        session: "4 - 6",
        room: "A402 - 140 Lê Trọng Tấn",
        teacher: "Bùi Công Danh",
      },
      {
        day: "04/03/2024",
        dayOfWeek: "Thứ 5",
        shift: "Sáng",
        course: "Lập trình hướng đối tượng",
        code: "13DHTH03 - 010110196203",
        session: "4 - 6",
        room: "A402 - 140 Lê Trọng Tấn",
        teacher: "Bùi Công Danh",
      },
      {
        day: "04/03/2024",
        dayOfWeek: "Thứ 6",
        shift: "Sáng",
        course: "Lập trình hướng đối tượng",
        code: "13DHTH03 - 010110196203",
        session: "4 - 6",
        room: "A402 - 140 Lê Trọng Tấn",
        teacher: "Bùi Công Danh",
      },
      {
        day: "04/03/2024",
        dayOfWeek: "Thứ 7",
        shift: "Chiều",
        course: "Lập trình hướng đối tượng",
        code: "13DHTH03 - 010110196203",
        session: "4 - 6",
        room: "A402 - 140 Lê Trọng Tấn",
        teacher: "Bùi Công Danh",
      },
      {
        day: "04/03/2024",
        dayOfWeek: "Chủ nhật",
        shift: "Chiều",
        course: "Lập trình hướng đối tượng",
        code: "13DHTH03 - 010110196203",
        session: "4 - 6",
        room: "A402 - 140 Lê Trọng Tấn",
        teacher: "Bùi Công Danh",
      },
      // ... (Thêm dữ liệu cho các dòng khác)
    ];
    const shiftArray: any = ["Sáng", "Chiều", "Tối"];

    return (
      // <div className="table-responsive overflow-x-auto">
      //   <table
      //     className="fl-table table table-bordered text-center no-footer dtr-inline w-full center mb-8 max-w-full"
      //     role="grid"
      //   >
      //     <thead
      //       className="bg-[#f3f7f9] "
      //       style={{
      //         background: "#f3f7f9",
      //         borderBottom: "2px solid #cad6d8",
      //         color: " #1da1f2",
      //         whiteSpace: "nowrap",
      //       }}
      //     >
      //       <tr role="row" className="max-h-0">
      //         <th lang="lichtheotuan-cahoc">Ca học</th>
      //         <th>
      //           <span lang="lichtheotuan-mon">Thứ 2</span>
      //           <br />
      //           04/03/2024
      //         </th>
      //         <th>
      //           <span lang="lichtheotuan-tue">Thứ 3</span>
      //           <br />
      //           05/03/2024
      //         </th>
      //         <th>
      //           <span lang="lichtheotuan-wed">Thứ 4</span>
      //           <br />
      //           06/03/2024
      //         </th>
      //         <th>
      //           <span lang="lichtheotuan-thu">Thứ 5</span>
      //           <br />
      //           07/03/2024
      //         </th>
      //         <th>
      //           <span lang="lichtheotuan-fri">Thứ 6</span>
      //           <br />
      //           08/03/2024
      //         </th>
      //         <th>
      //           <span lang="lichtheotuan-sat">Thứ 7</span>
      //           <br />
      //           09/03/2024
      //         </th>
      //         <th>
      //           <span lang="lichtheotuan-sun">Chủ nhật</span>
      //           <br />
      //           10/03/2024
      //         </th>
      //       </tr>
      //     </thead>
      //     <tbody
      //       className="bg-"
      //       style={{
      //         backgroundImage:
      //           "url('https://sinhvien.hufi.edu.vn/Content/ThemeMXH/img/icons/transparent-pattern-square-4.png')",
      //       }}
      //     >
      //       <tr role="row">
      //         <td
      //           role="cell"
      //           lang="lichtheotuan"
      //           style={{ background: "#ffffce" }}
      //         >
      //           <b>Sáng</b>
      //         </td>
      //         <td>
      //           <div
      //             className="content color-lichhoc text-left  align-items-left"
      //             data-bg="996650"
      //           >
      //             <b>
      //               <a
      //                 href="/sinh-vien/page-lhp.html?g=dTcVgEv7UiaNkXTyJKTL3e9stcqHs8cMQKkv-_hZvuEtN1eoGjefs2iPuZt0cbyk4ZxZsvvLvnjjlNYjkiCIcqc8S0ktOFbDTU4MQBl94IXaz68zlFDMsHaMTqOM8ox6"
      //                 target="_blank"
      //                 className="text-decoration:none;color: #003763;"
      //                 data-toggle="tooltip"
      //                 data-placement="auto"
      //                 title=""
      //                 data-original-title=""
      //               >
      //                 Lập trình hướng đối tượng
      //               </a>
      //             </b>

      //             <p>13DHTH03 - 010110196203</p>

      //             <p>
      //               <span lang="lichtheotuan-tiet">Tiết</span>: 4 - 6
      //             </p>

      //             <p>
      //               <span lang="giang-duong">Phòng</span>: A402 - 140 Lê Trọng
      //               Tấn{" "}
      //             </p>

      //             <p>
      //               <span lang="lichtheotuan-gv">GV</span>: Bùi Công Danh
      //             </p>
      //           </div>
      //         </td>
      //       </tr>
      //       <tr role="row">
      //         <td lang="lichtheotuan">
      //           <b>Chiều</b>
      //         </td>
      //         <td></td>
      //         <td>
      //           <div className="content color-lichhoc text-left  align-items-left">
      //             <b>
      //               <a
      //                 href="/sinh-vien/page-lhp.html?g=ikLiDpZjrERfoOs54GONF1nBL28EFyGCdQhp5qlf88vUaoKiQphM481kRk790VMSaydpwHAvPHbZDGkKf9nrIjTgE22naWPMZhMKSSDCnInT40OUEgvAAL-efuu0aqrY"
      //                 target="_blank"
      //                 data-toggle="tooltip"
      //                 data-placement="auto"
      //                 title=""
      //                 className="text-decoration:none;color: #003763;"
      //                 data-original-title=""
      //               >
      //                 Công nghệ phần mềm
      //               </a>
      //             </b>

      //             <p>13DHBM03 - 010110196303</p>

      //             <p>
      //               <span lang="lichtheotuan-tiet">Tiết</span>: 7 - 9
      //             </p>

      //             <p>
      //               <span lang="giang-duong">Phòng</span>: A403 - 140 Lê Trọng
      //               Tấn
      //             </p>

      //             <p>
      //               <span lang="lichtheotuan-gv">GV</span>: Ngô Minh Anh Thư
      //             </p>
      //           </div>
      //         </td>
      //       </tr>
      //       <tr role="row">
      //         <td lang="lichtheotuan">
      //           <b>Tối</b>
      //         </td>
      //         <td></td>
      //         <td></td>
      //         <td></td>
      //         <td></td>
      //         <td></td>
      //         <td></td>
      //         <td></td>
      //       </tr>
      //     </tbody>
      //   </table>
      // </div>

      <div className="table-responsive  " style={{ overflowX: "hidden" }}>
        <DataTable
          showGridlines
          value={shiftArray}
          className=" overflow-hidden fl-table table table-bordered text-center no-footer dtr-inline w-full center mb-8 max-w-full "
          tableStyle={{ maxWidth: "5rem", overflow: "hidden" }}
          role="grid"
        >
          <Column
            field="shift"
            header="Ca học"
            style={headerFirstRowClass}
            body={(sh) => <div>{sh}</div>}
          />
          {rowsData.map((date, index) => (
            <Column
              key={index}
              field={`day${index + 1}`}
              header={
                <>
                  <span>{date.dayOfWeek}</span>
                  <br />
                  <span>{date.day}</span>
                </>
              }
              body={() => (
                <div style={headerRowClass}>
                  <span>{date.dayOfWeek}</span>
                  <br />
                  <h1>{date.teacher}</h1>
                  <span>{date.day}</span>
                </div>
              )}
              style={headerRowClass}
            />
          ))}
        </DataTable>
      </div>
    );
  };

export { TableSchema };
