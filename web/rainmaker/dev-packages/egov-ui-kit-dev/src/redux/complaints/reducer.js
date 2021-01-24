import * as actionTypes from "./actionTypes";
import { transformById } from "egov-ui-kit/utils/commons";
import isEmpty from "lodash/isEmpty";

const mergeServiceWithActions = (payload) => {
  return (
    payload &&
    payload.actionHistory &&
    payload.actionHistory.reduce((result, item, index) => {
      if (!isEmpty(item) && !isEmpty(item.actions) && payload.services[index]) {
        result.push({
          ...payload.services[index],
          actions: item.actions,
        });
      }
      return result;
    }, [])
  );
};

const intialState = {
  loading: false,
  error: false,
  errorMessage: "",
  byId: {},
  categoriesById: {},
  complaintDepartment : [],
  AutoroutingEscalation : {},
  complaintSector:[],
  order: "",
};

const complaintsReducer = (state = intialState, action) => {
  const { type, overWrite } = action;

  switch (type) {
    case actionTypes.COMPLAINTS_FETCH_PENDING:
      return {
        ...state,
        loading: true,
        error: false,
        fetchSuccess: false,
        errorMessage: "",
      };
    case actionTypes.COMPLAINTS_FETCH_COMPLETE:
      let complaintsById = transformById(mergeServiceWithActions(action.payload), "serviceRequestId");
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        byId: overWrite
          ? { ...complaintsById }
          : {
              ...state.byId,
              ...complaintsById,
            },
      };
    case actionTypes.COMPLAINTS_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        fetchSuccess: true,
        error: true,
        errorMessage: action.error,
      };
    case actionTypes.COMPLAINTS_CATEGORIES_FETCH_SUCCESS:
      let categoriesById = transformById(action.payload.MdmsRes["RAINMAKER-PGR"].ServiceDefs, "serviceCode");
      return {
        ...state,
        loading: false,
        categoriesById: {
          ...state.categoriesById,
          ...categoriesById,
        },
      };
      case actionTypes.COMPLAINTS_DEPARTMENT_FETCH_SUCCESS:
        let complaintDepartment = transformById(action.payload.MdmsRes["RAINMAKER-PGR"].PgrDepartment, "code");
        return {
          ...state,
          loading: false,
          complaintDepartment: {
            ...state.complaintDepartment,
            ...complaintDepartment,
          },
        };
        case actionTypes.COMPLAINTS_AUTOROUTING_FETCH_SUCCESS:
          let AutoroutingEscalation = transformById(action.payload.MdmsRes["RAINMAKER-PGR"].AutoroutingEscalationMap, "category");
          return {
            ...state,
            loading: false,
            AutoroutingEscalation: {
              ...state.AutoroutingEscalation,
              ...AutoroutingEscalation,
            },
          };
        case actionTypes.COMPLAINTS_SECTOR_FETCH_SUCCESS:
        let complaintSector = transformById(action.payload.MdmsRes["RAINMAKER-PGR"].Sector, "code");
        return {
          ...state,
          loading: false,
          complaintSector: {
            ...state.complaintSector,
            ...complaintSector,
          },
        };
    case actionTypes.COMPLAINTS_SORT_ORDER:
      return {
        ...state,
        loading: false,
        order: action.order,
      };

    case actionTypes.COMPLAINTS_SEND_MESSAGE:
      return {
        ...state,
        loading: false,
        ShareMetaData: action.message,
      };
    case actionTypes.COMPLAINTS_SEND_MESSAGE_SHAREMEDIA:
      return {
        ...state,
        loading: false,
        ShareMetaData: {
          ...state.ShareMetaData,
          shareMedia: action.message,
        },
      };
    case actionTypes.COMPLAINTS_SEND_MESSAGE_SHARECONTENT_TO:
      const shareCont = state.ShareMetaData.shareContent;
      shareCont.map((elem) => {
        elem.to = action.message;
      });
      return {
        ...state,
        loading: false,
        ShareMetaData: {
          ...state.ShareMetaData,
          shareContent: shareCont,
        },
      };

    default:
      return state;
  }
};

export default complaintsReducer;
