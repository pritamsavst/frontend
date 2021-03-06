import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;
const TestAtoms = Loadable({
  loader: () => import("./TestAtoms"),
  loading: () => <Loading />
});

const ApplicationNoContainer = Loadable({
  loader: () => import("./ApplicationNo"),
  loading: () => <Loading />
});

const Checkbox = Loadable({
  loader: () => import("./Checkbox"),
  loading: () => <Loading />
});

const MapLocation = Loadable({
  loader: () => import("./MapLocation"),
  loading: () => <Loading />
});

const AutoSuggest = Loadable({
  loader: () => import("./AutoSuggest"),
  loading: () => <Loading />
});

const Asteric = Loadable({
  loader: () => import("./Asteric"),
  loading: () => <Loading />
});

const MenuButton = Loadable({
  loader: () => import("./MenuButton"),
  loading: () => <Loading />
});

const FormIcon = Loadable({
  loader: () => import("./Icons/FormIcon"),
  loading: () => <Loading />
});

const EstateIcon = Loadable({
  loader: () => import("./Icons/EstateIcon"),
  loading: () => <Loading />
});

const FileNumberContainer = Loadable({
  loader: () => import("./FileNumber"),
  loading: () => <Loading />
})

export {
  TestAtoms,
  ApplicationNoContainer,
  Checkbox,
  MapLocation,
  AutoSuggest,
  Asteric,
  MenuButton,
  FormIcon,
  EstateIcon,
  FileNumberContainer
};
