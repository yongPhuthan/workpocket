import styled from 'styled-components';

import { Typography, Container,Autocomplete,Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Card as MuiCard, CardContent } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import WorkIcon from '@mui/icons-material/Work';
import CloseIcon from '@mui/icons-material/Close';
import useMediaQuery from '@mui/material/useMediaQuery';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';

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
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100vh;
  overflow: auto;
  background-color: #f7f7f7;
`;
const StyledTypography = styled(Typography)`
  &.title {
    font-size: 14;
    color: '#484848';
  }
  &.pos {
    margin-bottom: 12;
  }
`;
const StyledInput = styled.input`
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #000000;

  
  @media (max-width: 768px) { 
    width: 95%; 
  }
`;
const StyledImage = styled('img')({
  height: '100px',
  width: '100px',
  objectFit: 'cover',
  borderRadius: '8px',
  marginRight: '16px',
  position: 'relative',
});
const StyledButton = styled.button`
  margin: 10px;
  padding: 10px;
  border-radius: 15px;
  border: none;
  background-color: black;
  color: white;
  width: 40vw;
  cursor: pointer;
  &:disabled {
    background-color: grey;
  }
`;

const BlackButton = styled.button`
  margin: 10px;
  padding: 10px;
  border-radius: 20px;
  border: none;
  align-self: flex-end;
  background-color: black;
  color: white;
  width: 30vw;
  cursor: pointer;
  &:disabled {
    background-color: grey;
    color: white;
    cursor: not-allowed;
  }
`;
const WhiteButton = styled.button`
  margin: 10px;
  padding: 10px;
  border-radius: 20px;
  border: 2;
  border-color: black;
  align-self: flex-end;
  background-color: white;
  color: black;
  width: 30vw;
  cursor: pointer;
`;

const BpIcon = styled('span')(() => ({
  borderRadius: '50%',
  width: '16px',
  height: '16px',
  boxShadow: 'inset 0 0 0 1px black',
  backgroundColor: 'white',
  'input:hover ~ &': {
    backgroundColor: '#ddd',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background: 'rgba(206,217,224,.5)',
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: 'black',
  '&:before': {
    display: 'block',
    width: '16px',
    height: '16px',
    backgroundImage: 'radial-gradient(white, white 28%, transparent 32%)',
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#333',
  },
});

const iconComponents = {
  Home: <HomeIcon />,
  Settings: <SettingsIcon />,
  Work: <WorkIcon />,
  // add more icons as per your requirement
};

const StyledButtonCard = styled.button`
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #003d99;
  color: white;
  width: 85vw;
  cursor: pointer;
`;
const StyledFormLabel = styled(Typography)({
  color: 'black', // make the color black
  marginBottom: '30px', // add a bottom margin
  fontSize: '18px',
  fontWeight: 'bold',
});
const StyledTextFieldCard = styled.input`
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const StyledTypographyCard = styled(Typography)`
  font-size: 1.2rem;
  font-weight: 600;
  color: #474747;
`;

const StyledImageUpload = styled.img`
  margin: 10px;
  max-width: 500px;
  height: auto;
`;

const StyledCard = styled(MuiCard)`
  margin: 20px 0;
  width: 93vw;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  border: 0;
  /* border-color: gray; */
`;
const StyledRoot = styled('div')({
  fontFamily:
    "Circular, -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif",
  lineHeight: '1.43',
  color: '#484848',
  backgroundColor: '#fafafa',
  padding: '24px',
  height: '100vh',
});
const StyledContainer = styled(Container)`
  background-color: ${theme.palette.secondary.main};
  padding: ${theme.spacing(3)};
  border-radius: ${theme.shape.borderRadius};
  display: flex;
  overflow: auto;
  width: 100vw;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
`;

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    fieldset {
      border-color: ${theme.palette.primary.main};
    }
    &:hover fieldset {
      border-color: ${theme.palette.primary.dark};
    }
    &.Mui-focused fieldset {
      border-color: ${theme.palette.primary.dark};
    }
  }
  .MuiInputBase-input {
    color: ${theme.palette.primary.main};
  }
  width: 100%;
`;


const FormItem = styled.div`
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1em;
`;

const FormTitle = styled.h1`
  font-size: 1.5em;
  text-align: center;
`;

const FormField = styled.div`
  margin-top: 1em;
`;

const ChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  & > * {
    margin: 0.5em;
  }
`;

const StyledChip = styled(Chip)`
  .MuiChip-deleteIcon {
    color: red;
  }
`;
const StyledCloseIcon = styled(CloseIcon)({
  color: '#fff',
  backgroundColor: '#f44336', // Red background color
  borderRadius: '50%', // Round shape
});
const StyledAutocomplete = styled(Autocomplete)`
  width: 100%;
  margin-bottom: 1rem;

  & .MuiAutocomplete-inputRoot {
    padding: 0.5rem;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.1);
  }

  & .MuiAutocomplete-option {
    padding: 0.5rem;
    color: #333;
    cursor: pointer;

    &:hover {
      background-color: #f0f0f0;
    }
  }
`;

const StyledCategoryButton = styled(Button)`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: #3f51b5;
  color: #fff;
  text-transform: none;

  &:hover {
    background-color: #303f9f;
  }
`;

export {
  StyledButton,
  StyledAutocomplete,
  StyledCategoryButton,
  StyledChip,
  FormTitle,
  Form,
  FormItem,
  FormField,
  ChipContainer,
  StyledCloseIcon,
  StyledContainer,
  StyledTextField,
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
  iconComponents,
  StyledRoot,
  StyledCard,
  StyledImageUpload,
  StyledTypography,
};
