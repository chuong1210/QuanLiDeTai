// import React, {
//   LegacyRef,
//   forwardRef,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import { ScheduleType } from "@/assets/interface";
// import { Button } from "primereact/button";
// import { jsPDF } from "jspdf";
// import "jspdf-autotable";

// const convertDayOfWeek = (day: string) => {
//   const conversion: any = {
//     Monday: "Mon",
//     Tuesday: "Tue",
//     Wednesday: "Wed",
//     Thursday: "Thu",
//     Friday: "Fri",
//     Saturday: "Sat",
//     Sunday: "Sun",
//   };
//   return conversion[day];
// };

// const daysOfWeek: daysofWeekType[] = [
//   { name: "Mon", dayIndex: 1, displayName: "Thứ 2" },
//   { name: "Tue", dayIndex: 2, displayName: "Thứ 3" },
//   { name: "Wed", dayIndex: 3, displayName: "Thứ 4" },
//   { name: "Thu", dayIndex: 4, displayName: "Thứ 5" },
//   { name: "Fri", dayIndex: 5, displayName: "Thứ 6" },
//   { name: "Sat", dayIndex: 6, displayName: "Thứ 7" },
//   { name: "Sun", dayIndex: 7, displayName: "Chủ nhật" },
// ];

// interface daysofWeekType {
//   name: string;
//   dayIndex: number;
//   displayName: string;
// }
// interface TableData {
//   day: string;
//   dayOfWeek: string;
//   shift: string;
//   course: string;
//   code?: string;
//   session?: string;
//   room: string;
//   teacher?: string;
// }

// interface ISchedule {
//   Morning: {
//     period: string;
//     time: string;
//     [key: string]: string;
//   };
//   Afternoon: {
//     period: string;
//     time: string;
//     [key: string]: string;
//   };
//   Evening: {
//     period: string;
//     time: string;
//     [key: string]: string;
//   };
// }

// //...
// // Trong hàm ScheduleTable

// const ScheduleTable = forwardRef((props, ref) => {
//   const [firstDayOfWeek, setFirstDayOfWeek] = useState<Date>(new Date());

//   const scheduleDataTemplate: ISchedule = {
//     Morning: { period: "Buổi", time: "Sáng" },
//     Afternoon: { period: "Buổi", time: "Chiều" },
//     Evening: { period: "Buổi", time: "Tối" },
//   };
//   const rowsData: TableData[] = useMemo(
//     () => [
//       {
//         day: "04/03/2024",
//         dayOfWeek: "Monday",
//         shift: "Afternoon",
//         course: "Lập trình hướng đối tượng",
//         code: "13DHTH03 - 010110196203",
//         session: "4 - 6",
//         room: "A402 - 140 Lê Trọng Tấn",
//         teacher: "Bùi Công Danh",
//       },
//       {
//         day: "20/03/2024",
//         dayOfWeek: "Saturday",
//         shift: "Afternoon",
//         course: "Lập trình hướng đối tượng",
//         code: "13DHTH03 - 010110196203",
//         session: "4 - 6",
//         room: "A402 - 140 Lê Trọng Tấn",
//         teacher: "Bùi Công Danh",
//       },
//       {
//         day: "24/04/2024",
//         dayOfWeek: "Thursday",
//         shift: "Afternoon",
//         course: "Tiếng anh 2",
//         code: "13DHTH03 - 010110196203",
//         session: "4 - 6",
//         room: "A102 - 140 Lê Trọng Tấn",
//         teacher: "Ngọc Hiền",
//       },
//     ],
//     []
//   ); // Empty dependency array indicates this useMemo has no dependencies and should only run once on initial render.

//   const ColumnScedule = {
//     background:
//       "url(https://sinhvien.hufi.edu.vn/Content/ThemeMXH/img/icons/transparent-pattern-square-4.png)",
//   };
//   const headerFirstColumnClass = {
//     background: "#ffffce",
//     borderBottom: "2px solid #cad6d8",
//     color: " #667580 ",
//     marginL: "20px",
//     border: "1px solid #ddd",
//     width: "20px",
//     maxWidth: "20px",
//     fontWeight: "700",
//     fontFamily: "Tahoma !important",
//   };

//   const headerRowClass = {
//     borderBottom: "2px solid #cad6d8",
//     color: "#1da1f2",
//     whiteSpace: "nowrap",
//     background: "#rgb(102, 117, 128)",
//     left: "20px",
//   };

//   const scheduleData: ISchedule = rowsData.reduce(
//     (acc: ISchedule, item: TableData) => {
//       const { shift, dayOfWeek, course, teacher, room } = item;
//       acc[shift as keyof ISchedule][
//         convertDayOfWeek(dayOfWeek)
//       ] = `${course}\n ${teacher}\n ${room}`;
//       return acc;
//     },
//     JSON.parse(JSON.stringify(scheduleDataTemplate)) // Sử dụng bản sao sâu để không làm thay đổi template ban đầu
//   );
//   const formattedData = Object.values(scheduleData);
//   const parseData = (data: string) => {
//     // Phân tách dữ liệu dựa vào việc xuống dòng của chuỗi.
//     const lines = data.split("\n");

//     // Tên khóa học nằm ở dòng đầu tiên.
//     const course = lines[0].trim();

//     // Biến để lưu thông tin giáo viên và phòng học.
//     let teacherInfo = "";
//     let roomInfo = "";

//     // Kiểm tra xem có dữ liệu cho phòng học và giáo viên hay không.
//     if (lines.length > 2) {
//       teacherInfo = `GV: ${lines[1].trim()}`; // Lấy thông tin giáo viên từ dòng thứ hai và thêm tiền tố "GV:".
//       roomInfo = `R: ${lines[2].trim()}`; // Lấy thông tin phòng học từ dòng thứ ba và thêm tiền tố "R:".
//     }

//     // Trả về đối tượng với các thông tin đã xử lý.
//     return { course, teacher: teacherInfo, room: roomInfo };
//   };

//   const bodyTemplate = (rowData: any, column: any) => {
//     if (rowData[column.field]) {
//       const { course, teacher, room } = parseData(rowData[column.field]);

//       return (
//         <div
//           style={{
//             backgroundColor: "rgba(54, 144, 241, 0.5)",
//             padding: "10px",
//             borderRadius: "7px",
//             color: "#667580",
//             whiteSpace: "pre-line", // Thêm dòng này để chuỗi có các ký tự ngắt dòng được hiển thị chính xác
//             textAlign: "left", // Chuyển từ căn giữa sang căn trái để xuống dòng đúng chỗ
//             overflow: "hidden", // Đảm bảo rằng dữ liệu không vượt ra ngoài khối
//             width: "100%", // Cho phép trải rộng toàn bộ cell nếu cần
//             minHeight: "100%", // Đảm bảo tối thiểu chiều cao để hiển thị đầy đủ dữ liệu
//           }}
//         >
//           <div style={{ color: "black", fontSize: "16px", fontWeight: "600" }}>
//             {course}
//           </div>
//           <div
//             className="m-3"
//             style={{ fontSize: "13px", color: "black", fontWeight: "400" }}
//           >
//             {teacher}
//           </div>
//           <div
//             className="m-3"
//             style={{ fontSize: "13px", color: "black", fontWeight: "400" }}
//           >
//             {room}
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };

//   // Hàm này chuyển đổi ngày từ dạng chuỗi dd/mm/yyyy thành đối tượng Date
//   const parseDate = (dateStr: string) => {
//     const [day, month, year] = dateStr.split("/").map(Number);
//     return new Date(year, month - 1, day);
//   };

//
//

//   const headerTemplate = (header: string) => {
//     return (
//       <div
//         dangerouslySetInnerHTML={{ __html: header }}
//         style={{ textAlign: "center" }}
//       />
//     );
//   };

//   useEffect(() => {
//     const now = new Date();
//     const currentDayOfWeek = now.getDay();
//     const currentDayOfMonth = now.getDate();
//     const firstDayOfWeek = new Date();

//     if (currentDayOfWeek !== 0) {
//       // if it's not Sunday
//       firstDayOfWeek.setDate(currentDayOfMonth - currentDayOfWeek);
//     } else {
//       // if it's Sunday, set it to last Monday
//       firstDayOfWeek.setDate(currentDayOfMonth - 6);
//     }

//     setFirstDayOfWeek(firstDayOfWeek);
//   }, []);
//   const handleNextClick = () => {
//     const newFirstDayOfWeek = new Date(firstDayOfWeek);
//     newFirstDayOfWeek.setDate(firstDayOfWeek.getDate() + 7);
//     setFirstDayOfWeek(newFirstDayOfWeek);
//   };

//   const handlePreviousClick = () => {
//     const newFirstDayOfWeek = new Date(firstDayOfWeek);
//     newFirstDayOfWeek.setDate(firstDayOfWeek.getDate() - 7);
//     setFirstDayOfWeek(newFirstDayOfWeek);
//   };

//   const getDateOfWeek = (dayIndex: number) => {
//     const currentDate = new Date(firstDayOfWeek);
//     currentDate.setDate(firstDayOfWeek.getDate() + dayIndex);

//     const day = currentDate.getDate();
//     const month = currentDate.getMonth() + 1;
//     const year = currentDate.getFullYear();

//     return `${day.toString().padStart(2, "0")}/${month
//       .toString()
//       .padStart(2, "0")}/${year}`;
//   };

//   const [currentWeekSchedule, setCurrentWeekSchedule] = useState<TableData[]>(
//     []
//   );
//   useEffect(() => {
//     // Chuyển ngày từ chuỗi dd/mm/yyyy sang đối tượng Date
//     const parseDate = (dateStr: string) => {
//       const [day, month, year] = dateStr.split("/").map(Number);
//       return new Date(year, month - 1, day);
//     };

//     // Lọc dữ liệu theo tuần hiện tại
//     const updateCurrentWeekSchedule = () => {
//       // Lấy ngày cuối cùng của tuần
//       let endDayOfWeek = new Date(firstDayOfWeek);
//       endDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

//       // Lọc các lớp học phù hợp trong khoảng tuần hiện tại
//       const weekSchedule = rowsData.filter((schedule) => {
//         let scheduleDate = parseDate(schedule.day);
//         return scheduleDate >= firstDayOfWeek && scheduleDate <= endDayOfWeek;
//       });

//       setCurrentWeekSchedule(weekSchedule);
//     };

//     updateCurrentWeekSchedule();
//   }, [firstDayOfWeek, rowsData]);
//   console.log("currentWeekSchedule", currentWeekSchedule);
//   console.log("formatted data", formattedData);
//   return (
//     <div className="mt-3">
//       <div className="p-d-flex p-jc-between">
//         <Button
//           size="small"
//           className="text-center"
//           onClick={handlePreviousClick}
//           label="Previous"
//           outlined
//           icon="pi pi-chevron-left"
//         ></Button>
//         <Button
//           icon="pi pi-chevron-right"
//           size="small"
//           className="ml-2 max-w-6rem w-full p-justify-end pr-2"
//           label="Next"
//           onClick={handleNextClick}
//           raised
//           severity="info"
//           outlined
//         ></Button>
//       </div>
//       <h3>Thời Khóa Biểu</h3>

//       <div ref={ref as LegacyRef<HTMLDivElement>}>
//         <DataTable
//           // value={formattedData}
//           value={formattedData}
//           style={{
//             textAlign: "center",
//             minWidth: "100%",
//           }}
//           showGridlines
//         >
//           <Column
//             field="time"
//             header="Ca học"
//             headerStyle={headerRowClass}
//             bodyStyle={headerFirstColumnClass}
//           />
//           {daysOfWeek.map(
//             ({ name, dayIndex, displayName }: daysofWeekType, index) => (
//               <Column
//                 key={index}
//                 field={name}
//                 header={headerTemplate(
//                   `${displayName}<br/>${getDateOfWeek(dayIndex)}`
//                 )}
//                 headerStyle={headerRowClass}
//                 //    header={`Thứ ${dayIndex + 1} (${getDateOfWeek(dayIndex)})`}
//                 bodyStyle={{
//                   maxWidth: "100px",
//                   minHeight: "100px",
//                   width: "80px",
//                   height: "200px",
//                   whiteSpace: "wrap",
//                   textAlign: "center",
//                 }}
//                 body={bodyTemplate1}
//                 style={ColumnScedule}
//               />
//             )
//           )}
//         </DataTable>
//       </div>
//     </div>
//   );
// });
// ScheduleTable.displayName = "ScheduleTable";

// export { ScheduleTable };
