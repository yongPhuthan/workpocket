export type IFormInput = {
    productDetails: Array<{ key: string; value: string; icon: string }>;
    productImages: Array<{ name: string; src: string }>;
    additionalProductImages: Array<{ name: string; src: string }>;
  }

  export type CardFormType = {
    setShowForm: (value: boolean) => void;
    setCardFormData: (data: any) => void;
    handleBack: () => void;
    handleContinue: () => void;
    setCardFormSubmitted: (value: boolean) => void;
    selectedValue: string;
    defaultValues: any;
    email: string | null | undefined;
    cardFormData:{
      projectTitle:string
      projectDescription:string
      projectTitleManual:string
    projectDescriptionManual:string
    }

  }
  