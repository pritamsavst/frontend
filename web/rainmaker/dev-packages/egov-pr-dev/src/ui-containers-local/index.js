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

const DialogContainer = Loadable({
  loader: () => import("./DialogContainer"),
  loading: () => <Loading />
});
const ApproveContainer = Loadable({
  loader: () => import("./ApproveContainer"),
  loading: () => <Loading />
});
const RejectContainer = Loadable({
  loader: () => import("./RejectContainer"),
  loading: () => <Loading />
});
const ReassignContainer = Loadable({
  loader: () => import("./ReassignContainer"),
  loading: () => <Loading />
});
const ForwardContainer = Loadable({
  loader: () => import("./ForwardContainer"),
  loading: () => <Loading />
});
const ViewBreakupContainer = Loadable({
  loader: () => import("./ViewbreakupDialogContainer"),
  loading: () => <Loading />
});
const UnderTakingContainer = Loadable({
  loader: () => import("./UnderTakingContainer"),
  loading: () => <Loading />
});

const ExternalInviteContainer = Loadable({
  loader: () => import("./ExternalInviteContainer"),
  loading: () => <Loading />
});

const PressInviteContainer = Loadable({
  loader: () => import("./PressInviteContainer"),
  loading: () => <Loading />
});

const InternalInviteContainer = Loadable({
  loader: () => import("./InternalInviteContainer"),
  loading: () => <Loading />
});

const DownloadDeleteFileContainer = Loadable({
  loader: () => import("./DownloadDeleteFileContainer"),
  loading: () => <Loading />
});
const DocumentListTenderContainer = Loadable({
  loader: () => import("./DocumentListTenderContainer"),
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
  ViewBreakupContainer,
  DialogContainer,
  ApproveContainer,
  RejectContainer,
  ReassignContainer,
  ForwardContainer,
  UnderTakingContainer,
  ExternalInviteContainer,
  PressInviteContainer,
  InternalInviteContainer,
  DownloadDeleteFileContainer,
  DocumentListTenderContainer
  
};
