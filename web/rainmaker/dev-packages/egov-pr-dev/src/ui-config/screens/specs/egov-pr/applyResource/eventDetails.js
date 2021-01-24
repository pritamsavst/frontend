import {
    getBreak,
    getCommonCard,
    getCommonContainer,
    getCommonGrayCard,
    getCommonTitle,
    getSelectField,
    getTextField,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
 
  import "./index.css";
  
  let previousUoms = [];
  
   export const eventDetails = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Event Social Media Links",
        labelKey: "PR_EVENT_SOCIAL_MEDIA_LINKS_HEADER"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    break: getBreak(),
    propertyDetailsConatiner: getCommonContainer({
        FacebookUrl: getTextField({
        label: {
          labelName: "Event Facebook Url",
          labelKey: "PR_EVENT_FACEBOOK_URL_LABEL"
        },
        placeholder: {
            labelName: "Enter Event Facebook Url",
            labelKey: "PR_EVENT_FACEBOOK_URL_PLACEHOLDER"
          },
          pattern:getPattern("validUrl"),
          
          errorMessage: "PR_FACEBOOK_URL_INVALID",
          
        jsonPath: "PublicRelation[0].CreateEventDetails.facebookUrl"
      }),
      twitterUrl: getTextField({
        label: {
          labelName: "Event Twitter Link",
          labelKey: "PR_EVENT_TWITTER_URL_LABEL"
        },
        placeholder: {
            labelName: "Enter Event Twitter Link",
            labelKey: "PR_EVENT_TWITTER_LINK_PLACEHOLDER"
          },
        
       pattern:getPattern("validUrl"),
       errorMessage: "PR_TWITTER_URL_INVALID",
       
        jsonPath: "PublicRelation[0].CreateEventDetails.twitterUrl"
      }),
      instagram: getTextField({
        label: {
          labelName: "Event Instagram",
          labelKey: "PR_EVENT_INSTAGRAM_LABEL"
        },
        placeholder: {
            labelName: "Enter Event Instagram",
            labelKey: "PR_EVENT_INSTAGRAM_PLACEHOLDER"
          },
          pattern:getPattern("validUrl"),
         
          errorMessage: "PR_INSTAGRAM_URL_INVALID",
          
        jsonPath: "PublicRelation[0].CreateEventDetails.instagramUrl"
      }),
     
    })
  });
