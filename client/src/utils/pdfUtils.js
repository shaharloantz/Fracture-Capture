import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {toast} from 'react-hot-toast';
export const createPDF = async (selectedUpload, patient, userName, imageLoaded, profileEmail) => {
    if (!imageLoaded) return null;

    const input = document.getElementById('pdf-content');
    
    // Capture the image using html2canvas
    const canvas = await html2canvas(input, {
        useCORS: true,
        scale: 2,
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 150;  // Adjust image width (keeping margins)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;  // Calculate proportional height

    // Adjust position and scaling to prevent clipping
    pdf.addImage(imgData, 'PNG', 25, 5, imgWidth, imgHeight);

    // Adding the details to the PDF
    let yOffset = imgHeight + 20;  // Start below the image
    const xOffsetLabel = 10;
    const xOffsetValue = 50;
    const xOffsetValuePrediction = 51;  // Adjusted xOffset for prediction to align better

    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Prediction Results', xOffsetLabel, yOffset);

    yOffset += 15;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Patient Name:`, xOffsetLabel, yOffset);
    pdf.setFont('helvetica', 'normal');
    pdf.text(` ${patient?.name || 'N/A'}`, xOffsetValue, yOffset);
    yOffset += 10;

    pdf.setFont('helvetica', 'bold');
    pdf.text(`Patient ID:`, xOffsetLabel, yOffset);
    pdf.setFont('helvetica', 'normal');
    pdf.text(` ${patient?.idNumber || selectedUpload.patient?.idNumber || 'N/A'}`, xOffsetValue, yOffset);
    yOffset += 10;

    pdf.setFont('helvetica', 'bold');
    pdf.text(`Gender:`, xOffsetLabel, yOffset);
    pdf.setFont('helvetica', 'normal');
    pdf.text(` ${patient?.gender || selectedUpload.patient?.gender || 'N/A'}`, xOffsetValue, yOffset);
    yOffset += 10;

    pdf.setFont('helvetica', 'bold');
    pdf.text(`Date of Birth:`, xOffsetLabel, yOffset);
    pdf.setFont('helvetica', 'normal');
    pdf.text(` ${new Date(patient?.dateOfBirth).toLocaleDateString() || 'N/A'}`, xOffsetValue, yOffset);
    yOffset += 10;

    pdf.setFont('helvetica', 'bold');
    pdf.text(`Associated doctor:`, xOffsetLabel, yOffset);
    pdf.setFont('helvetica', 'normal');
    pdf.text(` ${userName} (${profileEmail})`, xOffsetValue, yOffset);
    yOffset += 10;

    pdf.setFont('helvetica', 'bold');
    pdf.text(`Body Part:`, xOffsetLabel, yOffset);
    pdf.setFont('helvetica', 'normal');
    pdf.text(` ${selectedUpload.bodyPart}`, xOffsetValue, yOffset);
    yOffset += 10;

    pdf.setFont('helvetica', 'bold');
    pdf.text(`Description:`, xOffsetLabel, yOffset);
    pdf.setFont('helvetica', 'normal');
    pdf.text(` ${selectedUpload.description || 'N/A'}`, xOffsetValue, yOffset);
    yOffset += 10;

    pdf.setFont('helvetica', 'bold');
    pdf.text(`Date Uploaded:`, xOffsetLabel, yOffset);
    pdf.setFont('helvetica', 'normal');
    pdf.text(` ${selectedUpload.dateUploaded ? new Date(selectedUpload.dateUploaded).toLocaleString() : 'Invalid Date'}`, xOffsetValue, yOffset);
    yOffset += 10;

    pdf.setFont('helvetica', 'bold');
    pdf.text(`Prediction:`, xOffsetLabel, yOffset);
    pdf.setFont('helvetica', 'normal');

    const confidenceText = selectedUpload?.prediction?.confidences?.length > 0 
        ? selectedUpload.prediction.confidences.map(conf => `${(conf * 100).toFixed(2)}%`).join(', ')
        : 'No fracture detected';
    pdf.text(confidenceText, xOffsetValuePrediction, yOffset);

    return pdf;
};


export const sendEmail = async (selectedUpload, email, imageLoaded, setIsSending, setShowEmailInput, setEmail, patient, userName) => {
    /*
    console.log('sendEmail - selectedUpload:', selectedUpload);  // Debug log
    console.log('sendEmail - patient:', patient);  // Debug log
    console.log('sendEmail - userName:', userName);  // Debug log
*/
    if (!imageLoaded) return;

    setIsSending(true);

    const pdf = await createPDF(selectedUpload, patient, userName, imageLoaded);
    if (pdf) {
        const pdfBlob = pdf.output('blob');
        const formData = new FormData();
        formData.append('pdf', pdfBlob, `upload_details_${selectedUpload.patientName || 'unknown'}.pdf`);
        formData.append('patientName', selectedUpload.patientName || 'unknown');
        formData.append('email', email);

        /*
        console.log('Sending email with the following data:', {
            patientName: selectedUpload.patientName || 'unknown',
            email: email,
        });
        */
        fetch('http://localhost:8000/uploads/send-email', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                toast.success('Email sent successfully');
                setShowEmailInput(false);
                setEmail('');
            })
            .catch((error) => {
                console.error('Error:', error);
                toast.error('Error sending email');
            })
            .finally(() => {
                setIsSending(false);
            });
    }
};
