// exportPDF.tsx
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const exportComponentToPDF = async (componentRef: React.RefObject<HTMLElement>) => {
  if (componentRef.current) {
    const canvas = await html2canvas(componentRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
    });

    // Kích thước của trang PDF và hình ảnh
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save('download.pdf');
  } else {
    console.error('Component ref is not assigned');
  }
};

export default exportComponentToPDF;
