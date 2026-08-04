import os
from datetime import datetime
from typing import Optional
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm, mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

from ai.config import REPORTS_DIR


class PDFReportGenerator:
    """Generator for medical diagnosis PDF reports."""
    
    def __init__(self):
        os.makedirs(REPORTS_DIR, exist_ok=True)
    
    def generate_report(
        self,
        patient_info: dict,
        diagnosis_info: dict,
        doctor_info: dict,
        image_path: Optional[str] = None,
        output_filename: Optional[str] = None,
    ) -> str:
        """
        Generate a PDF report for a diagnosis.
        
        Args:
            patient_info: Patient information dict
            diagnosis_info: Diagnosis information dict
            doctor_info: Doctor information dict
            image_path: Optional path to the medical image
            output_filename: Optional custom filename
        
        Returns:
            Path to the generated PDF file
        """
        if output_filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            patient_id = patient_info.get('id', 'unknown')
            output_filename = f"report_{patient_id}_{timestamp}.pdf"
        
        output_path = os.path.join(REPORTS_DIR, output_filename)
        
        doc = SimpleDocTemplate(
            output_path,
            pagesize=A4,
            rightMargin=2*cm,
            leftMargin=2*cm,
            topMargin=2*cm,
            bottomMargin=2*cm,
        )
        
        styles = getSampleStyleSheet()
        
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=20,
            alignment=TA_CENTER,
            spaceAfter=20,
            textColor=colors.HexColor('#1a5276'),
        )
        
        subtitle_style = ParagraphStyle(
            'CustomSubtitle',
            parent=styles['Heading2'],
            fontSize=14,
            alignment=TA_CENTER,
            spaceAfter=15,
            textColor=colors.HexColor('#2c3e50'),
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=12,
            spaceBefore=15,
            spaceAfter=8,
            textColor=colors.HexColor('#1a5276'),
        )
        
        normal_style = ParagraphStyle(
            'CustomNormal',
            parent=styles['Normal'],
            fontSize=10,
            spaceAfter=6,
        )
        
        elements = []
        
        elements.append(Paragraph("EliaOcular - Sistema de Diagnóstico Ocular", title_style))
        elements.append(Paragraph("Reporte de Diagnóstico Médico", subtitle_style))
        elements.append(Spacer(1, 10))
        
        elements.append(Paragraph("Información del Paciente", heading_style))
        
        patient_data = [
            ['Nombre Completo', patient_info.get('full_name', 'N/A')],
            ['Número de Documento', patient_info.get('document_number', 'N/A')],
            ['Fecha de Nacimiento', str(patient_info.get('date_of_birth', 'N/A'))],
            ['Género', patient_info.get('gender', 'N/A')],
            ['Teléfono', patient_info.get('phone', 'N/A')],
            ['Dirección', patient_info.get('address', 'N/A')],
        ]
        
        patient_table = Table(patient_data, colWidths=[5*cm, 10*cm])
        patient_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#d5e8d4')),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#1a5276')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ]))
        elements.append(patient_table)
        elements.append(Spacer(1, 15))
        
        elements.append(Paragraph("Resultados del Diagnóstico", heading_style))
        
        disease = diagnosis_info.get('disease', 'N/A')
        probability = diagnosis_info.get('probability', 0)
        level = diagnosis_info.get('level', 'N/A')
        confidence = diagnosis_info.get('confidence', 'N/A')
        
        diagnosis_data = [
            ['Enfermedad Detectada', disease],
            ['Probabilidad', f"{probability * 100:.1f}%"],
            ['Nivel', level],
            ['Confianza', confidence],
            ['Fecha de Diagnóstico', str(diagnosis_info.get('diagnosed_at', 'N/A'))],
        ]
        
        diagnosis_table = Table(diagnosis_data, colWidths=[5*cm, 10*cm])
        
        if level == 'Alto':
            bg_color = colors.HexColor('#f8d7da')
        elif level == 'Moderado':
            bg_color = colors.HexColor('#fff3cd')
        else:
            bg_color = colors.HexColor('#d4edda')
        
        diagnosis_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#d5e8d4')),
            ('BACKGROUND', (1, 0), (1, 0), bg_color),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#1a5276')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ]))
        elements.append(diagnosis_table)
        elements.append(Spacer(1, 15))
        
        if image_path and os.path.exists(image_path):
            elements.append(Paragraph("Imagen Médica", heading_style))
            try:
                img = Image(image_path, width=12*cm, height=8*cm)
                img.hAlign = 'CENTER'
                elements.append(img)
                elements.append(Spacer(1, 15))
            except Exception as e:
                elements.append(Paragraph(f"Error al cargar la imagen: {str(e)}", normal_style))
        
        recommendations = diagnosis_info.get('recommendations', '')
        if recommendations:
            elements.append(Paragraph("Recomendaciones", heading_style))
            elements.append(Paragraph(recommendations, normal_style))
            elements.append(Spacer(1, 15))
        
        elements.append(Paragraph("Información del Doctor", heading_style))
        
        doctor_data = [
            ['Nombre', doctor_info.get('full_name', 'N/A')],
            ['Especialidad', doctor_info.get('specialty', 'N/A')],
            ['Licencia', doctor_info.get('license_number', 'N/A')],
            ['Hospital', doctor_info.get('hospital', 'N/A')],
        ]
        
        doctor_table = Table(doctor_data, colWidths=[5*cm, 10*cm])
        doctor_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#d5e8d4')),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#1a5276')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ]))
        elements.append(doctor_table)
        elements.append(Spacer(1, 20))
        
        elements.append(Paragraph("Firma del Doctor", heading_style))
        elements.append(Spacer(1, 1*cm))
        elements.append(Paragraph("_" * 50, normal_style))
        elements.append(Paragraph(f"{doctor_info.get('full_name', 'N/A')}", normal_style))
        elements.append(Paragraph(f"Licencia: {doctor_info.get('license_number', 'N/A')}", normal_style))
        elements.append(Spacer(1, 15))
        
        elements.append(Paragraph("Este reporte fue generado automáticamente por el sistema EliaOcular.", normal_style))
        elements.append(Paragraph(f"Fecha de generación: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}", normal_style))
        
        doc.build(elements)
        
        return output_path


pdf_generator = PDFReportGenerator()