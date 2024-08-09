import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const createPDF = async (selectedUpload, patient, userName, imageLoaded) => {
    if (!imageLoaded) return null;

    const input = document.getElementById('pdf-content');
    const canvas = await html2canvas(input, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 10, -20, 190, 160);

    // Add the headline
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Prediction Results', 10, 175);

    const yOffset = 190;
    const xOffsetLabel = 10;
    const xOffsetValue = 50;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Patient Name:`, xOffsetLabel, yOffset);
    pdf.setFont('helvetica', 'normal');
    pdf.text(` ${selectedUpload.patientName || 'N/A'}`, xOffsetValue, yOffset);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Patient ID:`, xOffsetLabel, yOffset + 10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(` ${patient?.idNumber || selectedUpload.patient?.idNumber || 'N/A'}`, xOffsetValue, yOffset + 10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Gender:`, xOffsetLabel, yOffset + 20);
    pdf.setFont('helvetica', 'normal');
    pdf.text(` ${patient?.gender || selectedUpload.patient?.gender || 'N/A'}`, xOffsetValue, yOffset + 20);

    pdf.setFont('helvetica', 'bold');
    pdf.text(`Date of Birth:`, xOffsetLabel, yOffset + 30);
    pdf.setFont('helvetica', 'normal');
    pdf.text(` ${new Date(patient?.dateOfBirth).toLocaleString().substring(0,9)  || 'N/A'}`, xOffsetValue, yOffset + 30);

    pdf.setFont('helvetica', 'bold');
    pdf.text(`Associated doctor:`, xOffsetLabel, yOffset + 40);
    pdf.setFont('helvetica', 'normal');
    pdf.text(` ${userName}`, xOffsetValue, yOffset + 40);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Body Part:`, xOffsetLabel, yOffset + 50);
    pdf.setFont('helvetica', 'normal');
    pdf.text(` ${selectedUpload ? selectedUpload.bodyPart : 'N/A'}`, xOffsetValue, yOffset + 50);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Description:`, xOffsetLabel, yOffset + 60);
    pdf.setFont('helvetica', 'normal');
    pdf.text(` ${selectedUpload ? selectedUpload.description : 'N/A'}`, xOffsetValue, yOffset + 60);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Date Uploaded:`, xOffsetLabel, yOffset + 70);
    pdf.setFont('helvetica', 'normal');
    pdf.text(` ${selectedUpload ? new Date(selectedUpload.dateUploaded).toLocaleString() : 'N/A'}`, xOffsetValue, yOffset + 70);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Prediction:`, xOffsetLabel, yOffset + 80);
    pdf.setFont('helvetica', 'normal');

    const confidenceText = selectedUpload && selectedUpload.prediction.confidences.length > 0 
        ? selectedUpload.prediction.confidences.map(conf => `${(conf * 100).toFixed(2)}%`).join(', ')
        : 'No fracture detected';
    pdf.text(confidenceText, xOffsetValue, yOffset + 80);

    return pdf;
};

export const sendEmail = async (selectedUpload, email, imageLoaded, setIsSending, setShowEmailInput, setEmail, patient, userName) => {
    if (!imageLoaded) return;

    setIsSending(true);

    const pdf = await createPDF(selectedUpload, patient, userName, imageLoaded);
    if (pdf) {
        const pdfBlob = pdf.output('blob');
        const formData = new FormData();
        formData.append('pdf', pdfBlob, `upload_details_${selectedUpload.patientName || 'unknown'}.pdf`);
        formData.append('patientName', selectedUpload.patientName || 'unknown');
        formData.append('email', email);

        console.log('Sending email with the following data:', {
            patientName: selectedUpload.patientName || 'unknown',
            email: email,
        });

        fetch('http://localhost:8000/uploads/send-email', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                alert('Email sent successfully');
                setShowEmailInput(false);
                setEmail('');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Error sending email');
            })
            .finally(() => {
                setIsSending(false);
            });
    }
};