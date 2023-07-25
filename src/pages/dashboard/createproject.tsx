import React, { ChangeEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../../firebase';
import { User } from 'firebase/auth';
import DeleteIcon from '@mui/icons-material/Delete';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import * as pdfjsLib from 'pdfjs-dist';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Divider,
  Typography,
  Container,
  Select,
  FormControl,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  TextField,
  InputLabel,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
} from '@mui/material';
import Radio, { RadioProps } from '@mui/material/Radio';
import {
  StyledButton,
  BlackButton,
  StyledTypographyCard,
  StyledTextFieldCard,
  StyledFormLabel,
  StyledButtonCard,
  BpCheckedIcon,
  BpIcon,
  WhiteButton,
  PageContainer,
  StyledInput,
  StyledImage,
  StyledRoot,
  StyledCard,
  StyledImageUpload,
} from '../../../components/styled/StyledUi';
import CardForm from '../../../components/Dashboard/CardForm';
import ProductDetailsForm from '../../../components/Dashboard/ProductDetailsForm';

type Props = {};

const CompanySetting: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isCardFormSubmitted, setCardFormSubmitted] = useState(false);
  const [cardFormData, setCardFormData] = useState({}); // Add this line
  const [uploadPage, setUploadPage] = useState(false);
  const [selectChoice, setSelectChoice] = useState('uploadPDF');
  const [selectedValue, setSelectedValue] = useState('upload');
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const [defaultValues, setDefaultValues] = useState({});
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        setUser(user);
        console.log('user.email', JSON.stringify(user.email));
      } else {
        // User is signed out.
        setUser(null);
        router.push('./login');
      }
    });

    return () => unsubscribe();
  }, []);
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      return;
    }
    setFile(e.target.files[0]);
  };

  function BpRadio(props: RadioProps) {
    return (
      <Radio
        disableRipple
        color="default"
        checkedIcon={<BpCheckedIcon />}
        icon={<BpIcon />}
        {...props}
      />
    );
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleChange');
    setSelectedValue((event.target as HTMLInputElement).value);
  };

  const handleContinue = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };
  const handleContinueManual = () => {
    if (step < 4) {
      setStep(step + 2);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  const handleBackManual = () => {
    if (step > 1) {
      setStep(step - 2);
    }
  };
  const performOCR = async (base64ImageContent: string) => {
    try {
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64ImageContent }),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      console.log('OCR results: ', data);

      const fullText = data[0].description;
      console.log('full text: ', fullText);

      const lines = fullText.split('\n');
      console.log('lines: ', lines);

      const descriptions = lines[0];
      const projectCheck = ['ประตู', 'กระจก']; // Replace these with your words
      const addressToCheck = [
        'เลขที่',
        'อาคาร',
        'ชั้น',
        'ถนน',
        'ตำบล',
        'เขต',
        'แขวง',
      ]; // Replace these with your words
      const lineToCheck = ['line', 'LINE', 'Line', 'ถนน']; // Replace these with your words
      const nameToCheck = ['คุณ', 'นาย', 'นาง', 'นางสาว', 'ช่าง']; // Replace these with your words
      const serviceToCheck = ['บริการ', 'ติดตั้ง', 'รับ', 'ซ่อม', 'ล้าง']; // Replace these with your words

      const website = lines.filter((line) => line.includes('www'))[0];
      const email = lines.filter((line) => line.includes('@'))[0];

      const projectOCR = lines.filter((line) =>
        projectCheck.some((word) => line.includes(word))
      );

      const projectDescription = projectOCR.join('\n'); // Join the lines with a newline character
      setDefaultValues({
        projectDescription: projectDescription.split('\n\n'), // Split into array

        website,
      });
      setStep(3);
    } catch (error) {
      console.error('Error performing OCR', error);
    }
  };

  const handleOcrUpload = async () => {
    if (!file) return;

    try {
      // Check the file format
      if (file.type === 'application/pdf') {
        // It's a PDF. Convert to image then perform OCR
        const pdfjs = await import('pdfjs-dist/build/pdf');

        const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');

        pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
        const pdf = await pdfjsLib.getDocument({
          url: URL.createObjectURL(file),
        }).promise;
        const page = await pdf.getPage(1); // we only process the first page

        const scale = 1;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Unable to get canvas 2D context');
        }

        // Continue with ctx, which is now guaranteed to be CanvasRenderingContext2D, not null
        await page.render({ canvasContext: ctx, viewport }).promise;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: ctx, viewport }).promise;

        const base64Image = canvas.toDataURL('image/jpeg', 1.0);
        const base64ImageContent = base64Image.replace(
          /^data:image\/(png|jpeg);base64,/,
          ''
        );

        await performOCR(base64ImageContent);
      } else if (file.type.startsWith('image/')) {
        // It's an image. Perform OCR directly
        const reader = new FileReader();
        reader.onloadend = async function () {
          const base64data = reader.result;
          if (base64data) {
            const base64ImageContent = (base64data as string).split(',')[1];
            await performOCR(base64ImageContent);
          } else {
            console.error('Failed to read the file.');
          }
        };
        reader.readAsDataURL(file);
      } else {
        console.error('Unsupported file type.');
      }
    } catch (error) {
      console.error('Error in handleOcrUpload', error);
    }
  };

  return (
    <PageContainer>
      {step === 2 && selectedValue == 'upload' ? (
        <>
          <Typography mb={4} variant="h6">
            เลือกไฟล์ใบเสนอราคาเพื่ออัพโหลด
          </Typography>

          <StyledInput type="file" onChange={onFileChange} />

          <StyledButton disabled={!file} onClick={handleOcrUpload}>
            อัพโหลด
          </StyledButton>
          <Box p={2} mt={2} sx={{ alignSelf: 'flex-start' }}>
            <Button
              startIcon={
                <ArrowBackIcon sx={{ color: 'black', fontSize: 'large' }} />
              }
              onClick={handleBack}
              sx={{ color: 'black', fontSize: 'large' }}
            >
              ย้อนกลับ
            </Button>
          </Box>

          {url && <StyledImage src={url} alt="Uploaded file" />}
        </>
      ) : step === 2 && selectedValue == 'manual' ? (
        <CardForm
        cardFormData={cardFormData}
          handleContinue={handleContinueManual}
          handleBack={handleBack}
          selectedValue={selectedValue}
          defaultValues={defaultValues}
          setCardFormSubmitted={setCardFormSubmitted}
          setShowForm={setShowForm}
          setCardFormData={setCardFormData}
          email={user?.email}
        />
      ) : (
        ''
      )}

      {step === 3 && (
        <CardForm
        cardFormData={cardFormData}

          handleContinue={handleContinue}
          handleBack={handleBack}
          selectedValue={selectedValue}
          defaultValues={defaultValues}
          setCardFormSubmitted={setCardFormSubmitted}
          setShowForm={setShowForm}
          setCardFormData={setCardFormData}
          email={user?.email}
        />
      )}
      {step === 4 && selectedValue == 'manual' ? (
        <ProductDetailsForm
          handleBack={handleBackManual}
          selectedValue={selectedValue}
          cardFormData={cardFormData}
          email={user?.email}
        />
      ) : step === 4 && selectedValue == 'upload' ? (
        <ProductDetailsForm
          handleBack={handleBack}
          selectedValue={selectedValue}
          cardFormData={cardFormData}
          email={user?.email}
        />
      ) : (
        ''
      )}
      {step === 1 && (
        <FormControl sx={{ padding: 3 }}>
          <StyledFormLabel id="demo-customized-radios">
            เลือกวิธีการเพิ่มผลงาน
          </StyledFormLabel>
          <RadioGroup
            value={selectedValue}
            aria-labelledby="demo-customized-radios"
            name="customized-radios"
            onChange={handleChange}
          >
            <Box mb={2}>
              <FormControlLabel
                value="upload"
                control={<BpRadio />}
                label={
                  <Box>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body1">
                        อัพโหลดใบเสนอราคา (แนะนำ)
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="textSecondary">
                      ใช้ระบบพิมพ์รายละเอียดผลงานอัตโนมัติจากการอัพโหลดใบเสนอราคา
                      สะดวกกว่า เร็วกว่า
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <FormControlLabel
              value="manual"
              control={<BpRadio />}
              label={
                <Box>
                  <Typography variant="body1">
                    เพิ่มรายละเอียดด้วยตัวเอง
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                  ></Typography>
                </Box>
              }
            />
          </RadioGroup>
          <Box mt={5} alignSelf={'flex-end'}>
            <BlackButton onClick={handleContinue}>เริ่มต้น</BlackButton>
          </Box>
        </FormControl>
      )}
    </PageContainer>
  );
};

export default CompanySetting;
