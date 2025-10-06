// Resume parser for extracting information from PDF and DOCX files

export const parseResume = async (file) => {
  try {
    const fileType = file.type;
    let text = '';

    if (fileType === 'application/pdf') {
      text = await parsePDF(file);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/msword'
    ) {
      text = await parseDOCX(file);
    } else {
      throw new Error('Unsupported file type');
    }

    // Extract information using regex patterns
    const extractedData = extractInformation(text);
    
    return {
      ...extractedData,
      text,
    };
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw error;
  }
};

const parsePDF = async (file) => {
  // For browser environment, we'll use a simple text extraction
  // In a real production app, you'd use pdf.js or send to backend
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const typedArray = new Uint8Array(e.target.result);
        
        // Simple text extraction from PDF
        // Note: This is a simplified version. For production, use pdf.js
        const text = await extractTextFromPDFBuffer(typedArray);
        resolve(text);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

const extractTextFromPDFBuffer = async (buffer) => {
  // Convert buffer to string and extract text
  // This is a simplified extraction - in production use pdf.js
  const decoder = new TextDecoder('utf-8');
  let text = decoder.decode(buffer);
  
  // Remove PDF header and binary data
  text = text.replace(/[^\x20-\x7E\n]/g, ' ');
  
  return text;
};

const parseDOCX = async (file) => {
  // For DOCX, we'd typically use mammoth.js
  // For simplicity in browser, we'll extract text content
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Simple text extraction
        // In production, use mammoth.js properly
        const text = e.target.result;
        resolve(text);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

const extractInformation = (text) => {
  // Extract name (typically at the beginning)
  const nameMatch = text.match(/^([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/m);
  
  // Extract email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  
  // Extract phone (various formats)
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  
  return {
    name: nameMatch ? nameMatch[1].trim() : '',
    email: emailMatch ? emailMatch[0].trim() : '',
    phone: phoneMatch ? phoneMatch[0].trim() : '',
  };
};

// Validate extracted fields
export const validateFields = (data) => {
  const errors = {};
  
  if (!data.name || data.name.length < 2) {
    errors.name = 'Name is required';
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Valid email is required';
  }
  
  if (!data.phone || !isValidPhone(data.phone)) {
    errors.phone = 'Valid phone number is required';
  }
  
  return errors;
};

const isValidEmail = (email) => {
  const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  // Should have 10-15 digits
  return digits.length >= 10 && digits.length <= 15;
};
