"use-client";
import { API } from "@/assets/config";
import { FileUpload } from "primereact/fileupload";
import * as XLSX from "xlsx";

const downloadExcel = (data: any) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
  XLSX.writeFile(workbook, "DataSheet.xlsx");
};
const File = () => {
  return (
    <div>
      <FileUpload
        name="upload"
        // url={"/api/upload"}
        url={API.file.upload}
        multiple
        // accept="image/*"
        accept=".xlsx*"
        maxFileSize={10000000}
        emptyTemplate={<p className="m-0">Kéo thả File tại đây.</p>}
      />
      <button onClick={downloadExcel}>Download As Excel</button>
    </div>
  );
};

export default File;
