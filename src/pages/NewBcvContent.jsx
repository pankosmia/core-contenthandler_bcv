import { useState, useContext, useEffect } from "react";
import {
  Button,
  DialogActions,
  Box,
  DialogContent,
  DialogContentText,
  Step,
  StepLabel,
  Stepper
} from "@mui/material";

import { enqueueSnackbar } from "notistack";
import {
  postJson,
  doI18n,
  getAndSetJson,
  getJson,
} from "pithekos-lib";

import {
  i18nContext,
  debugContext,
  Header,
} from "pankosmia-rcl";

import { PanDialog, PanDialogActions } from "pankosmia-rcl";
import ErrorDialog from "./NewBcvContent/ErrorDialog";
import NameDocument from "./NewBcvContent/NameDocument";
import LanguagePicker from "./NewBcvContent/LanguagePicker";
import ContentDocument from "./NewBcvContent/ContentDocument";

export default function NewBcvContent() {
  const { i18nRef } = useContext(i18nContext);
  const { debugRef } = useContext(debugContext);
  const [contentName, setContentName] = useState("");
  const [contentAbbr, setContentAbbr] = useState("");
  const [contentType, setContentType] = useState("x-bcvnotes");
  const [contentLanguageCode, setContentLanguageCode] = useState("und");
  const [showBookFields, setShowBookFields] = useState(true);
  const [bookCode, setBookCode] = useState("TIT");
  const [bookTitle, setBookTitle] = useState("Tit");
  const [bookAbbr, setBookAbbr] = useState("Ti");
  const [postCount, setPostCount] = useState(0);
  const [versification, setVersification] = useState("eng");
  const [bookCodes, setBookCodes] = useState([]);
  const [openModal, setOpenModal] = useState(true);
  const hash = window.location.hash;
  const query = hash.includes("?") ? hash.split("?")[1] : "";
  const params = new URLSearchParams(query);
  const resourceFormat = params.get("resourceType");
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [localRepos, setLocalRepos] = useState([]);
  const [repoExists, setRepoExists] = useState(false);
  const [contentOption, setContentOption] = useState("book");
  const [currentLanguage, setCurrentLanguage] = useState({ language_code: "", language_name: "" });
  const [languageIsValid, setLanguageIsValid] = useState(true);
  const [errorAbbreviation, setErrorAbbreviation] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const steps = [`${doI18n("pages:core-contenthandler_bcv:name_section", i18nRef.current)}`,
  `${doI18n("pages:core-contenthandler_bcv:language", i18nRef.current)}`,
  `${doI18n("pages:core-contenthandler_bcv:content_section", i18nRef.current)}`
  ];

  useEffect(
    () => {
      if (openModal) {
        getAndSetJson({
          url: "/git/list-local-repos",
          setter: setLocalRepos
        }).then()
      }
    },
    [openModal]
  );

  const handleClose = () => {
    const url = window.location.search;
    const params = new URLSearchParams(url);
    const returnType = params.get("returntypepage");

    if (returnType === "dashboard") {
      window.location.href = "/clients/main"
    } else {
      window.location.href = "/clients/content"
    }
  }
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = async () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);

    } if (activeStep === steps.length - 1) {
      try {
        await handleCreate();
      } catch (error) {
        console.error("Erreur création projet", error)
      }
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 1:
        return <NameDocument contentType={contentType} setContentType={setContentType} repoExists={repoExists} setRepoExists={setRepoExists} contentName={contentName} setContentName={setContentName} contentAbbr={contentAbbr} setContentAbbr={setContentAbbr} errorAbbreviation={errorAbbreviation} setErrorAbbreviation={setErrorAbbreviation} localRepos={localRepos} />
      case 2:
        return <LanguagePicker currentLanguage={currentLanguage} setCurrentLanguage={setCurrentLanguage} setIsValid={setLanguageIsValid} />
      case 3:
        return <ContentDocument open={openModal} contentOption={contentOption} setContentOption={setContentOption} versification={versification} setVersification={setVersification} bookCode={bookCode} setBookCode={setBookCode} bookAbbr={bookAbbr} bookCodes={bookCodes} setBookAbbr={setBookAbbr} bookTitle={bookTitle} setBookTitle={setBookTitle} />
      default:
        return null;
    }
  }
  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return (
          contentName.trim().length > 0 &&
          contentAbbr.trim().length > 0 &&
          contentType.trim().length > 0 &&
          (errorAbbreviation === false)
        );

      case 1:
        return (
          currentLanguage?.language_code?.trim().length > 0 &&
          currentLanguage?.language_name?.trim().length > 0 &&
          (languageIsValid === true)
        );
      case 2:

        if (contentOption === "book") {
          return (
            versification.trim().length === 3 &&
            bookCode.trim().length === 3 &&
            bookTitle.trim().length > 0 &&
            bookAbbr.trim().length > 0
          );
        }
        return true;
      default:
        return true;
    }
  };

  const handleCloseCreate = () => {
    setOpenModal(false);
    setTimeout(() => {
      window.location.href = "/clients/content";
    });
  };

  useEffect(() => {
    const doFetch = async () => {
      const versificationResponse = await getJson(
        "/content-utils/versification/eng",
        debugRef.current
      );
      if (versificationResponse.ok) {
        setBookCodes(Object.keys(versificationResponse.json.maxVerses));
      }
    };
    if (bookCodes.length === 0 && openModal === true) {
      doFetch().then();
    }
  }, [openModal]);

  useEffect(() => {
    setContentName("");
    setContentAbbr("");
    setContentLanguageCode("und");
    setBookCode("TIT");
    setBookTitle("Titus");
    setBookAbbr("Ti");
    setShowBookFields(true);
    setVersification("eng");
  }, [postCount]);

  const handleCreate = async () => {
    const payload = {
      content_name: contentName,
      content_abbr: contentAbbr,
      tsv_type: resourceFormat,
      content_language_code: currentLanguage.language_code,
      content_language_name: currentLanguage.language_name,      
      versification: versification,
      add_book: showBookFields,
      book_code: showBookFields ? bookCode : null,
      book_title: showBookFields ? bookTitle : null,
      book_abbr: showBookFields ? bookAbbr : null,
    };
    const response = await postJson(
      "/git/new-bcv-resource",
      JSON.stringify(payload),
      debugRef.current
    );
    if (response.ok) {
      setPostCount(postCount + 1);
      enqueueSnackbar(
        doI18n("pages:core-contenthandler_bcv:content_created", i18nRef.current),
        { variant: "success" }
      );
      handleCloseCreate();
    } else {
      setErrorMessage(`${doI18n("pages:core-contenthandler_bcv:book_creation_error", i18nRef.current)}: ${response.status}`);
      setErrorDialogOpen(true);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
          backgroundImage:
            'url("/app-resources/pages/content/background_blur.png")',
          backgroundRepeat: "no-repeat",
        }}
      />
      <Header
        titleKey="pages:content:title"
        currentId="content"
        requireNet={false}
      />

      <PanDialog
        titleLabel={doI18n(`pages:core-contenthandler_bcv:create_content_${resourceFormat}`, i18nRef.current)}
        isOpen={openModal}
        closeFn={() => handleClose()}
      >
        <DialogContent>
          <Stepper sx={{ position: "sticky" }} activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep !== steps.length && (
            <>
              <DialogContentText
                variant='subtitle2'
                sx={{ paddingBottom: 1 }}
              >
                {doI18n(`pages:core-contenthandler_bcv:required_field`, i18nRef.current)}
              </DialogContentText>
              {renderStepContent(activeStep + 1)}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            {doI18n("pages:core-contenthandler_bcv:back_button", i18nRef.current)}
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button
            onClick={handleNext}
            disabled={!isStepValid(activeStep) || repoExists}
          >
            {activeStep === steps.length - 1 ? `${doI18n("pages:core-contenthandler_bcv:create", i18nRef.current)}` : `${doI18n("pages:core-contenthandler_bcv:next_button", i18nRef.current)}`}
          </Button>
        </DialogActions>
      </PanDialog>

      {/* Error Dialog */}
      <ErrorDialog setErrorDialogOpen={setErrorDialogOpen} errorDialogOpen={errorDialogOpen} errorMessage={errorMessage} />
    </Box>
  );
}
