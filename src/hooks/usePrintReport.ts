/**
 * Хук для генерации PDF из данных отчёта
 */

import { useCallback, useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export interface ReportTableRow {
  label: string
  values: string[]
}

export interface ReportData {
  title: string
  subtitle?: string
  date: string
  params: Record<string, string>
  results: Record<string, string>
  chartImage?: string
  tableData?: ReportTableRow[]
  tableHeaders?: string[]
}

// === CERTIFICATE ===
export interface CertificateData {
  studentName: string
  courseTitle: string
  courseAuthor: string
  completedAt: string
  duration?: string // Например "24 урока / 12 часов"
  grade?: string // Оценка, например "Отлично"
}

/**
 * Генерирует уникальный номер сертификата
 */
function generateCertificateNumber(): string {
  const prefix = 'ECO'
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
  return `${prefix}-${year}-${random}`
}

/**
 * Создаёт HTML-контент для сертификата (альбомная ориентация)
 */
function createCertificateHTML(data: CertificateData): string {
  const certNumber = generateCertificateNumber()
  const formattedDate = new Date(data.completedAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Georgia', 'Times New Roman', serif;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .certificate {
          width: 1123px; /* A4 landscape at 96 DPI */
          height: 794px;
          background: linear-gradient(145deg, #fffef8 0%, #fffef0 100%);
          border: 3px solid #c9a227;
          border-radius: 8px;
          padding: 50px 60px;
          position: relative;
          box-shadow: 
            0 0 0 1px #e8d5b0,
            0 0 0 3px #c9a227,
            0 20px 60px rgba(0,0,0,0.4);
        }
        
        /* Corner decorations */
        .certificate::before,
        .certificate::after {
          content: '';
          position: absolute;
          width: 80px;
          height: 80px;
          border: 2px solid #c9a227;
        }
        .certificate::before {
          top: 20px;
          left: 20px;
          border-right: none;
          border-bottom: none;
        }
        .certificate::after {
          bottom: 20px;
          right: 20px;
          border-left: none;
          border-top: none;
        }
        
        .corner-bl,
        .corner-br {
          position: absolute;
          width: 80px;
          height: 80px;
          border: 2px solid #c9a227;
        }
        .corner-bl {
          bottom: 20px;
          left: 20px;
          border-right: none;
          border-top: none;
        }
        .corner-br {
          top: 20px;
          right: 20px;
          border-left: none;
          border-bottom: none;
        }
        
        .content {
          text-align: center; 
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .logo {
          font-family: 'Arial', sans-serif;
          font-size: 14px;
          font-weight: bold;
          color: #264653;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        
        .title {
          font-size: 48px;
          font-weight: 400;
          color: #1a1a2e;
          margin-bottom: 8px;
          letter-spacing: 2px;
        }
        
        .subtitle {
          font-size: 18px;
          color: #666;
          font-style: italic;
          margin-bottom: 40px;
        }
        
        .course-label {
          font-size: 14px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 3px;
          margin-bottom: 10px;
        }
        
        .course-title {
          font-size: 36px;
          font-weight: 600;
          color: #2A9D8F;
          margin-bottom: 40px;
          line-height: 1.3;
        }
        
        .student-section {
          margin-bottom: 40px;
        }
        
        .student-label {
          font-size: 14px;
          color: #888;
          margin-bottom: 8px;
        }
        
        .student-name {
          font-size: 42px;
          font-weight: 600;
          color: #1a1a2e;
          border-bottom: 2px solid #c9a227;
          padding-bottom: 10px;
          display: inline-block;
          min-width: 400px;
        }
        
        .info-section {
          display: flex;
          justify-content: center;
          gap: 60px;
          margin-bottom: 30px;
        }
        
        .info-item {
          text-align: center;
        }
        
        .info-label {
          font-size: 11px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }
        
        .info-value {
          font-size: 16px;
          color: #333;
          font-weight: 500;
        }
        
        .cert-number {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #999; 
          margin-top: 30px;
        }
        
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: auto;
          padding-top: 30px;
          border-top: 1px solid #e0e0e0;
        }
        
        .signature {
          text-align: center;
        }
        
        .signature-line {
          width: 200px;
          border-top: 1px solid #333;
          margin-bottom: 8px;
        }
        
        .signature-label {
          font-size: 12px;
          color: #666;
        }
        
        .signature-name {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a2e;
        }
        
        .seal {
          width: 100px;
          height: 100px;
          border: 3px solid #c9a227;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c9a227;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          opacity: 0.8;
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="corner-bl"></div>
        <div class="corner-br"></div>
        
        <div class="content">
          <div>
            <div class="logo">Экономикус</div>
            <h1 class="title">Сертификат</h1>
            <p class="subtitle">о прохождении курса</p>
            
            <p class="course-label">Курс</p>
            <h2 class="course-title">${data.courseTitle}</h2>
            
            <div class="student-section">
              <p class="student-label">Настоящий сертификат подтверждает, что</p>
              <p class="student-name">${data.studentName}</p>
            </div>
          </div>
          
          <div>
            <div class="info-section">
              <div class="info-item">
                <p class="info-label">Дата завершения</p>
                <p class="info-value">${formattedDate}</p>
              </div>
              ${data.duration ? `
              <div class="info-item">
                <p class="info-label">Длительность</p>
                <p class="info-value">${data.duration}</p>
              </div>
              ` : ''}
              ${data.grade ? `
              <div class="info-item">
                <p class="info-label">Оценка</p>
                <p class="info-value">${data.grade}</p>
              </div>
              ` : ''}
            </div>
            
            <p class="cert-number">№ сертификата: ${certNumber}</p>
            
            <div class="footer">
              <div class="signature">
                <div class="signature-line"></div>
                <p class="signature-label">Автор курса</p>
                <p class="signature-name">${data.courseAuthor}</p>
              </div>
              
              <div class="seal">
                Экономикус<br/>Сертификат
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

interface UsePrintReportReturn {
  generatePDF: (data: ReportData, filename: string) => Promise<void>
  generateCertificate: (data: CertificateData, filename?: string) => Promise<void>
  printElement: (elementId: string, filename: string) => Promise<void>
  isGenerating: boolean
}

/**
 * Создаёт HTML-контент для PDF
 */
function createReportHTML(data: ReportData): string {
  const tableRows = data.tableData?.map(row => `
    <tr>
      <td>${row.label}</td>
      ${row.values.map(v => `<td>${v}</td>`).join('')}
    </tr>
  `).join('') || ''

  const tableHeaders = data.tableHeaders?.map(h => `<th>${h}</th>`).join('') || ''

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
          padding: 40px;
          color: #1a1a1a;
          background: #fff;
        }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { font-size: 24px; color: #264653; margin-bottom: 8px; }
        .header .subtitle { font-size: 14px; color: #666; }
        .header .date { font-size: 11px; color: #999; margin-top: 8px; }
        
        .section { margin-bottom: 25px; }
        .section-title { 
          font-size: 14px; 
          font-weight: 600; 
          color: #264653; 
          border-bottom: 2px solid #2A9D8F;
          padding-bottom: 6px;
          margin-bottom: 12px;
        }
        
        .params-grid, .results-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 20px;
        }
        .param-item, .result-item {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid #eee;
        }
        .param-label, .result-label { color: #666; font-size: 12px; }
        .param-value, .result-value { 
          font-weight: 600; 
          font-size: 12px;
          text-align: right;
        }
        .result-value { color: #264653; }
        
        table { 
          width: 100%; 
          border-collapse: collapse; 
          font-size: 10px;
          margin-top: 10px;
        }
        th { 
          background: #264653; 
          color: white; 
          padding: 8px 6px;
          text-align: left;
          font-weight: 500;
        }
        td { 
          padding: 6px; 
          border-bottom: 1px solid #eee;
        }
        tr:nth-child(even) { background: #f9f9f9; }
        
        .footer { 
          text-align: center; 
          color: #999; 
          font-size: 10px; 
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${data.title}</h1>
        ${data.subtitle ? `<div class="subtitle">${data.subtitle}</div>` : ''}
        <div class="date">Дата формирования: ${data.date}</div>
      </div>
      
      <div class="section">
        <div class="section-title">Параметры расчёта</div>
        <div class="params-grid">
          ${Object.entries(data.params).map(([key, value]) => `
            <div class="param-item">
              <span class="param-label">${key}</span>
              <span class="param-value">${value}</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Результаты</div>
        <div class="results-grid">
          ${Object.entries(data.results).map(([key, value]) => `
            <div class="result-item">
              <span class="result-label">${key}</span>
              <span class="result-value">${value}</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      ${data.tableData && data.tableData.length > 0 ? `
      <div class="section">
        <div class="section-title">Детализация платежей</div>
        <table>
          <thead>
            <tr>${tableHeaders}</tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
      ` : ''}
      
      <div class="footer">
        Сформировано на платформе Экономикус
      </div>
    </body>
    </html>
  `
}

export function usePrintReport(): UsePrintReportReturn {
  const [isGenerating, setIsGenerating] = useState(false)

  /**
   * Генерация PDF из данных отчёта
   * Использует html2canvas для корректного отображения кириллицы
   */
  const generatePDF = useCallback(async (data: ReportData, filename: string) => {
    setIsGenerating(true)
    try {
      // Создаём временный контейнер с HTML
      const container = document.createElement('div')
      container.innerHTML = createReportHTML(data)
      container.style.position = 'absolute'
      container.style.left = '-9999px'
      container.style.top = '0'
      container.style.width = '700px' // A4 width in pixels at 96 DPI
      document.body.appendChild(container)

      // Делаем скриншот
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      })

      // Удаляем контейнер
      document.body.removeChild(container)

      // Создаём PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      const imgData = canvas.toDataURL('image/png')
      const imgProps = pdf.getImageProperties(imgData)
      
      const imgWidth = pageWidth
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width

      // Если контент помещается на одну страницу
      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      } else {
        // Многостраничный вывод
        let heightLeft = imgHeight
        let position = 0
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
        
        while (heightLeft > 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
        }
      }

      pdf.save(filename)
    } catch (error) {
      console.error('Error generating PDF:', error)
      throw error
    } finally {
      setIsGenerating(false)
    }
  }, [])

  /**
   * Генерация сертификата в PDF
   */
  const generateCertificate = useCallback(async (
    data: CertificateData, 
    filename: string = 'certificate.pdf'
  ) => {
    setIsGenerating(true)
    try {
      // Создаём временный контейнер с HTML
      const container = document.createElement('div')
      container.innerHTML = createCertificateHTML(data)
      container.style.position = 'absolute'
      container.style.left = '-9999px'
      container.style.top = '0'
      container.style.width = '1123px' // A4 landscape width
      container.style.height = '794px'
      document.body.appendChild(container)

      // Делаем скриншот
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      })

      // Удаляем контейнер
      document.body.removeChild(container)

      // Создаём PDF (альбомная ориентация)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      const pageWidth = pdf.internal.pageSize.getWidth()

      const imgData = canvas.toDataURL('image/png')
      const imgProps = pdf.getImageProperties(imgData)
      
      const imgWidth = pageWidth
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(filename)
    } catch (error) {
      console.error('Error generating certificate:', error)
      throw error
    } finally {
      setIsGenerating(false)
    }
  }, [])

  /**
   * Печать элемента по ID (скриншот + PDF)
   */
  const printElement = useCallback(async (elementId: string, filename: string) => {
    setIsGenerating(true)
    try {
      const element = document.getElementById(elementId)
      if (!element) {
        throw new Error(`Element with id "${elementId}" not found`)
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png')
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      const imgProps = pdf.getImageProperties(imgData)
      const imgWidth = pageWidth - 10
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width

      const yPos = imgHeight > pageHeight ? 5 : (pageHeight - imgHeight) / 2

      pdf.addImage(imgData, 'PNG', 5, yPos, imgWidth, Math.min(imgHeight, pageHeight - 10))
      pdf.save(filename)
    } catch (error) {
      console.error('Error printing element:', error)
      throw error
    } finally {
      setIsGenerating(false)
    }
  }, [])

  return {
    generatePDF,
    generateCertificate,
    printElement,
    isGenerating,
  }
}
