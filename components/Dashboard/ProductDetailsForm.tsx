import React, { ChangeEvent, useState, useEffect } from 'react';

import {
  Box,
  Button,
  Chip,
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
  CardContent,
} from '@mui/material';
import {
  StyledChip,
  BlackButton,
  StyledCategoryButton,
  StyledAutocomplete,
  FormTitle,
  Form,
  FormItem,
  StyledTypography,
  ChipContainer,
  BpIcon,
  FormField,
  StyledCloseIcon,
  iconComponents,
  PageContainer,
  StyledInput,
  StyledImage,
  StyledRoot,
  StyledCard,
  StyledImageUpload,
} from '../../components/styled/StyledUi';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { storage, auth } from '../../firebase';
import { IFormInput } from '../../doctype';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';
import { getAuth, getIdToken } from 'firebase/auth';
import CloseIcon from '@mui/icons-material/Close';
type Props = {};
const fetchCompanyData = async (email: string) => {
  const response = await fetch('/api/query/company', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};
const names = [
  'Category 1',
  'Category 2',
  'Category 3',
  'Tag 1',
  'Tag 2',
  'Tag 3',
];
function AutocompleteField({ options, label }) {
  const [value, setValue] = useState([]);

  const handleInputChange = (event, newInputValue) => {
    if (newInputValue && !options.includes(newInputValue)) {
      setValue([...value, newInputValue]);
      options.push(newInputValue);
    }
  };

  return (
    <StyledAutocomplete
      multiple
      id="tags-standard"
      options={options}
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      freeSolo
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label={label}
          placeholder={label}
        />
      )}
      onInputChange={handleInputChange}
    />
  );
}
const ProductDetailsForm = (props: any) => {
  const cardFormData = props.cardFormData;
  const email = props.email;
  const [value, setValue] = useState([]);
  const [categories, setCategories] = useState<string[]>(['Category 1', 'Category 2', 'Category 3', 'Category 4']);
  const [tags,setTags] = useState<string[]>(['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [openNewCategory, setOpenNewCategory] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [open, setOpen] = React.useState(false);
  const [dialogImage, setDialogImage] = React.useState('');
  const [companyId, setCompanyId] = useState('');
  const watermark = 'doubledoor';
  const [isLoading, setIsLoading] = React.useState(false);
  const iconNames = Object.keys(iconComponents);

  const [productImagesUrls, setProductImagesUrls] = React.useState('');
  const [additionalProductImagesUrls, setAdditionalProductImagesUrls] =
    React.useState('');

  const onImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // you might want to handle validation here

    files.forEach((file, index) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        appendImage({ name: file?.name, src: reader.result });
      };

      reader.readAsDataURL(file);
    });
  };

  // const { data: companyData, status: companyStatus } = useQuery(
  //   ['company', email],
  //   () => fetchCompanyData(email)
  // );

  const onImageUploadAfter = (e, appendImageFunction) => {
    const files = Array.from(e.target.files);

    // you might want to handle validation here

    files.forEach((file, index) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        appendImageFunction({ name: file.name, src: reader.result });
      };

      reader.readAsDataURL(file);
    });
  };
  const handleAddCategory = () => {
    setOpenNewCategory(true);
  };

  const handleSaveCategory = () => {
    if (inputValue) {
      setCategories([...categories, inputValue]);
      setSelectedCategories([...selectedCategories, inputValue]);

    }
    setOpenNewCategory(false);
    setInputValue('');
  };

  const handleClickOpen = (imageUrl: string) => {
    setDialogImage(imageUrl);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { register, control, handleSubmit, watch } = useForm<IFormInput>({
    defaultValues: {
      productDetails: [{ key: '', value: '', icon: 'Home' }],
      productImages: [],
      additionalProductImages: [],
    },
  });
  const watchAllFields = watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productDetails',
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: 'productImages',
  });
  const {
    fields: additionalImageFields,
    append: appendAdditionalImage,
    remove: removeAdditionalImage,
  } = useFieldArray({
    control,
    name: 'additionalProductImages',
  });

  // useEffect(() => {
  //   if (companyStatus === 'success' && companyData) {
  //     setCompanyId(companyData._id);
  //   }
  // }, [cardFormData, companyStatus, companyData]);

  console.log('company ID', companyId);
  const onSubmit = (data: any) => {
    console.log('data', data);
    // Add this line
  };

  const addWatermarkText = (imageSrc: string, watermarkText: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const scaleFactor = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const watermarkWidthRatio = 0.3; // Ratio of the watermark width to the image width
        const watermarkHeightRatio = 0.1; // Ratio of the watermark height to the image height
        const watermarkColor = 'rgba(128, 128, 128, 0.6)'; // Gray background color with increased transparency
        const watermarkTextColor = '#fbfbfb';
        const watermarkFontSizeRatio = 0.02; // Ratio of the watermark font size to the image height

        const watermarkWidth = Math.floor(canvas.width * watermarkWidthRatio);
        const watermarkHeight = Math.floor(
          canvas.height * watermarkHeightRatio
        );
        const watermarkFontSize = Math.floor(
          canvas.height * watermarkFontSizeRatio
        );

        const watermarkX = canvas.width - watermarkWidth - 10; // X-coordinate of the watermark
        const watermarkY = (canvas.height - watermarkHeight) / 1.5; // Y-coordinate of the watermark

        ctx.fillStyle = watermarkColor;
        ctx.fillRect(watermarkX, watermarkY, watermarkWidth, watermarkHeight);

        ctx.font = `${watermarkFontSize}px Arial`;
        ctx.fillStyle = watermarkTextColor;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left'; // Set the text alignment to left
        ctx.fillText(
          watermarkText,
          watermarkX + 15, // Adjust the x-coordinate for padding
          watermarkY + watermarkHeight / 2
        );

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create a blob.'));
            }
          },
          'image/jpeg',
          1
        );
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = imageSrc;
    });
  };

  const dataUrlToBlob = (dataUrl: string) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const onSaveTodatabase = async (data: any) => {
    setIsLoading(true);

    const projectImagesUrls = await Promise.all(
      (data?.productImages || []).map(async (image) => {
        const storageRef = ref(storage, `images/projects/${image.name}`);
        const blob = await addWatermarkText(image.src, watermark);

        return new Promise((resolve, reject) => {
          const uploadTask = uploadBytesResumable(storageRef, blob);

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
            },
            (error) => {
              console.log(error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setProductImagesUrls(downloadURL);
              console.log('File available at', downloadURL);
              resolve(downloadURL);
            }
          );
        });
      })
    );

    const additionalProjectImagesUrls = await Promise.all(
      (data?.additionalProductImages || []).map(async (image) => {
        const storageRef = ref(storage, `images/projects/${image.name}`);
        const blob = dataUrlToBlob(image.src);

        return new Promise((resolve, reject) => {
          const uploadTask = uploadBytesResumable(storageRef, blob);

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
            },
            (error) => {
              console.log(error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setAdditionalProductImagesUrls(downloadURL);
              console.log('File available at', downloadURL);
              resolve(downloadURL);
            }
          );
        });
      })
    );

    if (projectImagesUrls.length && additionalProjectImagesUrls.length) {
      if (auth.currentUser) {
        const idToken = await auth.currentUser.getIdToken(true);
        console.log('idToken', idToken);
     

        const firestoreData = {
          projectImagesUrls,
          additionalProjectImagesUrls,
          cardFormData: cardFormData,
          email,
          productDetails:watch('productDetails'),
          selectedCategories,
          selectedTags

        };

        try {
          const response = await fetch('/api/projects/saveToDatabase', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Add the token in the Authorization header
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({ data: firestoreData }),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const jsonResponse = await response.json();
          console.log(jsonResponse.message);
        } catch (error) {
          console.error(
            'There has been a problem with your fetch operation:',
            error
          );
        }
      }
    }
    setIsLoading(false);
  };

  return (
    <Container
      maxWidth={'sm'}
      sx={{
        backgroundColor: '#fafafa',
        height: '100%',
      }}
    >
      <Box mb={-5} p={3}>
        <Typography variant="h6" fontWeight={'bold'}>
          สรุปรายการ
        </Typography>
      </Box>
      {props.selectedValue == 'manual' ? (
        <StyledCard variant="outlined">
          <CardContent>
            <Typography variant="body1">
              {cardFormData?.projectTitleManual}
            </Typography>
            <StyledTypography className="pos" color="textSecondary">
              {cardFormData?.projectDescriptionManual}
            </StyledTypography>
          </CardContent>
        </StyledCard>
      ) : (
        <StyledCard variant="outlined">
          <CardContent>
            <Typography variant="body1">
              {cardFormData?.projectTitle}
            </Typography>
            <StyledTypography className="pos" color="textSecondary">
              {cardFormData?.projectDescription[0]}
            </StyledTypography>
          </CardContent>
        </StyledCard>
      )}

      <StyledCard variant="outlined" sx={{ padding: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <Grid
              container
              key={field.id}
              mb={2}
              alignItems="center"
              spacing={1}
            >
              <Grid item xs={5.5}>
                <Box>
                  <FormControl size="small" fullWidth sx={{ border: 'none' }}>
                    {/* <InputLabel id={`icon-label-${index}`}>Icon</InputLabel> */}
                    <Controller
                      name={`productDetails.${index}.icon` as const}
                      control={control}
                      defaultValue={field.icon}
                      render={({ field }) => (
                        <Select labelId={`icon-label-${index}`} {...field}>
                          {iconNames.map((iconName) => (
                            <MenuItem value={iconName} key={iconName}>
                              {iconComponents[iconName]}
                              {iconName}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={5.5}>
                <Box>
                  <TextField
                    size="small"
                    {...register(`productDetails.${index}.value` as const)}
                    placeholder="ex 20 cm"
                    defaultValue={field.value}
                    fullWidth
                  />
                </Box>
              </Grid>
              <Grid item xs={1}>
                <IconButton type="button" onClick={() => remove(index)}>
                  <RemoveIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            sx={{ marginBottom: 1, marginTop: 2 }}
            onClick={() => append({ key: '', value: '', icon: 'Home' })}
            variant="outlined"
            component="label"
            startIcon={<AddIcon />}
          >
            เพิ่มไอคอน
          </Button>

          {/* <Button type="submit">Submit</Button> */}
        </form>
      </StyledCard>
      <div style={{ width: '100%' }}>
      <StyledAutocomplete
        multiple
        id="categories"
        options={categories}
        value={selectedCategories}
        onChange={(event, newValue) => {
          setSelectedCategories(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} variant="standard" label="Select Categories" />
        )}
      />

      <StyledAutocomplete
        multiple
        id="tags"
        options={tags}
        onChange={(event, newValue) => {
          setSelectedTags(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} variant="standard" label="Select Tags" />
        )}
      />

      <StyledCategoryButton onClick={handleAddCategory}>
        Add New Category
      </StyledCategoryButton>

      {openNewCategory && (
        <>
          <TextField
            id="standard-basic"
            label="New Category"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />

          <StyledCategoryButton onClick={handleSaveCategory}>
            Save
          </StyledCategoryButton>
        </>
      )}
    </div>

      <StyledCard variant="outlined" sx={{ padding: 2 }}>
        <Typography variant="h6" fontWeight={'bold'}>
          เพิ่มรูปภาพผลงาน
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Display uploaded images */}
            <Grid container>
              {imageFields.map((field, index) => (
                <Grid item mt={2} xs={4} key={index}>
                  <Box key={index} position="relative">
                    <StyledImage
                      src={field.src}
                      alt={field.name}
                      onClick={() => handleClickOpen(field.src)}
                    />
                    <IconButton
                      onClick={() => removeImage(index)}
                      size="small"
                      style={{ position: 'absolute', top: 0, right: 0 }}
                    >
                      <StyledCloseIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
              <Grid item xs={3}>
                <Button
                  component="label"
                  sx={{
                    width: '100px',
                    height: '100px',
                    marginTop: 2,
                    backgroundColor: '#fff',
                    border: '1px dotted #ccc',
                    display: 'flex',
                    borderRadius: '5px',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <AddIcon color="primary" fontSize="large" />
                  <Typography variant="subtitle1">เพิ่มรูปภาพ</Typography>
                  <input
                    type="file"
                    onChange={onImageUpload}
                    hidden
                    multiple
                    accept="image/*"
                  />
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Dialog for larger image */}
          <Dialog
            open={open}
            onClose={handleClose}
            scroll={'body'}
            maxWidth={'lg'}
            fullWidth
          >
            <DialogContent>
              <img
                src={dialogImage}
                alt=""
                style={{ width: '100%', height: 'auto' }}
              />
            </DialogContent>
          </Dialog>
        </form>
      </StyledCard>

      <StyledCard variant="outlined" sx={{ padding: 2 }}>
        <Typography variant="h6" fontWeight={'bold'}>
          ภาพหน้างานก่อนติดตั้ง
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Display uploaded images */}
            <Grid container>
              {additionalImageFields.map((field, index) => (
                <Grid item mt={2} xs={4} key={index}>
                  <Box key={index} position="relative">
                    <StyledImage
                      src={field.src}
                      alt={field.name}
                      onClick={() => handleClickOpen(field.src)}
                    />
                    <IconButton
                      onClick={() => removeAdditionalImage(index)}
                      size="small"
                      style={{ position: 'absolute', top: 0, right: 0 }}
                    >
                      <StyledCloseIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
              <Grid item xs={3}>
                <Button
                  component="label"
                  sx={{
                    width: '100px',
                    height: '100px',
                    marginTop: 2,
                    backgroundColor: '#fff',
                    border: '1px dotted #ccc',
                    display: 'flex',
                    borderRadius: '5px',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <AddIcon color="primary" fontSize="large" />
                  <Typography variant="subtitle1">เพิ่มรูปภาพ</Typography>
                  <input
                    type="file"
                    onChange={(e) =>
                      onImageUploadAfter(e, appendAdditionalImage)
                    }
                    hidden
                    multiple
                    accept="image/*"
                  />
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Dialog for larger image */}
          <Dialog
            open={open}
            onClose={handleClose}
            scroll={'body'}
            maxWidth={'md'}
            fullWidth
          >
            <DialogContent>
              <img
                src={dialogImage}
                alt=""
                style={{ width: '100%', height: 'auto' }}
              />
            </DialogContent>
          </Dialog>
        </form>
      </StyledCard>

      <Grid container justifyContent={'space-between'}>
        <Grid item>
          <Box p={2} sx={{ alignSelf: 'flex-start' }}>
            <Button
              startIcon={
                <ArrowBackIcon sx={{ color: 'black', fontSize: 'large' }} />
              }
              onClick={props.handleBack}
              sx={{ color: 'black', fontSize: 'large' }}
            >
              ย้อนกลับ
            </Button>
          </Box>
        </Grid>
        <Box mb={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <BlackButton
             disabled={
              !imageFields.length ||
              isLoading ||
              !cardFormData ||
              !email ||
              (!watch('productDetails') || watch('productDetails').length === 0) ||
              (!selectedCategories || selectedCategories.length === 0) ||
              (!selectedTags || selectedTags.length === 0)
            }
            onClick={() => onSaveTodatabase(watchAllFields)}
          >
            {isLoading ? (
              <>
                <CircularProgress size={24} />
              </>
            ) : (
              <p>บันทึก</p>
            )}
          </BlackButton>
        </Box>
      </Grid>
    </Container>
  );
};

export default ProductDetailsForm;
