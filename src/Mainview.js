import React,{Component} from 'react';
import ButtonAppBar from './Appbar.js';
import Machinegridlist from './components/machinegridlist.js';
import Machine_catalog from './constants/machine_catalog.js';
import Customers_catalog from './constants/customers.js';
import Dealer from './constants/dealer.js';
import Booking from './components/booking.js';
import { Container } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';

import { ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import 'moment/locale/fr';


class Mainview extends Component{
    constructor(props){
        super(props)
        this.state={action:'home'}
        
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
                allBookingDates = [...allBookingDates,...element.booking_dates];
            });
        }
        this.setState({machine:machine,action:action,allBookingDates:allBookingDates})
    }

    setContractToState=(tempBookingDates,customerOnContract,unitChoice,bookingType)=>{
        const contract = [tempBookingDates,customerOnContract,unitChoice,bookingType];
        this.setState({'contract':contract});
        //const datefromBookingDates = bookingDates.map((element)=>((element)));
    }
    setNavigationHeader=()=>{
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
                        <Icon style={{color:'#515150',alignSelf:'left'}}>{icon}</Icon>
                    </IconButton>
                </div> 
                <div>
                    <Typography variant="h6" style={{color:'#515150',marginLeft:'15px'}}>
                    {title.toUpperCase()}
                    </Typography>
                </div>
                
            </div>
        )
        
    }

    async componentDidMount(){
        await Promise.resolve(this.setState({Machine_catalog:Machine_catalog}));
        await Promise.resolve(this.setState({dealer:Dealer[0]}));
        await Promise.resolve(this.setState({Customers_catalog:Customers_catalog}));
    }
    componentDidUpdate(){
        console.log('state : ',this.state);
    }

    render(){
        const dealer = this.state.dealer;
        const action = this.state.action;
        const machine = this.state.machine
        const machineCatalog = this.state.Machine_catalog;
        const customersCatalog = this.state.Customers_catalog;

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
                            this.setNavigationHeader()
                        }
                        {
                            action==='booking'
                            ?<Booking
                                machine={machine}
                                dealer={dealer}
                                Customers_catalog={customersCatalog}
                                setContractToState={this.setContractToState}
                                allBookingDates={this.state.allBookingDates}/>
                            :<Machinegridlist handleMachineAction={this.handleMachineAction} machine_catalog={machineCatalog}/>
                        }
                    </Container>
                </ThemeProvider>
            </div>
            
        )
    }
}
export default Mainview