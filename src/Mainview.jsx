import React,{Component} from 'react';
import Moment from 'moment';

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
        this.state={action:'home',messageSnackbarIsOpen:false,titleColor : '#515150'}
        
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
        /**CREATE AN ARRAY OF ALLBOOKINGDATES TO SET THE DATEPICKER */
        let allBookingDates = [];

        if(machine.booking){
            machine.booking.filter(
                element=>element.status==='contract'
            ).forEach(
                element => {
                allBookingDates = [...allBookingDates,...element.bookingDates];
            });
        
        /**ADD THE firstBookingDate TO EACH BOOKING IN A MOMENT FORMAT TO SORT THE BOOKINGS */
            machine.booking.forEach(
                element=>{
                element.firstBookingDate = Moment(element.bookingDates[0]).add(1, 'M');
            })
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

    /**RTF : MERGE IT WITH handlemachineaction */
    setActionState = (value)=>{
        this.setState({action:value});
    }

    setNavigationHeader=(titleColor)=>{
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
        console.log('titleColor : ',titleColor);
        return(
            <div className='marginTopBottom30'>
                <div>
                    <IconButton aria-label='Home' onClick={()=>this.setState({action:'home'})}>
                        <Icon style={{color:'#515150'}}>{icon}</Icon>
                    </IconButton>
                </div> 
                <div>
                    <Typography variant="h6" style={{color:this.state.titleColor,marginLeft:'15px'}}>
                    {title.toUpperCase()}
                    </Typography>
                </div>
                
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


        return(
            
            <div>
                <ThemeProvider theme={this.theme}>
                    <ButtonAppBar 
                        setActionState={this.setActionState}
                        color={dealer&&dealer.color?dealer.color:'grey'} 
                        backgroundColor={dealer&&dealer.backgroundColor?dealer.backgroundColor:'#E4B363'} 
                        title={dealer&&dealer.name?dealer.name:'AGRILOCATION'}
                    />
                    
                    <Container>
                        
                        {
                            this.setNavigationHeader(dealerColor,dealerBackgroundColor,this.state.titleColor)
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
                                titleColor={this.state.titleColor}
                                dealerColor={dealerColor}
                                dealerBackgroundColor={dealerBackgroundColor}
                                returnHomeInformUser={this.returnHomeInformUser}
                                updateCatalogMachine={this.updateCatalogMachine}>
                                </Addmachine>
                                :(
                                    action==='bookinglist'
                                    ?<Bookinglist 
                                    titleColor={this.state.titleColor}
                                    dealerColor={dealerColor}
                                    dealerBackgroundColor={dealerBackgroundColor}
                                    machine={this.state.machine}
                                    updateCatalogMachine={this.updateCatalogMachine}
                                    returnHomeInformUser={this.returnHomeInformUser}>
                                    </Bookinglist>
                                    :
                                    <Machinegridlist
                                        titleColor={this.state.titleColor}
                                        dealerColor={dealerColor}
                                        dealerBackgroundColor={dealerBackgroundColor}
                                        handleMachineAction={this.handleMachineAction}
                                        machine_catalog={machineCatalog}
                                        setActionState={this.setActionState}
                                        returnHomeInformUser={this.returnHomeInformUser}
                                        updateCatalogMachine={this.updateCatalogMachine}
                                    />
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