import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;
const TestMolecules = Loadable({
  loader: () => import("./TestMolecules"),
  loading: () => <Loading />
});
const RadioButtonsGroup = Loadable({
  loader: () => import("./RadioGroup"),
  loading: () => <Loading />
});
const ActionDialog = Loadable({
  loader: () => import("./ActionDialog"),
  loading: () => <Loading />
});

const SimpleModal = Loadable({
  loader: () => import("./SimpleModal"),
  loading: () => <Loading />
});

const Tooltip = Loadable({
  loader: () => import("./Tooltip"),
  loading: () => <Loading />
});

const CustomTab = Loadable({
  loader: () => import("./CustomTab"),
  loading: () => <Loading />
});

const UploadSingleFile = Loadable({
  loader: () => import("./UploadSingleFile"),
  loading: () => <Loading />
});

const DocumentList = Loadable({
  loader: () => import("./DocumentList"),
  loading: () => <Loading />
});

const FeesEstimateCard = Loadable({
  loader: () => import("./FeesEstimateCard"),
  loading: () => <Loading />
});

const HowItWorks = Loadable({
  loader: () => import("./HowItWorks"),
  loading: () => <Loading />
});

const Footer = Loadable({
  loader: () => import("./Footer"),
  loading: () => <Loading />
})

const RentSummaryCard = Loadable({
  loader: () => import("./RentSummaryCard"),
  loading: () => <Loading />
});

const LandingPage = Loadable({
  loader: () => import("./LandingPage"),
  loading: () => <Loading />
});

const ImageUploadMolecule = Loadable({
  loader: () => import("./ImageUploadMolecule"),
  loading: () => <Loading />
});
const ImageUpload = Loadable({
  loader: () => import("./ImageUpload"),
  loading: () => <Loading />
});
const MultipleOwners = Loadable({
  loader: () => import("./MultipleOwners"),
  loading: () => <Loading />
});

const MultipleDocuments = Loadable({
  loader: () => import("./MultipleDocuments"),
  loading: () => <Loading />
})
const MultiDownloadCardNoticePreview = Loadable({
  loader: () => import("./MultiDownloadCardNoticePreview"),
  loading: () => <Loading />
})
const MultiDownloadCard = Loadable({
  loader: () => import("./MultiDownloadCard"),
  loading: () => <Loading />
});
export {
  TestMolecules,
  RadioButtonsGroup,
  Tooltip,
  CustomTab,
  UploadSingleFile,
  DocumentList,
  FeesEstimateCard,
  HowItWorks,
  ActionDialog,
  Footer,
  LandingPage,
  ImageUpload,
  ImageUploadMolecule,
  MultipleOwners,
  MultipleDocuments,
  MultiDownloadCardNoticePreview,
  RentSummaryCard,
  MultiDownloadCard,
  SimpleModal
}
