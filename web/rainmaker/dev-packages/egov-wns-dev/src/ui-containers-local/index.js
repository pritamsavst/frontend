import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;

const CustomTabContainer = Loadable({
  loader: () => import("./CustomTabContainer"),
  loading: () => <Loading />
});
const LabelContainer = Loadable({
  loader: () => import("./LabelContainer"),
  loading: () => <Loading />
});

const CheckboxContainer = Loadable({
  loader: () => import("./CheckboxContainer"),
  loading: () => <Loading />
});
const DownloadFileContainer = Loadable({
  loader: () => import("./DownloadFileContainer"),
  loading: () => <Loading />
});
const EstimateCardContainer = Loadable({
  loader: () => import("./EstimateCardContainer"),
  loading: () => <Loading />
});
const AutosuggestContainer = Loadable({
  loader: () => import("./AutosuggestContainer"),
  loading: () => <Loading />
});
const DocumentListContainer = Loadable({
  loader: () => import("./DocumentListContainer"),
  loading: () => <Loading />
});
const PaymentRedirectPage = Loadable({
  loader: () => import("./PaymentRedirectPage"),
  loading: () => <Loading />
});
const ResubmitActionContainer = Loadable({
  loader: () => import("./ResubmitActionContainer"),
  loading: () => <Loading />
});

const DialogContainer = Loadable({
  loader: () => import("./DialogContainer"),
  loading: () => <Loading />
});

const ViewBreakupContainer = Loadable({
  loader: () => import("./ViewbreakupDialogContainer"),
  loading: () => <Loading />
});

const RadioGroupContainer = Loadable({
  loader: () => import("./RadioGroupContainer"),
  loading: () => <Loading />
});

const EstimateOverviewCardContainer = Loadable({
  loader: () => import("./EstimateOverviewCardContainer"),
  loading: () => <Loading />
});

const ModificationDocumentListContainer = Loadable({
  loader: () => import("./ModificationDocumentListContainer"),
  loading: () => <Loading />
});
const CheckboxContainerConnHolder = Loadable({
   loader: () => import("./CheckboxContainerConnHolder"),
    loading: () => <Loading />
  });
  const WorkFlowContainer = Loadable({
    loader: () => import("./WorkFlowContainer"),
    loading: () => <Loading />
  });
export {
  CustomTabContainer,
  LabelContainer,
  CheckboxContainer,
  DownloadFileContainer,
  EstimateCardContainer,
  AutosuggestContainer,
  DocumentListContainer,
  PaymentRedirectPage,
  ResubmitActionContainer,
  ViewBreakupContainer,
  DialogContainer,
  RadioGroupContainer,
  EstimateOverviewCardContainer,
  ModificationDocumentListContainer,
  CheckboxContainerConnHolder,
  WorkFlowContainer
};
