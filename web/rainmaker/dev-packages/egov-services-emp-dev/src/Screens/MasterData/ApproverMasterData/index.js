
import CircularProgress from "@material-ui/core/CircularProgress";
import { httpRequest } from "egov-ui-kit/utils/api";
import TableUi from '../Table/index'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Paper } from '@material-ui/core';
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, TextFieldIcon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import   DialogComponent from './DialogComponent'
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from "material-ui/svg-icons/action/search";
import { connect } from "react-redux";

const styles=theme=>({

 
  addIcon: {
    visibility: 'hidden'
  },
  [theme.breakpoints.only('xs')]: {
    addIcon: {
      visibility: 'visible'
    }
  }
})

class SimpleTable extends React.Component {

  
  async componentDidMount(){

    let requestBody = {
      MdmsCriteria: {
        tenantId: "ch",
        moduleDetails: [
          {
            moduleName: "Booking",
            masterDetails: [
              {
                name: "Sector",
              },
              {
                name: "BookingRoles",
              },
            ],
          },
        ],
      },
    };
  
    try {
      const payload = await httpRequest("egov-mdms-service/v1/_search", "_search", [], requestBody);
        console.log(payload, "payload")
        const {MdmsRes : {Booking: { Sector}}}= payload
        this.setState({sectorList: Sector})
        const {MdmsRes : {Booking: { BookingRoles}}}= payload
        this.setState({roleCode: BookingRoles})
    } catch (error) {
        alert("error")
    }


    this.setState({updateData: {}})
    
    this.fetchTableData()
  
     
    }


  async fetchTableData(){
    this.setState({isLoading: true})

    
    const headers=['Id','Sector','UUID','Last Modified Date','Created Date','Role','Name','User Id', 'Action']

    const foundUser = this.props.userInfo && this.props.userInfo.roles.some(el => el.code === 'BK_MCC_HELPDESK_USER');
    if(foundUser)
    {
    let feeResponse = await httpRequest(
        "bookings/master/approver/_fetch",
        "_search",
        [],[]
      );
      let  feeData={}
      let feeDataRes=feeResponse.data
      
      feeData.rows= feeDataRes
      feeData.headers=headers
      this.setState({data: feeData})

      }else{
        let feeData={}
        feeData.headers=headers
        feeData.rows= []
        this.setState({data: feeData})
      }
    
      this.setState({isLoading: false})
  }
    

  state = {
    
    roleCode: [],
    data:{
      rows: [],
      headers: []
    },
    mdmsRes: {}, 
    sectorList: [],
    page: 0,
    rowsPerPage: 5,
    isLoading: true, 
    open: false,
    updateData: {},
    columnHideIndex:[0,2,7],
    mdmsResCg: {},
    filterfun: {
      fn: (item) => {
        return item;
      }
    }

  };
  
  async handleEditClick (row) {
     this.setState({updateData: row})
    
     this.handleClickOpen();
   }
  
 
  

   
  handleClickOpen() {
    
    this.setState({ open: true });

  }

  handleClose() {
    this.setState({ open: false });
    this.setState({ updateData: {} });
    this.fetchTableData()
    
  }

  
  
  handleSearch(e) {
    const target = e.target;
    let filterfun = this.state.filterfun;
    filterfun.fn = (item) => {
      if (target.value === "") return item;
      else {
        return item.filter(
          (x) =>
          x.sector.toLowerCase().includes(target.value.toLowerCase()) ||
          x.uuid.includes(target.value) 
         
        );
      }
    };
    this.setState({ filterfun: filterfun });
  }

  handleCreateNew(){
    this.setState({updateData: {}})
    this.setState({open: true})
  }

  render() {
    
   const {classes}= this.props
    return (
      this.state.isLoading===true ? <div > <CircularProgress style={{position: "fixed" , top: '50%', left: '50%'}} /> </div>:
      // <MuiThemeProvider theme={theme}>
      <div> 
        <div align ="right"  >
         <Button primary={true}  label="Create New" style={{margin: '15px'}} onClick={()=>{ this.handleCreateNew() }}/>
        
          
      </div>  
      
      
      
      
      <div class="col-xs-12 " style={{ wordBreak: "break-word"}}>

       
      <Paper style={{overflowX: 'auto'}}>
        <div> 
        <div  style={{display: "flex", justifyContent: "space-between" }}>
        <div style={{width: '75%', margin: '10px' }}>
        <TextFieldIcon
                textFieldStyle={{ height: "48px" , width: '100%'}}
                inputStyle={{
                  marginTop: "4px",
                  left: 0,
                  position: "absolute",
                }}
                iconPosition="after"
                onChange={(e) => {   
                  this.setState({searchValue: e.target.value}) 
                  this.handleSearch(e)}}
                underlineShow={true}
                fullWidth={false}
                hintText={<Label label="BK_ADMIN_SEARCH_BUTTON" />}
                Icon={SearchIcon}
                value={this.state.searchValue}
                id="search-mdms"
                iconStyle={{
                  height: "20px",
                  width: "35px",
                  fill: "#767676",
                }}
              />
              </div>
              
              <IconButton  style={{margin: '10px'}} className={classes.addIcon} size="small" aria-label="add" onClick={()=>this.handleCreateNew()}>
                                  <AddCircleOutlineIcon
                                    size="small"
                                    style={{ fontSize: "20px" }}
                                  />
                                </IconButton>
         </div>
          
  
        
        <TableUi data={this.state.data} columnHideIndex={this.state.columnHideIndex} filterfun={this.state.filterfun} handleEditClick={this.handleEditClick.bind(this)} />
        </div>
        
        </Paper>
        <div>
         <DialogComponent roleCode={this.state.roleCode} sectorList={this.state.sectorList} open={this.state.open} fetchTableData={this.fetchTableData.bind(this)}  handleClose={this.handleClose.bind(this)} updateData={this.state.updateData} /> 
        </div>
        </div> 
    
          
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log('state in all app', state)
  
  const { userInfo } = state.auth;

  return {userInfo}
};


export default withStyles(styles)(connect(
  mapStateToProps,
  null
)(SimpleTable))