import React from 'react';
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
  StyledContainer,
  StyledTextField,
  StyledRoot,
  StyledCard,
  StyledImageUpload,
} from '../../components/styled/StyledUi';
import {
  Box,
  Button,
  Hidden,
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
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useCreateCompany from '../../hooks/useCreateCompany';
import QRCode from 'qrcode.react';
import { CardFormType } from '../../doctype';
import { getAuth, getIdToken } from "firebase/auth";

type Props = {};
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5A5F',
    },
    secondary: {
      main: '#ffffff',
    },
  },
});
const CardForm = ({
  handleContinue,
  setCardFormSubmitted,
  setShowForm,
  handleBack,
  selectedValue,
  setCardFormData,
  cardFormData,
  email,
}: CardFormType) => {
  const { register, handleSubmit, control, watch } = useForm({
    defaultValues: {
      projectTitleManual: cardFormData.projectTitleManual,
      projectTitle: cardFormData.projectTitle,
      projectDescriptionManual: cardFormData.projectDescriptionManual,
      projectDescription: cardFormData.projectDescription,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: any) => {
    console.log('data', data);
    setCardFormSubmitted(true);
    setShowForm(false);
    handleContinue();
    setCardFormData(data);
  };
  const projectTitle = watch('projectTitle');
  const projectDescription = watch('projectDescription');
  const projectTitleManual = watch('projectTitleManual');
  const projectDescriptionManual = watch('projectDescriptionManual');

  console.log('projectDescriptionManual', watch('projectDescriptionManual'));
  console.log('projectTitleManual', watch('projectTitleManual'));

  return (
    <Box>
      <Hidden implementation="css" mdUp>
        {/* Mobile and Tablet View */}
        <StyledContainer maxWidth="sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            {selectedValue == 'upload' ? (
              <>
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <Grid sx={{ marginBottom: 5 }} item>
                      <Grid container justifyContent="space-between">
                        <Grid>
                          <StyledTypographyCard>
                            ชื่อโครงการ
                          </StyledTypographyCard>
                        </Grid>
                      </Grid>

                      <StyledTextField
                        {...register(`projectTitle`)}
                        variant="outlined"
                        value={watch('projectTitle')}
                        fullWidth
                        multiline
                        rows={1}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <StyledTextField
                      {...register('projectDescription')}
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={7}
                    />
                  </Grid>
                  <Grid container justifyContent={'space-between'}>
                    <Grid item>
                      <Box p={2} mt={2} sx={{ alignSelf: 'flex-start' }}>
                        <Button
                          startIcon={
                            <ArrowBackIcon
                              sx={{ color: 'black', fontSize: 'large' }}
                            />
                          }
                          onClick={handleBack}
                          sx={{ color: 'black', fontSize: 'large' }}
                        >
                          ย้อนกลับ
                        </Button>
                      </Box>
                    </Grid>
                    <Grid mt={2} item>
                      <BlackButton type="submit">ไปต่อ</BlackButton>
                      {/* <StyledButtonCard type="submit">Save</StyledButtonCard> */}
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <Grid sx={{ marginBottom: 5 }} item>
                      <Grid container justifyContent="space-between">
                        <Grid>
                          <StyledTypographyCard>
                            ชื่อโครงการ
                          </StyledTypographyCard>
                        </Grid>
                      </Grid>

                      <StyledTextField
                        {...register(`projectTitleManual`)}
                        variant="outlined"
                        defaultValue={watch(`projectTitleManual`)}
                        value={watch(`projectTitleManual`)}
                        fullWidth
                        multiline
                        rows={1}
                      />
                    </Grid>
                    {/* <StyledButtonCard type="button" onClick={() => append({ value: '' })}>
                  Add
                </StyledButtonCard> */}
                  </Grid>
                </Grid>
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <Grid sx={{ marginBottom: 5 }} item>
                      <Grid container justifyContent="space-between">
                        <Grid>
                          <StyledTypographyCard>
                            รายละเอียด
                          </StyledTypographyCard>
                        </Grid>
                      </Grid>

                      <StyledTextField
                        {...register(`projectDescriptionManual`)}
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={7}
                      />
                    </Grid>
                  </Grid>
                  <Grid container justifyContent={'space-between'}>
                    <Grid item>
                      <Box p={2} mt={2} sx={{ alignSelf: 'flex-start' }}>
                        <Button
                          startIcon={
                            <ArrowBackIcon
                              sx={{ color: 'black', fontSize: 'large' }}
                            />
                          }
                          onClick={handleBack}
                          sx={{ color: 'black', fontSize: 'large' }}
                        >
                          ย้อนกลับ
                        </Button>
                      </Box>
                    </Grid>
                    <Grid mt={2} item>
                      <BlackButton
                        disabled={
                          selectedValue === 'upload'
                            ? !projectTitle || !projectDescription
                            : !projectTitleManual || !projectDescriptionManual
                        }
                        type="submit"
                      >
                        ไปต่อ
                      </BlackButton>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
          </form>
        </StyledContainer>
      </Hidden>
      <Hidden implementation="css" smDown>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
        >
          <Box mb={2}>Please scan this QR code on your mobile device:</Box>
          <QRCode value="https://reactjs.org/" size={256} />
        </Box>
        {/* Desktop View */}
        <div>Please scan this page on mobile</div>
        {/* QR Code Component */}
      </Hidden>
    </Box>
  );
};

export default CardForm;
