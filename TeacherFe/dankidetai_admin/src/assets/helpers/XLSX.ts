import * as XLSXMain from "xlsx"

const XLSX = {

    handleImportFile: (e: React.ChangeEvent<HTMLInputElement>, callback: (data: any) => void) => {
        const reader = new FileReader();
        if (e.target.files) {
            reader.readAsBinaryString(e.target.files[0]);
            reader.onload = (e) => {
                const data = e.target?.result;
                const workbook = XLSXMain.read(data, { type: "binary" })
                const sheetNames = workbook.SheetNames[0]
                const sheet = workbook.Sheets[sheetNames]
                const parsedData = XLSXMain.utils.sheet_to_json(sheet);
                callback(parsedData); // Gọi callback và truyền dữ liệu parsedData cho nó
            }
        }
    },
    handleExportFile: (data: any[], fileName: string) => {
        const wb = XLSXMain.utils.book_new()
        const ws = XLSXMain.utils.json_to_sheet(data)
        XLSXMain.utils.book_append_sheet(wb, ws, "Sheet1")
        XLSXMain.writeFile(wb, `${fileName}.xlsx`)
    }
}
export default XLSX