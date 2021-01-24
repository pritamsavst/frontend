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

const DividerWithLabel = Loadable({
  loader: () => import("./DividerWithLabel"),
  loading: () => <Loading />
});

const MapLocator = Loadable({
  loader: () => import("./MapLocator"),
  loading: () => <Loading />
});
const MapLocatorEdit = Loadable({
  loader: () => import("./MapLocatorEdit"),
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

const ImageUploadMolecule = Loadable({
  loader: () => import("./ImageUploadMolecule"),
  loading: () => <Loading />
});

const ReportMolecule = Loadable({
  loader: () => import("./ReportMolecule"),
  loading: () => <Loading />
});

const ReportMoleculeLineBar = Loadable({
  loader: () => import("./ReportMoleculeLineBar"),
  loading: () => <Loading />
});

const ReportMoleculeBarPie = Loadable({
  loader: () => import("./ReportMoleculeBarPie"),
  loading: () => <Loading />
});

const ReportMoleculeRadar = Loadable({
  loader: () => import("./ReportMoleculeRadar"),
  loading: () => <Loading />
});

const ReportMoleculeBarGroup = Loadable({
  loader: () => import("./ReportMoleculeBarGroup"),
  loading: () => <Loading />
});

const ReportPreviewWF = Loadable({
  loader: () => import("./ReportPreviewWF"),
  loading: () => <Loading />
});

const WorkFlowChart = Loadable({
  loader: () => import("./WorkFlowChart"),
  loading: () => <Loading />
});

export {
  TestMolecules,
  RadioButtonsGroup,
  Tooltip,
  CustomTab,
  UploadSingleFile,
  DocumentList,
  MapLocator,
  FeesEstimateCard,
  DividerWithLabel,
  HowItWorks,
  ImageUploadMolecule,
  MapLocatorEdit,
  ReportMolecule,
  ReportMoleculeLineBar,
  ReportMoleculeBarPie,
  ReportMoleculeRadar,
  ReportMoleculeBarGroup,
  ReportPreviewWF,
  WorkFlowChart
};
