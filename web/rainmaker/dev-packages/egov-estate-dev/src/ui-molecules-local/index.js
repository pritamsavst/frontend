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

// const AutoSelector = Loadable({
//   loader: () => import("./AutoSelector"),
//   loading: () => <Loading />
// });

const MapLocator = Loadable({
  loader: () => import("./MapLocator"),
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

const LandingPage = Loadable({
  loader: () => import("./LandingPage"),
  loading: () => <Loading />
});

const VerticalCardItems = Loadable({
  loader: () => import("./VerticalCardItems"),
  loading: () => <Loading />
});

const ExpansionPanelMolecule = Loadable({
  loader: () => import("./ExpansionPanel"),
  loading: () => <Loading />
})

const MultipleDocuments = Loadable({
  loader: () => import("./MultipleDocuments"),
  loading: () => <Loading />
})

const NestedList = Loadable({
  loader: () => import("./NestedList"),
  loading: () => <Loading />
})

const MultipleCards = Loadable({
  loader: () => import("./MultipleCards"),
  loading: () => <Loading />
})

const RentSummaryCard = Loadable({
  loader: () => import("./RentSummaryCard"),
  loading: () => <Loading />
})

export {
  TestMolecules,
  RadioButtonsGroup,
  Tooltip,
  CustomTab,
  UploadSingleFile,
  DocumentList,
  MapLocator,
  FeesEstimateCard,
  HowItWorks,
  ActionDialog,
  Footer,
  LandingPage,
  VerticalCardItems,
  ExpansionPanelMolecule,
  NestedList,
  MultipleCards,
  RentSummaryCard
};
