import React,{Component} from 'react';

import Addbooking from './components/addbooking.js';
import Addmachine from './components/addmachine.js';
import Bookinglist from './components/bookinglist';
import ButtonAppBar from './Appbar.js';
import Customers_catalog from './constants/customers.js';
import Machinegridlist from './components/machinegridlist.js';

import CloseIcon from '@material-ui/icons/Close';
import Dealer from './constants/dealer.js';
import Icon from '@material-ui/core/Icon';
import { Container,Button,Typography } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Axios from 'axios';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import { ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import 'moment/locale/fr';


class Mainview extends Component{
    constructor(props){
        super(props)
        this.state={action:'home',messageSnackbarIsOpen:false}
        
    }

    theme = createMuiTheme({
        palette: {
          primary: {main:'#84BC38'},
          secondary: {main:'#84BC38'}
        },
        status: {
          danger: 'orange',
        },
    });

    handleMachineAction = (machine,action)=>{
        /**SET THE STATE : MACHINE = MACHINE PARAMETERS FROM CATALOG, ACTION = PAGE TO SET, ALLBOOKINGDATES = MERGING ALL THE DAY BOOKED FOR THE MACHINE */
        let allBookingDates = [];
        if(machine.booking){
            machine.booking.filter(
                element=>element.status==='contract'
            ).forEach(
                element => {
                allBookingDates = [...allBookingDates,...element.bookingDates];
            });
        }
        this.setState({machine:machine,action:action,allBookingDates:allBookingDates})
    }

    returnHomeInformUser=(message)=>{
        this.setState({messageSnackbarIsOpen:true,snackbarMessage:message,action:'home'});
    }

    setContractToState=(contract)=>{
        this.setState({'contract':contract});
        //const datefromBookingDates = bookingDates.map((element)=>((element)));
    }
    setNavigationHeader=(dealerColor,dealerBackgroundColor,titleColor)=>{
        const action = this.state.action
        let icon='';
        let title = '';

        switch(action){
            case 'home':
                icon = 'home';
                title = 'accueil';
                break;
            default:
                icon = 'arrow_back';
                title = 'retour';
        }

        return(
            <div className='marginTopBottom30'>
                <div>
                    <IconButton aria-label='Home' onClick={()=>this.setState({action:'home'})}>
                        <Icon style={{color:'#515150'}}>{icon}</Icon>
                    </IconButton>
                </div> 
                <div>
                    <Typography variant="h6" style={{color:titleColor,marginLeft:'15px'}}>
                    {title.toUpperCase()}
                    </Typography>
                </div>
                {
                this.state.action==='home'
                &&
                    <div style={{textAlign:'right'}}>
                        <Button
                            variant="contained"
                            onClick={()=>this.setState({action:'new_machine'})}
                            style={{color:dealerColor,backgroundColor:dealerBackgroundColor}}
                            startIcon={<AddCircleOutlineIcon />}
                        >
                            Ajouter une machine
                        </Button>
                    </div>
                }
                
            </div>
        )
        
    }

    snackBarHandleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        this.setState({messageSnackbarIsOpen:false});
      }

    updateCatalogMachine=async()=>{
        try{
            const axiosResponse = await Axios({
              method: "get",
              url: 'http://localhost:4001/get/machine'
            });
            
            const MACHINE_CATALOG = axiosResponse.data;
            this.setState({Machine_catalog:MACHINE_CATALOG.data});
            
        }
        catch(error){
            console.log('error: ',error);
        }
      }

    async componentDidMount(){
        //await Promise.resolve(this.setState({Machine_catalog:Machine_catalog}));
        await Promise.resolve(this.setState({dealer:Dealer[0]}));
        await Promise.resolve(this.setState({Customers_catalog:Customers_catalog}));
        await Promise.resolve(this.updateCatalogMachine());
        
    }

    async componentDidUpdate(){
        
        console.log('state : ',this.state);
    }

    render(){
        const dealer = this.state.dealer;
        const action = this.state.action;
        const machine = this.state.machine
        const machineCatalog = this.state.Machine_catalog;
        const customersCatalog = this.state.Customers_catalog;
        const dealerColor = this.state.dealer&&this.state.dealer.color;
        const dealerBackgroundColor = this.state.dealer&&this.state.dealer.backgroundColor;
        const titleColor = '#515150';

        return(
            
            <div>
                <ThemeProvider theme={this.theme}>
                    <ButtonAppBar 
                        color={dealer&&dealer.color?dealer.color:'grey'} 
                        backgroundColor={dealer&&dealer.backgroundColor?dealer.backgroundColor:'#E4B363'} 
                        title={dealer&&dealer.name?dealer.name:'AGRILOCATION'}
                    />
                    
                    <Container>
                        
                        {
                            this.setNavigationHeader(dealerColor,dealerBackgroundColor,titleColor)
                        }
                        {
                            action==='booking'
                            ?<Addbooking
                                machine={machine}
                                dealer={dealer}
                                Customers_catalog={customersCatalog}
                                setContractToState={this.setContractToState}
                                allBookingDates={this.state.allBookingDates}
                                returnHomeInformUser={this.returnHomeInformUser}
                                updateCatalogMachine={this.updateCatalogMachine}
                            />
                            :(
                                action==='new_machine'
                                ?<Addmachine 
                                titleColor={titleColor}
                                dealerColor={dealerColor}
                                dealerBackgroundColor={dealerBackgroundColor}
                                returnHomeInformUser={this.returnHomeInformUser}>
                                </Addmachine>
                                :(
                                    action==='bookinglist'
                                    ?<Bookinglist 
                                    titleColor={titleColor}
                                    dealerColor={dealerColor}
                                    dealerBackgroundColor={dealerBackgroundColor}
                                    machine={this.state.machine}
                                    updateCatalogMachine={this.updateCatalogMachine}
                                    returnHomeInformUser={this.returnHomeInformUser}>
                                    </Bookinglist>
                                    :
                                    <Machinegridlist handleMachineAction={this.handleMachineAction} machine_catalog={machineCatalog}/>
                                )
                            )
                        }
                    </Container>
                    <Snackbar
                        anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                        }}
                        open={this.state.messageSnackbarIsOpen}
                        autoHideDuration={4000}
                        onClose={this.snackBarHandleClose}
                        message={this.state.snackbarMessage&&this.state.snackbarMessage}
                        action={
                        <React.Fragment>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={this.snackBarHandleClose}>
                            <CloseIcon fontSize="small" />
                            </IconButton>
                        </React.Fragment>
                        }
                    />
                </ThemeProvider>
            </div>
            
        )
    }
}
export default Mainview