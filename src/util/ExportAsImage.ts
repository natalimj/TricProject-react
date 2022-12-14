import html2canvas from "html2canvas";

/**
 * Using html2canvas to take a screenshot of a specific element
 * and then downloading the screenshot as a .png image locally to the filesystem.
 *
 * @ author Natali Munk-Jakobsen 
 */
const ExportAsImage = async (element: any, imageFileName: string) => {
    const canvas = await html2canvas(element);
    const image = canvas.toDataURL("image/png", 1.0);
    downloadImage(image, imageFileName);
};


const downloadImage = (blob: any, fileName: string) => {
    const link = window.document.createElement("a");
    link.download = fileName;
    link.href = blob;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    link.remove();
};

export default ExportAsImage;

